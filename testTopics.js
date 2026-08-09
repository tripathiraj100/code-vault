const { discoverTopics } = require("./topicDiscovery");

async function test() {

    const topics = await discoverTopics();

    console.log(`\nFound ${topics.length} topics.`);

}

test();