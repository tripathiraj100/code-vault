const express = require("express");
const db = require("./database");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Autonomous AI Creator backend is running."
    });
});


// Initialize Agent
// app.post("/api/agent/init", (req, res) => {

//     const { persona } = req.body;

//     if (!persona) {
//         return res.status(400).json({
//             error: "Persona is required."
//         });
//     }

//     const agentId =
//         "agent-" + Date.now();

//     console.log("Agent initialized:", persona);

//     res.json({
//         agentId: agentId
//     });
// });
app.post("/api/agent/init", async (req, res) => {

    try {
        const { persona } = req.body;

        // Validate persona
        if (!persona || !persona.name || !persona.domain) {
            return res.status(400).json({
                error: "Persona name and domain are required."
            });
        }

        // Generate unique agent ID
        const agentId = "agent-" + Date.now();

        // Current UTC time
        const createdAt = new Date();

        // Save agent into MySQL
        await db.execute(
            `INSERT INTO agents 
            (id, name, domain, created_at)
            VALUES (?, ?, ?, ?)`,
            [
                agentId,
                persona.name,
                persona.domain,
                createdAt
            ]
        );

        console.log("✅ Agent saved:", agentId);

        // Return required response
        res.json({
            agentId: agentId
        });

    } catch (error) {

        console.error("❌ Agent initialization failed:");
        console.error(error.message);

        res.status(500).json({
            error: "Failed to initialize agent."
        });
    }
});


// Get Feed
// app.get("/api/agent/feed", (req, res) => {

//     const { agentId } = req.query;

//     if (!agentId) {
//         return res.status(400).json({
//             error: "agentId is required."
//         });
//     }

//     res.json({
//         posts: []
//     });
// });
app.get("/api/agent/feed", async (req, res) => {

    try {
        const { agentId } = req.query;

        if (!agentId) {
            return res.status(400).json({
                error: "agentId is required."
            });
        }

        // Check that the agent exists
        const [agents] = await db.execute(
            `SELECT id FROM agents WHERE id = ?`,
            [agentId]
        );

        if (agents.length === 0) {
            return res.status(404).json({
                error: "Agent not found."
            });
        }

        // Get posts, newest first
        const [posts] = await db.execute(
            `SELECT 
                id,
                created_at,
                text,
                rationale,
                sources
             FROM posts
             WHERE agent_id = ?
             ORDER BY created_at DESC`,
            [agentId]
        );

        // Convert database rows to hackathon API format
        const formattedPosts = posts.map(post => ({
            id: post.id,
            createdAt: new Date(post.created_at).toISOString(),
            text: post.text,
            rationale: post.rationale,
            sources: typeof post.sources === "string"
                ? JSON.parse(post.sources)
                : post.sources
        }));

        res.json({
            posts: formattedPosts
        });

    } catch (error) {

        console.error("❌ Feed error:");
        console.error(error.message);

        res.status(500).json({
            error: "Failed to retrieve feed."
        });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running at http://localhost:${PORT}`
    );
});