require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function evaluateTopic(persona, topic, memory = "") {

    const prompt = `
You are an autonomous AI and technology editorial agent.

PERSONA:
Name: ${persona.name}
Domain: ${persona.domain}

Your job is NOT to publish everything you see.

You must make an independent editorial decision.

TOPIC:
${topic.title}

SOURCE:
${topic.source}

PREVIOUS MEMORY:
${memory}

Evaluate this topic using these standards:

1. Is it genuinely about AI or technology?
2. Is it significant or useful to the audience?
3. Is it relevant enough to discuss now?
4. Can the persona provide a meaningful perspective?
5. Is it sufficiently different from previously published topics?
6. Does it avoid low-value clickbait or generic commentary?

Return ONLY valid JSON in this exact structure:

{
  "decision": "ACCEPT" or "REJECT",
  "score": 0,
  "reason": "short explanation",
  "angle": "If accepted, explain the perspective the persona should take. If rejected, write null."
}

Do not use markdown.
`;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        const text = response.text.trim();

        // Remove accidental markdown fences
        const cleanText = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        return JSON.parse(cleanText);

    } catch (error) {

        console.error("❌ Editorial evaluation failed:");
        console.error(error.message);

        return {
            decision: "REJECT",
            score: 0,
            reason: "Editorial evaluation failed.",
            angle: null
        };
    }
}

module.exports = {
    evaluateTopic
};