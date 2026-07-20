import React, { useState } from "react";
import {
    Bot,
    Sparkles,
    Headphones,
    MessageCircle,
    Send,
    X,
    ChevronDown,
    Palette,
    Smile,
    Globe2,
    LayoutPanelLeft,
    Plus,
    Trash2,
} from "lucide-react";

const avatarOptions = [
    { id: "bot", icon: Bot },
    { id: "sparkles", icon: Sparkles },
    { id: "headphones", icon: Headphones },
    { id: "message", icon: MessageCircle },
];

const colorOptions = [
    { id: "plum", value: "#40295C" },
    { id: "indigo", value: "#3B4FE0" },
    { id: "emerald", value: "#0F9D6E" },
    { id: "amber", value: "#B4791A" },
    { id: "rose", value: "#C1315E" },
    { id: "slate", value: "#334155" },
];

const toneOptions = ["Friendly", "Professional", "Playful", "Formal"];
const languageOptions = ["English", "Spanish", "French", "German", "Hindi", "Tamil"];

const Field = ({ label, hint, children }) => (
    <div className="space-y-2.5">
        <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {label}
            </p>
            {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
        </div>
        {children}
    </div>
);

const Section = ({ icon: Icon, title, children }) => (
    <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 text-[#40295C]">
                <Icon size={15} strokeWidth={2.2} />
            </div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h2>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
    </div>
);

const ChatbotWidgetBuilder = () => {
    const [name, setName] = useState("Aria");
    const [welcome, setWelcome] = useState(
        "Hi there 👋 I'm Aria. Ask me anything about pricing, setup, or your account."
    );
    const [avatar, setAvatar] = useState("bot");
    const [color, setColor] = useState("#40295C");
    const [tone, setTone] = useState("Friendly");
    const [language, setLanguage] = useState("English");
    const [position, setPosition] = useState("right");
    const [suggestions, setSuggestions] = useState([
        "How do I reset my password?",
        "What are your pricing plans?",
    ]);
    const [newSuggestion, setNewSuggestion] = useState("");
    const [widgetOpen, setWidgetOpen] = useState(true);

    const AvatarIcon = avatarOptions.find((a) => a.id === avatar)?.icon || Bot;

    const addSuggestion = () => {
        const trimmed = newSuggestion.trim();
        if (!trimmed) return;
        setSuggestions((s) => [...s, trimmed]);
        setNewSuggestion("");
    };

    const removeSuggestion = (idx) => {
        setSuggestions((s) => s.filter((_, i) => i !== idx));
    };

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text">
                        Create Chatbot
                    </h1>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Configure Behavior & Preview Widget
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-600 transition-all hover:border-zinc-300 hover:text-zinc-950">
                        Cancel
                    </button>
                    <button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#40295C] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-900 hover:scale-[1.01] active:scale-[0.99] shadow-sm">
                        Save Chatbot
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Left: Form */}
                <div className="xl:col-span-2 space-y-6">
                    <Section icon={Bot} title="Identity">
                        <Field label="Chatbot Name">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Aria"
                                className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-colors focus:border-zinc-400 placeholder:text-zinc-400"
                            />
                        </Field>

                        <Field label="Welcome Message" hint="Shown as the first bubble when a visitor opens the chat.">
                            <textarea
                                value={welcome}
                                onChange={(e) => setWelcome(e.target.value)}
                                rows={3}
                                className="w-full resize-none rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-colors focus:border-zinc-400 placeholder:text-zinc-400"
                            />
                        </Field>

                        <Field label="Avatar">
                            <div className="flex gap-3">
                                {avatarOptions.map(({ id, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setAvatar(id)}
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${avatar === id
                                                ? "border-[#40295C] bg-[#40295C]/5 text-[#40295C]"
                                                : "border-zinc-200/80 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
                                            }`}
                                    >
                                        <Icon size={17} strokeWidth={2.2} />
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </Section>

                    <Section icon={Palette} title="Appearance">
                        <Field label="Accent Color">
                            <div className="flex flex-wrap gap-3">
                                {colorOptions.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setColor(c.value)}
                                        style={{ backgroundColor: c.value }}
                                        className={`h-9 w-9 rounded-full ring-2 ring-offset-2 transition-all ${color === c.value ? "ring-zinc-900" : "ring-transparent"
                                            }`}
                                        aria-label={c.id}
                                    />
                                ))}
                            </div>
                        </Field>

                        <Field label="Widget Position">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPosition("left")}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${position === "left"
                                            ? "border-[#40295C] bg-[#40295C]/5 text-[#40295C]"
                                            : "border-zinc-200/80 text-zinc-500 hover:border-zinc-300"
                                        }`}
                                >
                                    <LayoutPanelLeft size={15} />
                                    Bottom Left
                                </button>
                                <button
                                    onClick={() => setPosition("right")}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${position === "right"
                                            ? "border-[#40295C] bg-[#40295C]/5 text-[#40295C]"
                                            : "border-zinc-200/80 text-zinc-500 hover:border-zinc-300"
                                        }`}
                                >
                                    <LayoutPanelLeft size={15} className="-scale-x-100" />
                                    Bottom Right
                                </button>
                            </div>
                        </Field>
                    </Section>

                    <Section icon={Smile} title="Behavior">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field label="Tone">
                                <div className="relative">
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-colors focus:border-zinc-400"
                                    >
                                        {toneOptions.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={15}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />
                                </div>
                            </Field>

                            <Field label="Language">
                                <div className="relative">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-colors focus:border-zinc-400"
                                    >
                                        {languageOptions.map((l) => (
                                            <option key={l} value={l}>
                                                {l}
                                            </option>
                                        ))}
                                    </select>
                                    <Globe2
                                        size={15}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />
                                </div>
                            </Field>
                        </div>

                        <Field label="Suggested Questions" hint="Quick-reply chips shown above the input.">
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s, idx) => (
                                    <span
                                        key={idx}
                                        className="group flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/40 px-3.5 py-2 text-xs font-medium text-zinc-600"
                                    >
                                        {s}
                                        <button
                                            onClick={() => removeSuggestion(idx)}
                                            className="text-zinc-350 transition-colors hover:text-rose-500"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 pt-1">
                                <input
                                    type="text"
                                    value={newSuggestion}
                                    onChange={(e) => setNewSuggestion(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addSuggestion()}
                                    placeholder="Add a suggested question"
                                    className="flex-1 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 outline-none transition-colors focus:border-zinc-400 placeholder:text-zinc-400"
                                />
                                <button
                                    onClick={addSuggestion}
                                    className="flex items-center justify-center rounded-xl border border-zinc-200/80 bg-white px-4 text-zinc-500 transition-all hover:border-zinc-300 hover:text-zinc-950"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </Field>
                    </Section>
                </div>

                {/* Right: Live Preview */}
                <div className="xl:sticky xl:top-8 xl:self-start">
                    <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/20 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <div className="border-b border-zinc-200/60 p-6 flex items-center justify-between bg-white">
                            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                                Live Preview
                            </h2>
                            <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-zinc-200/50">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Syncing
                            </span>
                        </div>

                        {/* Mock website canvas */}
                        <div className="relative h-[560px] bg-[linear-gradient(135deg,#fafafa_25%,transparent_25%),linear-gradient(225deg,#fafafa_25%,transparent_25%),linear-gradient(45deg,#fafafa_25%,transparent_25%),linear-gradient(315deg,#fafafa_25%,#ffffff_25%)] bg-[length:20px_20px]">
                            {/* fake browser chrome */}
                            <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 border-b border-zinc-200/60 bg-white/90 backdrop-blur px-4 py-2.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <div className="ml-3 flex-1 rounded-md bg-zinc-100/80 px-3 py-1 text-[10px] font-medium text-zinc-400">
                                    yoursite.com
                                </div>
                            </div>

                            {/* Chat window */}
                            {widgetOpen && (
                                <div
                                    className={`absolute bottom-20 w-[300px] overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-xl transition-all ${position === "right" ? "right-5" : "left-5"
                                        }`}
                                >
                                    <div
                                        className="flex items-center justify-between px-4 py-3.5"
                                        style={{ backgroundColor: color }}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">
                                                <AvatarIcon size={15} strokeWidth={2.2} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white leading-tight">
                                                    {name || "Chatbot"}
                                                </p>
                                                <p className="flex items-center gap-1 text-[10px] font-medium text-white/70">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                    Online · {tone}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setWidgetOpen(false)}
                                            className="text-white/70 transition-colors hover:text-white"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="max-h-[260px] space-y-3 overflow-y-auto bg-zinc-50/40 p-4">
                                        <div className="flex items-start gap-2">
                                            <div
                                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                                                style={{ backgroundColor: color }}
                                            >
                                                <AvatarIcon size={11} strokeWidth={2.2} />
                                            </div>
                                            <div className="max-w-[210px] rounded-2xl rounded-tl-sm bg-white border border-zinc-200/70 px-3.5 py-2.5 text-xs leading-relaxed text-zinc-700 shadow-sm">
                                                {welcome || "Say hello to your visitors here."}
                                            </div>
                                        </div>

                                        {suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pl-8">
                                                {suggestions.map((s, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded-full border px-2.5 py-1.5 text-[10px] font-medium transition-colors"
                                                        style={{
                                                            borderColor: `${color}33`,
                                                            color: color,
                                                            backgroundColor: `${color}0d`,
                                                        }}
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 border-t border-zinc-100 bg-white p-3">
                                        <input
                                            disabled
                                            placeholder="Type a message…"
                                            className="flex-1 rounded-full border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-2 text-xs text-zinc-400 outline-none"
                                        />
                                        <button
                                            style={{ backgroundColor: color }}
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                                        >
                                            <Send size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Launcher bubble */}
                            <button
                                onClick={() => setWidgetOpen((o) => !o)}
                                style={{ backgroundColor: color }}
                                className={`absolute bottom-5 flex h-13 w-13 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 ${position === "right" ? "right-5" : "left-5"
                                    }`}
                            >
                                {widgetOpen ? <X size={20} /> : <AvatarIcon size={20} strokeWidth={2.2} />}
                            </button>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs font-medium text-zinc-400">
                        This is exactly how {name || "your chatbot"} will appear on your site.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatbotWidgetBuilder;