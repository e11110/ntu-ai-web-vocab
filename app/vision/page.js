"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import { faEye } from "@fortawesome/free-solid-svg-icons"
import VocabGenResultCard from "@/components/VocabGenResultCard";

export default function Vision() {
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);
    const [image, setImage] = useState(null);
    const [aiResponse, setAiResponse] = useState(null);
    const [savedResults, setSavedResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch saved results when page loads
    useEffect(() => {
        axios.get('/api/vision-ai')
            .then(response => {
                console.log("Fetched vision results:", response.data);
                setSavedResults(response.data);
            })
            .catch(error => {
                console.error("Error fetching vision results:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // e is the event object
    const changeHandler = (e) => {
        e.preventDefault();
        // Get the file from the event object
        const file = e.target.files[0];
        // Create a FileReader to read the file
        const reader = new FileReader();
        // When file is loaded as data URL
        reader.onload = () => {
            // Get base64 string by removing data URL prefix
            const base64String = reader.result.split(',')[1];
            setImage(base64String);
            // Post base64 image to vision-ai endpoint
            setIsWaiting(true);
            axios.post('/api/vision-ai', { base64: base64String })
                .then(response => {
                    console.log("Vision AI Response:", response.data);
                    setAiResponse(response.data);
                    // Add new result to saved results
                    setSavedResults([response.data, ...savedResults]);
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Error: " + error.response?.data?.error || error.message);
                })
                .finally(() => {
                    setIsWaiting(false);
                });
        };

        // Read file as data URL which gives us base64
        reader.readAsDataURL(file);
    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/vision/page.js" />
            <PageHeader title="AI Vision" icon={faEye} />
            <section>
                <div className="container mx-auto">
                    <label
                        htmlFor="imageUploader"
                        className="inline-block bg-green-700 hover:bg-green-500 text-white p-2 rounded-lg"
                    >
                        Upload Image
                    </label>
                    <input
                        className="hidden"
                        id="imageUploader"
                        type="file"
                        onChange={changeHandler}
                        accept=".jpg, .jpeg, .png"
                    />
                </div>
            </section>
            <section className="mt-8">
                <div className="container mx-auto">
                    {/* Current Analysis Section */}
                    {image && (
                        <div className="space-y-8 mb-12">
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <h3 className="text-lg font-bold mb-4">Current Analysis</h3>
                                <img
                                    src={`data:image/jpeg;base64,${image}`}
                                    alt="Uploaded"
                                    className="w-full max-w-2xl mx-auto rounded-lg"
                                />
                            </div>
                            <div>
                                {isWaiting ? (
                                    <div className="animate-pulse bg-white p-4 rounded-xl shadow-sm">
                                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/2 mt-4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-5/6 mt-4"></div>
                                    </div>
                                ) : aiResponse && (
                                    <>
                                        <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
                                            <h3 className="text-lg font-bold mb-4">Image Description</h3>
                                            <p className="text-slate-600 whitespace-pre-wrap">{aiResponse.description}</p>
                                        </div>
                                        <VocabGenResultCard result={aiResponse} />
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Previous Results Section */}
                    {isLoading ? (
                        <div className="space-y-4">
                            <div className="animate-pulse bg-white p-4 rounded-xl shadow-sm">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2 mt-4"></div>
                            </div>
                            <div className="animate-pulse bg-white p-4 rounded-xl shadow-sm">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2 mt-4"></div>
                            </div>
                        </div>
                    ) : savedResults.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Previous Analyses</h2>
                            <div className="space-y-8">
                                {savedResults.map((result, index) => (
                                    <div key={result.createdAt + index} className="space-y-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm">
                                            <img
                                                src={`data:image/jpeg;base64,${result.imageBase64}`}
                                                alt={result.title}
                                                className="w-full max-w-2xl mx-auto rounded-lg"
                                            />
                                            <div className="mt-4">
                                                <h3 className="text-lg font-bold mb-2">Image Description</h3>
                                                <p className="text-slate-600 whitespace-pre-wrap">{result.description}</p>
                                            </div>
                                        </div>
                                        <VocabGenResultCard result={result} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}