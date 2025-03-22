import openai from "@/services/openai";
import db from "@/services/db";

// GET is used to get all information
export async function GET(req) {
    const vocabList = [];

    // Get reference to vocab-ai collection
    const vocabRef = db.collection("vocab-ai");
    
    // Get all documents from collection
    const snapshot = await vocabRef.orderBy("createdAt", "desc").get();

    // Add each document's data to vocabList array
    snapshot.forEach(doc => {
        vocabList.push(doc.data());
    });

    return Response.json(vocabList);
}

// POST is used to create new information
export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const { userInput, language } = body;

    // 文件連結：https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js
    // JSON Mode: https://platform.openai.com/docs/guides/text-generation/json-mode?lang=node.js
    const systemPrompt = `
    An AI that generates 5 vocabulary words based on a topic and language.
    For example:

    Topic: hello
    Language: Chinese

    Output JSON format:
    {
        wordList: ["你好", "謝謝", "再見", "請", "請問"],
        enWordList: ["Hi", "Thank you", "Goodbye", "Please", "Excuse me"],
    }
    `;

    const prompt = `Topic: ${userInput}
                    Language: ${language}.`;

    const openAIReqBody = {
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": prompt }
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" }
    };
    const completion = await openai.chat.completions.create(openAIReqBody);
    const payload = completion.choices[0].message.content;
    console.log("payload:", payload);

    const result = {
        title: userInput,
        payload: JSON.parse(payload),
        language: language,
        createdAt: Date.now()
    }

    await db.collection("vocab-ai").add(result);

    return Response.json(result);
}