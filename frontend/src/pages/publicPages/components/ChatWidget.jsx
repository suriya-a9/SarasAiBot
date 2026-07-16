import { useState, useRef, useEffect } from "react";
import Avatar3D from "./Avatar3D";
import TeaserBubble from "./TeaserBubble";
import CloseIcon from "./CloseIcon";
import SendIcon from "./SendIcon";

const FAQ = [
  {
    q: "What is SaraSAiBot?",
    a: "SaraSAiBot is an AI chatbot platform — build a custom chatbot, train it on your website content, and embed it anywhere in a few clicks.",
    keywords: ["what", "sarasai", "product", "bot"],
  },
  {
    q: "How much does it cost?",
    a: "We have a free plan to get started, plus Pro and Business plans for higher usage. Check the Pricing section for full details.",
    keywords: ["price", "cost", "pricing", "plan"],
  },
  {
    q: "Can I embed this on my own site?",
    a: "Yes! Every chatbot comes with a lightweight embed snippet you can paste into any website, no matter what stack you're using.",
    keywords: ["embed", "website", "install", "widget"],
  },
  {
    q: "Do you offer support?",
    a: "Absolutely — our team is available over email and live chat, and Business plans get a dedicated onboarding specialist.",
    keywords: ["support", "help", "contact"],
  },
];

const FALLBACK_REPLY =
  "Thanks for the message! I'm just a static demo, so I can only answer the quick questions below for now — try one of them 👇";

const WELCOME_MESSAGE = {
  role: "bot",
  text: "Hi 👋 I'm the SaraSAiBot assistant. Ask me anything or tap a question below.",
};

function matchStaticReply(input) {
  const lower = input.toLowerCase();
  const hit = FAQ.find((item) => item.keywords.some((k) => lower.includes(k)));
  return hit ? hit.a : FALLBACK_REPLY;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTeaser(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const pushExchange = (question, answer) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "bot", text: answer },
    ]);
  };

  const askQuestion = (item) => pushExchange(item.q, item.a);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    pushExchange(trimmed, matchStaticReply(trimmed));
    setInput("");
  };

  const resetChat = () => setMessages([WELCOME_MESSAGE]);
  const openChat = () => {
    setOpen(true);
    setShowTeaser(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-4 flex h-120 w-92 flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-blue-900/20">
          <div className="flex items-center justify-between bg-linear-to-r from-blue-600 to-violet-500 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <Avatar3D size={36} ring />
              <div>
                <p className="text-sm font-semibold text-white">SaraS AI</p>
                <p className="flex items-center gap-1 text-xs text-blue-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-white/80 transition hover:bg-black/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFF] px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.role === "bot"
                    ? "rounded-tl-sm bg-white text-[#0B1233] shadow-sm shadow-slate-200"
                    : "ml-auto rounded-tr-sm bg-linear-to-r from-blue-600 to-violet-500 text-white font-medium"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 bg-white px-3 pt-3">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Quick questions
            </p>
            <div className="flex flex-wrap gap-2 pb-3">
              {FAQ.map((item) => (
                <button
                  key={item.q}
                  onClick={() => askQuestion(item)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0B1233] transition hover:border-blue-300 hover:bg-blue-50"
                >
                  {item.q}
                </button>
              ))}
              <button
                onClick={resetChat}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:text-slate-600"
              >
                Reset
              </button>
            </div>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 rounded-full border border-slate-200 bg-[#F8FAFF] px-4 py-2.5 text-sm text-[#0B1233] outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-violet-500 text-white shadow-md shadow-blue-500/30 transition hover:opacity-90 disabled:opacity-40"
              disabled={!input.trim()}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      {!open && showTeaser && <TeaserBubble onOpen={openChat} onDismiss={() => setShowTeaser(false)} />}

      <button
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? "Close chat" : "Open chat"}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-violet-500 shadow-lg shadow-blue-500/40 transition-transform hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-blue-400/40 group-hover:animate-none" />
        {open ? <CloseIcon className="text-white" /> : <Avatar3D size={44} />}
      </button>
    </div>
  );
}
