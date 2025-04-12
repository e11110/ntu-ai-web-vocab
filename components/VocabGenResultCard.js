import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCopy, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VocabGenResultCard({ result, onCopy }) {
    const [showToast, setShowToast] = useState(false);
    const [sentences, setSentences] = useState({});  // Store sentences for each word
    const [generatingWords, setGeneratingWords] = useState({}); // Track loading state for each word
    const [speakingWords, setSpeakingWords] = useState({}); // Track speaking state for each word
    const { wordList, enWordList } = result.payload;

    useEffect(() => {
        let timer;
        if (showToast) {
            timer = setTimeout(() => {
                setShowToast(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showToast]);

    const handleCopy = (word) => {
        onCopy(word);
        setShowToast(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleGenerateSentence = async (word) => {
        setGeneratingWords(prev => ({ ...prev, [word]: true }));
        try {
            const response = await axios.post('/api/sentence-ai', {
                word,
                language: result.language
            });
            setSentences(prev => ({
                ...prev,
                [word]: response.data.sentence
            }));
        } catch (error) {
            console.error('Error generating sentence:', error);
        } finally {
            setGeneratingWords(prev => ({ ...prev, [word]: false }));
        }
    };

    const handleSpeak = async (word, sentence) => {
        setSpeakingWords(prev => ({ ...prev, [word]: true }));
        try {
            const response = await axios.post('/api/tts-ai', {
                text: sentence,
                language: result.language
            });
            
            // Create and play audio from base64
            const audio = new Audio(`data:audio/mp3;base64,${response.data.audio}`);
            await audio.play();
        } catch (error) {
            console.error('Error playing speech:', error);
        } finally {
            setSpeakingWords(prev => ({ ...prev, [word]: false }));
        }
    };

    const wordItems = wordList.map((word, idx) => {
        return (
            <div className="p-3 border-2 border-slate-300 rounded-md" key={idx}>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-700">{word}</h3>
                    <div className="flex gap-2">
                        <button 
                            className={`p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors bg-slate-100 ${generatingWords[word] ? 'animate-spin' : ''}`}
                            title="Create example sentence"
                            onClick={() => handleGenerateSentence(word)}
                            disabled={generatingWords[word]}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button 
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors bg-slate-100"
                            title="Copy to input"
                            onClick={() => handleCopy(word)}
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                </div>
                <p className="text-slate-400 mt-3">{enWordList[idx]}</p>
                {sentences[word] && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                            <p className="text-slate-600 flex-1">{sentences[word]}</p>
                            <button
                                className={`ml-3 p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors bg-slate-100 ${speakingWords[word] ? 'animate-pulse' : ''}`}
                                title="Speak sentence"
                                onClick={() => handleSpeak(word, sentences[word])}
                                disabled={speakingWords[word]}
                            >
                                <FontAwesomeIcon icon={faVolumeHigh} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    });

    return (
        <>
            <div className="bg-white shadow-sm p-4 rounded-xl my-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg">{result.title}</h3>
                    <span className="py-2 px-4 bg-slate-200 font-semibold rounded-lg">{result.language}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                    {wordItems}
                </div>
                <p className="mt-3 text-right text-slate-500">
                    Created At: {moment(result.createdAt).format("YYYY/MM/DD HH:mm:ss")}
                </p>
            </div>
            
            {/* Toast Notification */}
            <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg shadow-lg">
                    單字已複製到輸入框！
                </div>
            </div>
        </>
    )
}