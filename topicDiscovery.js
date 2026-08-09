const https = require("https");

function fetchNews() {
    return new Promise((resolve, reject) => {

        const url =
            "https://news.google.com/rss/search?q=AI+technology&hl=en-US&gl=US&ceid=US:en";

        https.get(url, (response) => {

            let data = "";

            response.on("data", chunk => {
                data += chunk;
            });

            response.on("end", () => {
                resolve(data);
            });

        }).on("error", error => {
            reject(error);
        });
    });
}

async function discoverTopics() {

    try {

        const rssData = await fetchNews();

        const items = rssData.match(/<item>[\s\S]*?<\/item>/g) || [];

        const topics = items.slice(0, 10).map(item => {

            const title =
                item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";

            // const link =
            //     item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
            let link =
                item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";

            link = link
                .replace(/^\[.*?\]\((.*?)\)$/, "$1")
                .trim();

            return {
                title: title.replace("<![CDATA[", "").replace("]]>", ""),
                source: link
            };

        });

        console.log("🔎 Topics discovered:");

        console.log(JSON.stringify(topics, null, 2));

        return topics;

    } catch (error) {

        console.error("❌ Topic discovery failed:");
        console.error(error.message);

        return [];
    }
}

module.exports = {
    discoverTopics
};