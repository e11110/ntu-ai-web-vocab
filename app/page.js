"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import VocabGenResultCard from "@/components/VocabGenResultCard";
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("Chinese");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);
  // Add loading state for initial fetch
  const [isLoading, setIsLoading] = useState(true);

  const languageList = ["Chinese", "Japanese", "Korean", "Spanish", "French", "German", "Italian", "Russian"];

  // Fetch vocab lists when page loads
  useEffect(() => {
    axios.get("/api/vocab-ai")
      .then(response => {
        console.log("Fetched vocab lists:", response.data);
        setVocabList(response.data);
      })
      .catch(error => {
        console.error("Error fetching vocab lists:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const submitHandler = (e) => {
    // prevents reloading the page when the form is submitted
    e.preventDefault();
    console.log("User Input: ", userInput);
    console.log("Language: ", language);
    // body is the data that will be sent to the backend
    const body = { userInput, language };
    console.log("body:", body);
    // use axios to send the body to the backend
    // use then and catch to handle the response and error
    setIsWaiting(true);
    axios.post("/api/vocab-ai", body)
      .then(response => {
        console.log("Response:", response.data);
        // Add the new result to the vocabList
        setVocabList([response.data, ...vocabList]);
        // Clear the input field after successful submission
        setUserInput("");
      })
      .catch(error => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsWaiting(false);
      });
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
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
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  {
                    languageList.map(language => <option key={language} value={language}>{language}</option>)
                  }
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* Show loading state while fetching initial data */}
          {isLoading ? (
            <div className="text-center py-4">
              <VocabGenResultPlaceholder />
            </div>
          ) : (
            <>
              {/* 等待後端回應時要顯示的載入畫面 */}
              {isWaiting ? <VocabGenResultPlaceholder /> : null}
              {/* Display all vocabulary cards from the list */}
              {vocabList.map((result, index) => (
                <VocabGenResultCard
                  key={result.createdAt + index}
                  result={result}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
}
