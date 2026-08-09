const {
    remember,
    searchMemory
} = require("./breeth");

async function test() {

    const agentId = "memory-test-agent";

    console.log("🧠 Saving memory...");

    await remember(
        agentId,
        "The persona prefers publishing practical AI security developments and avoids generic AI hype."
    );

    console.log("\n🔎 Searching memory...");

    const result = await searchMemory(
        agentId,
        "What does this persona prefer to publish?"
    );

    console.log(
        JSON.stringify(result, null, 2)
    );
}

test();