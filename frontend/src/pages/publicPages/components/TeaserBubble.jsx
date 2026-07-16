import Avatar3D from "./Avatar3D";

export default function TeaserBubble({ onOpen, onDismiss }) {
    return (
        <div className="mb-3 max-w-57.5 animate-[fadeInUp_0.3s_ease-out]">
            <div className="relative rounded-2xl rounded-br-md border border-slate-100 bg-white px-4 py-3 pr-7 shadow-xl shadow-blue-900/10">
                <button
                    onClick={onDismiss}
                    aria-label="Dismiss"
                    className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                    <span className="text-xs leading-none">✕</span>
                </button>
                <button onClick={onOpen} className="flex w-full items-start gap-2 text-left">
                    <Avatar3D size={28} />
                    <span className="pt-0.5 text-sm leading-snug text-[#0B1233]">
                        Hi, I'm <span className="font-semibold">SaraS AI</span> 👋
                        <br />
                        How can I help you?
                    </span>
                </button>
            </div>
        </div>
    );
}