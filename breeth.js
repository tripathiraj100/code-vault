// require("dotenv").config();

// async function testBreeth() {
//     try {
//         const response = await fetch("https://api.thebreeth.com/v1/episodes", {
//             method: "POST",

//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.BREETH_API_KEY}`
//             },

//             body: JSON.stringify({
//                 content: "Our AI Security persona prefers publishing technically useful and well-sourced AI security developments.",
//                 group_id: "autonomous-ai-creator",
//                 extract_intent: true
//             })
//         });

//         const data = await response.json();

//         console.log("Breeth status:", response.status);
//         console.log("Breeth response:");
//         console.log(JSON.stringify(data, null, 2));

//     } catch (error) {
//         console.error("Breeth connection failed:");
//         console.error(error.message);
//     }
// }

// testBreeth();
require("dotenv").config();

const BREETH_URL = "https://api.thebreeth.com";

async function remember(agentId, content) {
    try {
        const response = await fetch(
            `${BREETH_URL}/v1/episodes`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.BREETH_API_KEY}`
                },

                body: JSON.stringify({
                    content: content,
                    group_id: agentId,
                    extract_intent: true
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.message ||
                `Breeth returned ${response.status}`
            );
        }

        console.log("🧠 Breeth memory saved.");

        return data;

    } catch (error) {

        console.error(
            "❌ Breeth memory error:"
        );

        console.error(
            error.message
        );

        return null;
    }
}


async function searchMemory(agentId, query) {

    try {

        const response = await fetch(
            `${BREETH_URL}/v1/search`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.BREETH_API_KEY}`
                },

                body: JSON.stringify({
                    query: query,
                    group_id: agentId,
                    limit: 10
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.message ||
                `Breeth returned ${response.status}`
            );
        }

        return data;

    } catch (error) {

        console.error(
            "❌ Breeth search error:"
        );

        console.error(
            error.message
        );

        return null;
    }
}


module.exports = {
    remember,
    searchMemory
};