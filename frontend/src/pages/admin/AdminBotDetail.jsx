import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Bot,
    Palette,
    MessageCircle,
    Cpu,
    LayoutGrid,
    FileText,
    Smile,
    Contact,
    Calendar,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AdminAuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminBotDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [bot, setBot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBot();
    }, [id]);

    async function loadBot() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/bots/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to load bot");
            const json = await res.json();
            if (!json.success) throw new Error("Failed to load bot");
            setBot(json.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6 md:p-8 lg:p-12">
                <p className="text-sm font-medium text-zinc-400">Loading…</p>
            </div>
        );
    }

    if (error || !bot) {
        return (
            <div className="min-h-screen bg-white p-6 md:p-8 lg:p-12">
                <button
                    onClick={() => navigate("/admin-bots")}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900"
                >
                    <ArrowLeft size={14} /> Back to Bots
                </button>
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error || "Bot not found."}
                </div>
            </div>
        );
    }

    const fields = [
        { label: "Tone", value: bot.tone, icon: Palette },
        { label: "Language", value: bot.language, icon: MessageCircle },
        { label: "Widget Position", value: bot.widget_position, icon: LayoutGrid },
        { label: "Avatar", value: bot.avatar, icon: Smile },
        { label: "Welcome Message", value: bot.welcome_message, icon: Bot },
        {
            label: "Requires Contact Form",
            value: bot.require_contact_form ? "Yes" : "No",
            icon: Contact,
        },
        {
            label: "Contact Form Fields",
            value:
                Array.isArray(bot.contact_form_fields) && bot.contact_form_fields.length
                    ? bot.contact_form_fields.join(", ")
                    : "—",
            icon: FileText,
        },
        {
            label: "Created At",
            value: bot.created_at ? new Date(bot.created_at).toLocaleString() : "—",
            icon: Calendar,
        },
        {
            label: "Updated At",
            value: bot.updated_at ? new Date(bot.updated_at).toLocaleString() : "—",
            icon: Calendar,
        },
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <button
                onClick={() => navigate("/admin-bots")}
                className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
                <ArrowLeft size={14} /> Back to Bots
            </button>

            <div className="flex flex-col gap-6 border-b border-zinc-100 pb-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                    <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50 text-zinc-400"
                        style={{ color: bot.accent_color || undefined }}
                    >
                        <Bot size={26} strokeWidth={2} />
                    </div>
                    <div>
                        <h1
                            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                            style={{ color: bot.accent_color || "#40295C" }}
                        >
                            {bot.name}
                        </h1>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Bot ID: {bot.id}
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold border ${bot.is_active
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-zinc-100 border-zinc-200 text-zinc-500"
                        }`}
                >
                    <Cpu size={14} className="mr-1.5" />
                    {bot.is_active ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map((field) => {
                    const Icon = field.icon;
                    return (
                        <div
                            key={field.label}
                            className="rounded-2xl border border-zinc-200/60 bg-zinc-50/20 p-6"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/60 bg-white text-zinc-500">
                                    <Icon size={16} strokeWidth={2.2} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                        {field.label}
                                    </p>
                                    <p className="text-sm font-semibold text-zinc-900 wrap-break-word whitespace-pre-line">
                                        {field.value || "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 rounded-2xl border border-zinc-200/60 bg-zinc-50/20 p-6">
                <h2 className="text-xl font-bold text-zinc-950 mb-2">System Instructions</h2>
                <p className="text-sm text-zinc-700 whitespace-pre-line">
                    {bot.system_instructions || "—"}
                </p>
            </div>

            {/* <div className="mt-6 rounded-2xl border border-zinc-200/60 bg-zinc-50/20 p-6">
                <h2 className="text-xl font-bold text-zinc-950 mb-2">Knowledge Base</h2>
                <p className="text-sm text-zinc-700 whitespace-pre-line">
                    {bot.knowledge_base || "—"}
                </p>
            </div> */}
        </div>
    );
};

export default AdminBotDetail;