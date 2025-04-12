import openai from "@/services/openai";

export async function POST(req) {
    const body = await req.json();
    const { text, language } = body;

    try {
        const mp3 = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "coral",
            input: text,
            instructions: `Speak in a natural tone in ${language}.`
        });

        // Get the audio data as an ArrayBuffer
        const audioData = await mp3.arrayBuffer();
        // Convert ArrayBuffer to Buffer and then to base64
        const buffer = Buffer.from(audioData);
        const base64Audio = buffer.toString('base64');

        return Response.json({ audio: base64Audio });
    } catch (error) {
        console.error("Error generating speech:", error);
        return Response.json({ error: "Failed to generate speech" }, { status: 500 });
    }
} 