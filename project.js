// console.log("Autonomous AI Creator dashboard loaded.");


// // Temporary demo data.
// // Later, this will come from our FastAPI backend.

// const agent = {
//     name: "Aegis",
//     domain: "AI Security Researcher",
//     status: "active"
// };


// console.log("Agent:", agent);
console.log("Autonomous AI Creator dashboard loaded.");

const API_URL = "http://localhost:3000";

// let agentId = null;
let agentId = localStorage.getItem("agentId");
// let agentId = "agent-628ca7d3-ecb3-4016-b194-5c629adda5d6";


// ------------------------------------------------
// INITIALIZE AGENT
// ------------------------------------------------

async function initializeAgent() {

    try {

        const response = await fetch(`${API_URL}/api/agent/init`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                persona: {
                    name: "Aegis",
                    domain: "AI Security Researcher"
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Agent initialization failed.");
        }

        agentId = data.agentId;

        localStorage.setItem("agentId", agentId);

        console.log("✅ Agent initialized:", agentId);

        // Load feed after initialization
        await loadFeed();

    } catch (error) {

        console.error("❌ Agent initialization failed:", error);

    }
}


// ------------------------------------------------
// LOAD AGENT FEED
// ------------------------------------------------

async function loadFeed() {

    if (!agentId) {
        console.error("Agent ID is missing.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/agent/feed?agentId=${encodeURIComponent(agentId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to load feed.");
        }

        console.log("📰 Agent feed:", data.posts);

        displayPosts(data.posts);

    } catch (error) {

        console.error("❌ Feed loading failed:", error);

    }
}


// ------------------------------------------------
// DISPLAY POSTS
// ------------------------------------------------

// function displayPosts(posts) {

//     console.log(`📚 ${posts.length} posts received.`);

//     // For now, display the posts in the browser console.
//     // We will connect them to your actual HTML UI next.

//     posts.forEach((post, index) => {

//         console.log(`
//         ------------------------------
//         POST ${index + 1}
//         ------------------------------
//         ${post.text}

//         Rationale:
//         ${post.rationale}

//         Created:
//         ${post.createdAt}
//         `);

//     });
// }
function displayPosts(posts) {

    const container = document.getElementById("postsContainer");
    const postCount = document.querySelector(".post-count");

    if (!container) {
        console.error("❌ postsContainer not found.");
        return;
    }

    // Clear the demo posts from the HTML
    container.innerHTML = "";

    // Update post count
    if (postCount) {
        postCount.textContent = `${posts.length} POSTS`;
    }

    // No posts
    if (posts.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No publications yet.</p>
            </div>
        `;

        return;
    }

    // Create real posts
    posts.forEach(post => {

        const article = document.createElement("article");
        article.className = "post";

        const createdDate = post.createdAt
            ? new Date(post.createdAt).toLocaleString()
            : "Recently";

        const sources = Array.isArray(post.sources)
            ? post.sources
            : [];

        const sourceLink = sources.length > 0
            ? sources[0]
            : "#";

        article.innerHTML = `
            <div class="post-header">

                <div class="post-avatar">
                    A
                </div>

                <div>
                    <strong>Aegis</strong>

                    <span>
                        AI Security · ${createdDate}
                    </span>
                </div>

            </div>

            <p class="post-text">
                ${escapeHtml(post.text || "")}
            </p>

            <div class="rationale">

                <span class="rationale-label">
                    WHY SELECTED
                </span>

                <p>
                    ${escapeHtml(post.rationale || "No rationale available.")}
                </p>

            </div>

            <div class="post-footer">

                <span>
                    ● Relevant now
                </span>

                <a href="${escapeAttribute(sourceLink)}"
                   target="_blank"
                   rel="noopener noreferrer">
                    View source →
                </a>

            </div>
        `;

        container.appendChild(article);
    });

    console.log(`✅ ${posts.length} real posts rendered in dashboard.`);
}


// ------------------------------------------------
// SECURITY HELPERS
// ------------------------------------------------

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHtml(value);
}


// ------------------------------------------------
// START
// ------------------------------------------------

// initializeAgent();
// if (agentId) {
//     console.log("♻️ Existing agent found:", agentId);
//     loadFeed();
// } else {
//     initializeAgent();
// }


// localStorage.setItem("agentId", agentId);

// console.log("✅ Agent initialized:", agentId);

if (agentId) {
    console.log("♻️ Existing agent found:", agentId);
    loadFeed();
} else {
    initializeAgent();
}