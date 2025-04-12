import openai from "@/services/openai";

export async function POST(req) {
    const body = await req.json();
    const { word, language } = body;

    const systemPrompt = `
    You are an AI that generates example sentences using given vocabulary words.
    Create a natural, contextual sentence that demonstrates proper usage of the word.
    The sentence should be in the specified language.
    
    You must respond in JSON format with the following structure:
    {
        "sentence": "The example sentence here"
    }
    `;

    const userPrompt = `Generate a sentence using the word "${word}" in ${language}. Remember to respond in JSON format.`;

    const openAIReqBody = {
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": userPrompt }
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" }
    };

    try {
        const completion = await openai.chat.completions.create(openAIReqBody);
        const response = JSON.parse(completion.choices[0].message.content);
        return Response.json(response);
    } catch (error) {
        console.error("Error generating sentence:", error);
        return Response.json({ error: "Failed to generate sentence" }, { status: 500 });
    }
}

