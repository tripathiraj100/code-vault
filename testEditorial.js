const { evaluateTopic } = require("./editorial");

async function test() {

    const persona = {
        name: "Aegis",
        domain: "AI Security"
    };

    const topic = {
        title: "New AI security research reveals prompt injection risks",
        source: "https://example.com"
    };

    const result = await evaluateTopic(persona, topic);

    console.log("\n🧠 Editorial decision:");
    console.log(JSON.stringify(result, null, 2));
}

test();