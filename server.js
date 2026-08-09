const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const db = require("./database");
const { discoverTopics } = require("./topicDiscovery");
const { evaluateTopic } = require("./editorial");
const { generatePost } = require("./postGenerator");
const { remember, searchMemory } = require("./breeth");

const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
    res.json({
        message: "Autonomous AI Creator backend is running."
    });
});


// ======================================================
// INITIALIZE AGENT
// ======================================================

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
        const agentId = "agent-" + crypto.randomUUID();

        const createdAt = new Date();

        // Save agent in MySQL
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
        await remember(
            agentId,
            `Agent persona initialized.

        Name: ${persona.name}
        Domain: ${persona.domain}

        The agent should independently discover AI and technology topics,
        evaluate their relevance, avoid repetitive content,
        and publish useful original insights.`
        );

        console.log("✅ Agent initialized:", agentId);
        console.log("Persona:", persona);

        // Start autonomous worker
        startAutonomousAgent(agentId, persona);

        // Return required hackathon response
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


// ======================================================
// AUTONOMOUS AGENT
// ======================================================

async function runAgentCycle(agentId, persona) {

    console.log("\n====================================");
    console.log("🤖 Autonomous cycle started");
    console.log("Agent:", agentId);
    console.log("Persona:", persona.name);
    console.log("====================================\n");

    try {

        // ------------------------------------------------
        // 1. DISCOVER LIVE TOPICS
        // ------------------------------------------------

        console.log("🔎 Discovering live topics...");

        const topics = await discoverTopics();

        console.log(`Found ${topics.length} topics.`);

        if (topics.length === 0) {
            console.log("No topics discovered.");
            return;
        }


        // ------------------------------------------------
        // 2. CHECK PREVIOUS POSTS
        // ------------------------------------------------
        console.log("🧠 Retrieving Breeth memory...");

        const breethMemory = await searchMemory(
            agentId,
            "What does this agent know about its persona, previous decisions, published topics, preferences, and editorial strategy?"
        );

        console.log("🧠 Breeth memory retrieved.");

        const [previousPosts] = await db.execute(
            `SELECT text, rationale
             FROM posts
             WHERE agent_id = ?
             ORDER BY created_at DESC
             LIMIT 10`,
            [agentId]
        );

        let memory = "";

        if (previousPosts.length > 0) {

            memory = previousPosts
                .map((post, index) => {
                    return `Previous Post ${index + 1}:
        ${post.text}
        Reason:
        ${post.rationale}`;
                })
                .join("\n\n");
        }
        // Breeth memory
        if (breethMemory) {

            memory += `

        BREETH MEMORY:
        ${JSON.stringify(breethMemory, null, 2)}
        `;
        }


        // ------------------------------------------------
        // 3. EVALUATE TOPICS
        // ------------------------------------------------

        for (const topic of topics) {

            console.log("\n🧠 Evaluating:");
            console.log(topic.title);

            const decision = await evaluateTopic(
                persona,
                topic,
                memory
            );

            console.log(
                `Decision: ${decision.decision} | Score: ${decision.score}`
            );

            console.log(
                `Reason: ${decision.reason}`
            );


            // ------------------------------------------------
            // REJECTED TOPIC
            // ------------------------------------------------

            if (
                decision.decision !== "ACCEPT" ||
                decision.score < 70
            ) {

                console.log("❌ Topic rejected.");
                await remember(
                    agentId,
                    `Editorial decision: REJECTED
            Topic: ${topic.title}
            Score: ${decision.score}
            Reason: ${decision.reason}`
                );

                continue;
            }


            // ------------------------------------------------
            // 4. GENERATE POST
            // ------------------------------------------------

            console.log("✍️ Generating post...");

            const generatedPost = await generatePost(
                persona,
                topic,
                decision
            );

            if (!generatedPost) {

                console.log(
                    "⚠️ Post generation failed."
                );

                continue;
            }


            // ------------------------------------------------
            // 5. SAVE POST TO MYSQL
            // ------------------------------------------------

            const postId =
                "post-" + crypto.randomUUID();

            const createdAt = new Date();

            await db.execute(
                `INSERT INTO posts
                (id, agent_id, created_at, text, rationale, sources)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    postId,
                    agentId,
                    createdAt,
                    generatedPost.text,
                    generatedPost.rationale,
                    JSON.stringify(generatedPost.sources)
                ]
            );
            await remember(
                agentId,
                `Published post.

            Topic: ${topic.title}

            Post:
            ${generatedPost.text}

            Editorial rationale:
            ${generatedPost.rationale}

            Editorial score:
            ${decision.score}

            Source:
            ${topic.source}`
            );


            console.log("\n🎉 POST PUBLISHED");
            console.log("------------------------------");
            console.log(generatedPost.text);
            console.log("------------------------------");


            // ------------------------------------------------
            // IMPORTANT:
            // Only publish ONE post per cycle.
            // ------------------------------------------------

            break;
        }

    } catch (error) {

        console.error(
            "❌ Autonomous cycle failed:"
        );

        console.error(error.message);
    }
}


// ======================================================
// START AUTONOMOUS WORKER
// ======================================================

function startAutonomousAgent(agentId, persona) {

    console.log(
        `🤖 Autonomous agent started: ${agentId}`
    );

    // First cycle after 10 seconds
    setTimeout(() => {

        runAgentCycle(
            agentId,
            persona
        );

    }, 10000);


    // Repeat every 30 minutes
    setInterval(() => {

        runAgentCycle(
            agentId,
            persona
        );

    }, 30 * 60 * 1000);
}


// ======================================================
// FEED ENDPOINT
// ======================================================

app.get("/api/agent/feed", async (req, res) => {

    try {

        const { agentId } = req.query;

        if (!agentId) {

            return res.status(400).json({
                error: "agentId is required."
            });
        }


        // Check agent
        const [agents] = await db.execute(
            `SELECT id
             FROM agents
             WHERE id = ?`,
            [agentId]
        );


        if (agents.length === 0) {

            return res.status(404).json({
                error: "Agent not found."
            });
        }


        // Get posts
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


        // Convert to required API format
        const formattedPosts = posts.map(post => ({

            id: post.id,

            createdAt:
                new Date(
                    post.created_at
                ).toISOString(),

            text: post.text,

            rationale:
                post.rationale,

            sources:
                typeof post.sources === "string"
                    ? JSON.parse(post.sources)
                    : post.sources

        }));


        res.json({
            posts: formattedPosts
        });


    } catch (error) {

        console.error(
            "❌ Feed error:"
        );

        console.error(
            error.message
        );

        res.status(500).json({
            error: "Failed to retrieve feed."
        });
    }
});


// ======================================================
// START SERVER
// ======================================================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server running at http://localhost:${PORT}`
    );

});