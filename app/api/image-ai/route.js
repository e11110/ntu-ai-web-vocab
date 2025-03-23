import openai from "@/services/openai";
import axios from "axios";
import db from "@/services/db";

// GET method to fetch all images
export async function GET(req) {
    const imageList = [];

    // Get reference to image-ai collection
    const imageRef = db.collection("image-ai");
    
    // Get all documents from collection, ordered by createdAt in descending order
    const snapshot = await imageRef.orderBy("createdAt", "desc").get();

    // Add each document's data to imageList array
    snapshot.forEach(doc => {
        imageList.push(doc.data());
    });

    return Response.json(imageList);
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const { userInput } = body;

    // 文件連結: https://platform.openai.com/docs/guides/images/usage

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: userInput,
        n: 1,
        size: "1024x1024",
    });
      
    const openAIImageURL = response.data[0].url;
    console.log("openAIImageURL:", openAIImageURL);

    // First, get the image data from OpenAI URL
    const imageResponse = await axios.get(openAIImageURL, {
        responseType: 'arraybuffer'
    });
    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');

    // Upload to Imgur
    const imgurResponse = await axios.post('https://api.imgur.com/3/image', {
        image: base64Image,
        type: 'base64'
    }, {
        headers: {
            'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            'Content-Type': 'application/json'
        }
    });

    const imgurURL = imgurResponse.data.data.link;
    console.log("imgurURL:", imgurURL);

    const data = {
        imageURL: imgurURL,
        prompt: userInput,
        createdAt: Date.now()
    }

    // save data to firebase
    await db.collection("image-ai").add(data);
    
    console.log("Generated timestamp:", data.createdAt);
    return Response.json(data);
}