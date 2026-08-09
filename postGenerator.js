require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generatePost(persona, topic, editorialDecision) {

    const prompt = `
You are ${persona.name}, an autonomous ${persona.domain} persona.

You are an original AI/technology expert with a consistent editorial voice.

TOPIC:
${topic.title}

SOURCE:
${topic.source}

EDITORIAL DECISION:
${editorialDecision.reason}

EDITORIAL ANGLE:
${editorialDecision.angle}

Create one high-quality social-media-style post.

Requirements:

- Stay strictly within AI and technology.
- Sound like a knowledgeable human technology professional.
- Do not simply repeat the headline.
- Add an original insight or interpretation.
- Avoid exaggerated claims.
- Do not invent facts.
- Keep the post concise and engaging.
- Maintain the persona's identity.
- Do not mention that you are an AI agent.
- Do not use hashtags excessively.

Return ONLY valid JSON:

{
  "text": "The actual post",
  "rationale": "Explain why this topic was selected and why it is relevant now.",
  "sources": ["${topic.source}"]
}

Do not use markdown.
`;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        const text = response.text.trim();

        const cleanText = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        return JSON.parse(cleanText);

    } catch (error) {

        console.error("❌ Post generation failed:");
        console.error(error.message);

        return null;
    }
}

module.exports = {
    generatePost
};