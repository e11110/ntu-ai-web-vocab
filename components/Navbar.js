import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="shadow-sm w-full h-[50px] flex justify-between items-center px-5 fixed z-[999] top-0 bg-white">
            <Link href="/" className="font-bold text-lg text-slate-900 hover:text-pink-500">
                NextJS with OpenAI
            </Link>
            <div>
                <Link href="/" className="mr-3 text-slate-900 hover:text-pink-500 font-semibold">
                    AI VocabularyGen
                </Link>
                <Link href="/image-generator" className="mr-3 text-slate-900 hover:text-pink-500 font-semibold">
                    AI ImgGen
                </Link>
                <Link href="/vision" className="mr-3 text-slate-900 hover:text-pink-500 font-semibold">
                    AI Vision
                </Link>
                <Link href="/sign-up" className="mr-3 text-slate-900 hover:text-pink-500 font-semibold">
                    Sign up
                </Link>
                <Link href="/log-in" className="mr-3 text-slate-900 hover:text-pink-500 font-semibold">
                    Log in
                </Link>
                <button className="px-3 py-1 text-slate-900 hover:text-white hover:bg-pink-500 font-semibold rounded-md transition-colors">
                    Log out
                </button>
            </div>
        </nav>
    )
}