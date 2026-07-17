import file from "../../../assets/file.png";
import { useNavigate, Link } from "react-router-dom";

export default function Nav() {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br shadow-md shadow-blue-500/20">
                        <img src={file} alt="logo" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-[#0B1233]">SaraSAiBot</span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
                    <a href="#features" className="hover:text-[#0B1233] transition-colors">
                        Features
                    </a>
                    <a href="#pricing" className="hover:text-[#0B1233] transition-colors">
                        Pricing
                    </a>
                    <a href="#faq" className="hover:text-[#0B1233] transition-colors">
                        FAQ
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <button className="hidden text-sm font-semibold text-slate-600 hover:text-[#0B1233] sm:block cursor-pointer" onClick={() => navigate("/login")}>
                        Log in
                    </button>
                    <button className="rounded-full bg-linear-to-r from-blue-600 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:opacity-90 cursor-pointer"
                        onClick={() => navigate("/register")}>
                        Start for free
                    </button>
                </div>
            </div>
        </header>
    );
}