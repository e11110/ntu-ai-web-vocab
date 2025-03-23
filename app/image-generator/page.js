"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);
    const [cardList, setCardList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all cards when page loads
    useEffect(() => {
        axios.get('/api/image-ai')
            .then(response => {
                console.log("Fetched image cards:", response.data);
                setCardList(response.data);
            })
            .catch(error => {
                console.error("Error fetching image cards:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);
        setIsWaiting(true);
        axios.post('/api/image-ai', body)
            .then(response => {
                console.log("Response:", response.data);
                // put response.data into the front of cardList
                setCardList([response.data, ...cardList]);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error: " + error.response.data.error);
            })
            .finally(() => {
                setIsWaiting(false);
                setUserInput("");
            });
    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI Image Generator" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    type="text"
                                    className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                                    placeholder="Enter a word or phrase"
                                    required
                                />
                            </div>
                            <div className="w-1/5 px-2">
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>
                <div className="container mx-auto grid grid-cols-3 gap-4 px-2 mt-8">
                    {isLoading ? (
                        <>
                            <ImageGenPlaceholder />
                            <ImageGenPlaceholder />
                            <ImageGenPlaceholder />
                        </>
                    ) : (
                        <>
                            {isWaiting && <ImageGenPlaceholder />}
                            {/* display all items in cardList */}
                            {cardList.map((card, index) => (
                                <ImageGenCard
                                    key={card.createdAt + index}
                                    imageURL={card.imageURL}
                                    prompt={card.prompt}
                                    createdAt={card.createdAt}
                                />
                            ))}
                        </>
                    )}
                </div>
            </section>
        </>
    )
}