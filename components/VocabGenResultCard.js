import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCopy } from "@fortawesome/free-solid-svg-icons";

export default function VocabGenResultCard({ result }) {
    const { wordList, enWordList } = result.payload;
    const wordItems = wordList.map((word, idx) => {
        return (
            <div className="p-3 border-2 border-slate-300 rounded-md" key={idx}>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-700">{word}</h3>
                    <div className="flex gap-2">
                        <button 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors bg-slate-100"
                            title="Create example sentence"
                            onClick={() => console.log('Create example for:', word)}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button 
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors bg-slate-100"
                            title="Copy to input"
                            onClick={() => console.log('Copy:', word)}
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                </div>
                <p className="text-slate-400 mt-3">{enWordList[idx]}</p>
            </div>
        )
    })
    return (
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
    )
}