const { generatePost } = require("./postGenerator");

async function test() {

    const persona = {
        name: "Aegis",
        domain: "AI Security"
    };

    const topic = {
        title: "New AI security research reveals prompt injection risks",
        source: "https://example.com"
    };

    const editorialDecision = {
        decision: "ACCEPT",
        score: 90,
        reason: "Prompt injection is a critical and evolving AI security problem.",
        angle: "Analyze the practical defense implications for enterprise LLM integrations."
    };

    const post = await generatePost(
        persona,
        topic,
        editorialDecision
    );

    console.log("\n📝 Generated post:");
    console.log(JSON.stringify(post, null, 2));
}

test();