import React, { useState, useEffect } from "react";
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
    Copy,
    Check,
    ClipboardList,
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

const API_BASE_URL = "http://localhost:8080";

function getClientToken() {
    return localStorage.getItem("clientToken");
}

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

const Toggle = ({ checked, onChange, label, description }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 text-left transition-colors hover:border-zinc-300"
    >
        <div>
            <p className="text-sm font-semibold text-zinc-900">{label}</p>
            {description && <p className="mt-0.5 text-xs text-zinc-400">{description}</p>}
        </div>
        <span
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-[#40295C]" : "bg-zinc-200"
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                    }`}
            />
        </span>
    </button>
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

const ChatbotWidgetBuilder = ({ onSaved }) => {
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

    const [knowledgeBase, setKnowledgeBase] = useState("");

    const [requireContactForm, setRequireContactForm] = useState(false);
    const [contactFormFields, setContactFormFields] = useState(["name", "email"]);

    const toggleContactField = (field) => {
        setContactFormFields((current) =>
            current.includes(field) ? current.filter((f) => f !== field) : [...current, field]
        );
    };

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [savedBotId, setSavedBotId] = useState(null);
    const [copied, setCopied] = useState(false);

    const AvatarIcon = avatarOptions.find((a) => a.id === avatar)?.icon || Bot;

    function applyBotToForm(bot) {
        setSavedBotId(bot.id);
        setName(bot.name || "");
        setWelcome(bot.welcome_message || "");
        setAvatar(bot.avatar || "bot");
        setColor(bot.accent_color || "#40295C");
        setTone(bot.tone || "Friendly");
        setLanguage(bot.language || "English");
        setPosition(bot.widget_position || "right");
        const parsedSuggestions =
            typeof bot.suggestions === "string" ? JSON.parse(bot.suggestions) : bot.suggestions;
        setSuggestions(parsedSuggestions || []);
        setKnowledgeBase(bot.knowledge_base || "");

        setRequireContactForm(!!bot.require_contact_form);
        const parsedFields =
            typeof bot.contact_form_fields === "string"
                ? JSON.parse(bot.contact_form_fields)
                : bot.contact_form_fields;
        setContactFormFields(parsedFields || ["name", "email"]);
    }

    useEffect(() => {
        async function loadExistingBot() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE_URL}/api/bots`, {
                    headers: { Authorization: `Bearer ${getClientToken()}` },
                });
                if (!res.ok) throw new Error("Failed to load your chatbot");
                const bots = await res.json();

                if (bots && bots.length > 0) {
                    applyBotToForm(bots[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadExistingBot();
    }, []);

    const addSuggestion = () => {
        const trimmed = newSuggestion.trim();
        if (!trimmed) return;
        setSuggestions((s) => [...s, trimmed]);
        setNewSuggestion("");
    };

    const removeSuggestion = (idx) => {
        setSuggestions((s) => s.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Chatbot name is required.");
            return;
        }

        setSaving(true);
        setError(null);

        const payload = {
            name,
            tone,
            language,
            welcomeMessage: welcome,
            avatar,
            accentColor: color,
            widgetPosition: position,
            suggestions,
            knowledgeBase,
            requireContactForm,
            contactFormFields,
            systemInstructions: `You are ${name}, a ${tone.toLowerCase()} assistant. Respond in ${language}.`,
        };

        try {
            const isEditing = !!savedBotId;
            const res = await fetch(
                isEditing ? `${API_BASE_URL}/api/bots/${savedBotId}` : `${API_BASE_URL}/api/bots`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getClientToken()}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to save chatbot");
            }

            const bot = await res.json();
            setSavedBotId(bot.id);
            if (onSaved) onSaved(bot);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const embedCode = savedBotId
        ? `<script src="${API_BASE_URL}/widget.js" data-bot-id="${savedBotId}"></script>`
        : null;

    const copyEmbedCode = async () => {
        if (!embedCode) return;
        await navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm font-medium text-zinc-400">
                Loading chatbot…
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text">
                        {savedBotId ? "Edit Chatbot" : "Create Chatbot"}
                    </h1>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Configure Behavior & Preview Widget
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-600 transition-all hover:border-zinc-300 hover:text-zinc-950">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#40295C] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-900 hover:scale-[1.01] active:scale-[0.99] shadow-sm disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {saving ? "Saving…" : "Save Chatbot"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error}
                </div>
            )}

            {embedCode && (
                <div className="mt-6 rounded-2xl border border-zinc-200/60 bg-zinc-50/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                        Embed code
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 overflow-x-auto rounded-lg bg-zinc-900 px-3 py-2.5 text-xs text-zinc-100">
                            {embedCode}
                        </code>
                        <button
                            onClick={copyEmbedCode}
                            className="flex items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-white px-3 py-2.5 text-xs font-semibold text-zinc-600 hover:border-zinc-300"
                        >
                            {copied ? <Check size={13} /> : <Copy size={13} />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                        Paste this snippet into your website's HTML, right before the closing &lt;/body&gt; tag.
                    </p>
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
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

                        <Field label="Knowledge Base" hint="Paste FAQ content, product info, or policies. The bot answers using this.">
                            <textarea
                                value={knowledgeBase}
                                onChange={(e) => setKnowledgeBase(e.target.value)}
                                rows={5}
                                placeholder="e.g. Business hours are 9am-6pm IST, Monday to Friday. Returns accepted within 30 days..."
                                className="w-full resize-none rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-colors focus:border-zinc-400 placeholder:text-zinc-400"
                            />
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

                    <Section icon={ClipboardList} title="Pre-chat Form">
                        <Toggle
                            checked={requireContactForm}
                            onChange={setRequireContactForm}
                            label="Require contact form before chat"
                            description="Visitors must submit their details before they can start chatting."
                        />

                        {requireContactForm && (
                            <Field label="Fields to collect">
                                <div className="flex flex-wrap gap-2">
                                    {["name", "email", "phone"].map((field) => (
                                        <button
                                            key={field}
                                            onClick={() => toggleContactField(field)}
                                            className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-all ${contactFormFields.includes(field)
                                                ? "border-[#40295C] bg-[#40295C]/5 text-[#40295C]"
                                                : "border-zinc-200/80 text-zinc-500 hover:border-zinc-300"
                                                }`}
                                        >
                                            {field}
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        )}
                    </Section>
                </div>

                <div className="xl:sticky xl:top-8 xl:self-start">
                    <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/20 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <div className="border-b border-zinc-200/60 p-6 flex items-center justify-between bg-white">
                            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                                Live Preview
                            </h2>
                            <span className="flex items-center gap-1.5 rounded-md bg-zinc-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-zinc-200/50">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {savedBotId ? "Saved" : "Unsaved"}
                            </span>
                        </div>

                        <div className="relative h-140 bg-[linear-gradient(135deg,#fafafa_25%,transparent_25%),linear-gradient(225deg,#fafafa_25%,transparent_25%),linear-gradient(45deg,#fafafa_25%,transparent_25%),linear-gradient(315deg,#fafafa_25%,#ffffff_25%)] bg-size-[20px_20px]">
                            <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 border-b border-zinc-200/60 bg-white/90 backdrop-blur px-4 py-2.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                                <div className="ml-3 flex-1 rounded-md bg-zinc-100/80 px-3 py-1 text-[10px] font-medium text-zinc-400">
                                    yoursite.com
                                </div>
                            </div>

                            {widgetOpen && (
                                <div
                                    className={`absolute bottom-20 w-75 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-xl transition-all ${position === "right" ? "right-5" : "left-5"
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

                                    <div className="max-h-65 space-y-3 overflow-y-auto bg-zinc-50/40 p-4">
                                        <div className="flex items-start gap-2">
                                            <div
                                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                                                style={{ backgroundColor: color }}
                                            >
                                                <AvatarIcon size={11} strokeWidth={2.2} />
                                            </div>
                                            <div className="max-w-52.5 rounded-2xl rounded-tl-sm bg-white border border-zinc-200/70 px-3.5 py-2.5 text-xs leading-relaxed text-zinc-700 shadow-sm">
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