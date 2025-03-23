import Image from "next/image";
import moment from 'moment';

export default function ImageGenCard({ imageURL, prompt, createdAt }) {
    return (
        <div className="shadow-sm rounded-md overflow-hidden bg-white">
            <img
                src={imageURL}
                alt={prompt}
                width={1024}
                height={1024}
                className="w-full"
            />
            <div className="p-3">
                <h3 className="text-md">{prompt}</h3>
                <p className="mt-2 text-right text-slate-500">
                    Created At: {moment(createdAt).format("YYYY/MM/DD HH:mm:ss")}
                </p>
            </div>
        </div>
    )
}