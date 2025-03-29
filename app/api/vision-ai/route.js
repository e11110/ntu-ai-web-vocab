import openai from "@/services/openai";
import db from "@/services/db";

// GET method to fetch all vision results
export async function GET(req) {
    const visionList = [];

    // Get reference to vision-ai collection
    const visionRef = db.collection("vision-ai");
    
    // Get all documents from collection, ordered by createdAt in descending order
    const snapshot = await visionRef.orderBy("createdAt", "desc").get();

    // Add each document's data to visionList array
    snapshot.forEach(doc => {
        visionList.push(doc.data());
    });

    return Response.json(visionList);
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    
    const openAIReqBody = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an AI that analyzes images and provides a title, description, and relevant vocabulary words. Respond in the following JSON format: { title: string, description: string, wordList: string[], enWordList: string[] }. The title should be a concise 2-4 word summary of the image. The wordList should contain 5 key words from the image, and enWordList should contain their definitions WITHOUT including the word itself. For example, if a word is 'cat', its definition should be 'domestic feline pet' not 'cat: domestic feline pet' or 'a cat is a domestic feline pet'."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: "Analyze this image and provide a concise title, description, and 5 relevant vocabulary words with their definitions." },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${body.base64}`
                        }
                    }
                ]
            }
        ],
        max_tokens: 500,
        response_format: { type: "json_object" }
    };
    
    const completion = await openai.chat.completions.create(openAIReqBody);
    console.log("completion:", completion);

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    
    // Format the response to match VocabGenResultCard expectations and include image data
    const response = {
        title: aiResponse.title,
        language: "English",
        createdAt: Date.now(),
        description: aiResponse.description,
        imageBase64: body.base64,
        payload: {
            wordList: aiResponse.wordList,
            enWordList: aiResponse.enWordList
        }
    };

    // Save to Firebase
    await db.collection("vision-ai").add(response);

    return Response.json(response);
}