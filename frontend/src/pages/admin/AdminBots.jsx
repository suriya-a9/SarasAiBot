import React, { useState, useEffect } from "react";
import {
    Bot,
    Search,
    Globe2,
    MessageSquare,
    ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminAuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminBots = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        loadBots();
    }, []);

    async function loadBots() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/bots`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to load bots");
            const json = await res.json();
            const payload = Array.isArray(json) ? json : json?.data || [];
            if (json && typeof json === "object" && json.success === false) {
                throw new Error(json.message || json.error || "Failed to load bots");
            }
            setBots(payload);
        } catch (err) {
            setError(err.message || "Failed to load bots");
        } finally {
            setLoading(false);
        }
    }

    async function toggleActive(bot) {
        const nextActive = !bot.is_active;
        setTogglingId(bot.id);

        setBots((prev) =>
            prev.map((b) => (b.id === bot.id ? { ...b, is_active: nextActive } : b))
        );

        try {
            const res = await fetch(`${API_BASE_URL}/api/bots/${bot.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ is_active: nextActive }),
            });
            if (!res.ok) throw new Error("Failed to update bot status");
            const json = await res.json();
            if (!json.success && json.success !== undefined) throw new Error("Failed to update bot status");
        } catch (err) {
            setBots((prev) =>
                prev.map((b) => (b.id === bot.id ? { ...b, is_active: bot.is_active } : b))
            );
            setError(err.message);
        } finally {
            setTogglingId(null);
        }
    }

    const filteredBots = bots.filter((b) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            b.name?.toLowerCase().includes(q) ||
            b.company?.toLowerCase().includes(q) ||
            b.client_name?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text">
                        Bots
                    </h1>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        {bots.length} Total Bot{bots.length === 1 ? "" : "s"}
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search bot, company…"
                        className="w-full rounded-xl border border-zinc-200/80 bg-zinc-50/30 py-2.5 pl-9 pr-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none"
                    />
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error}
                </div>
            )}

            <div className="mt-8 rounded-2xl border border-zinc-200/60 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                {loading ? (
                    <p className="p-6 text-sm font-medium text-zinc-400">Loading…</p>
                ) : filteredBots.length === 0 ? (
                    <p className="p-6 text-sm font-medium text-zinc-400">No bots found.</p>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {filteredBots.map((bot) => (
                            <div
                                key={bot.id}
                                className="flex flex-col gap-4 p-6 transition-colors hover:bg-zinc-50/30 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200/60 text-zinc-500"
                                        style={{
                                            backgroundColor: bot.accent_color
                                                ? `${bot.accent_color}14`
                                                : "#f4f4f5",
                                            color: bot.accent_color || "#71717a",
                                        }}
                                    >
                                        <Bot size={18} strokeWidth={2} />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold text-zinc-950">
                                            {bot.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                                            {(bot.company || bot.client_name) && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Globe2 size={12} />
                                                    {bot.company || bot.client_name}
                                                </span>
                                            )}
                                            {bot.language && (
                                                <span className="inline-flex items-center gap-1">
                                                    <MessageSquare size={12} />
                                                    {bot.tone ? `${bot.tone} · ` : ""}
                                                    {bot.language}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 md:justify-end">
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${bot.is_active
                                                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                : "bg-zinc-100 border-zinc-200 text-zinc-500"
                                            }`}
                                    >
                                        {bot.is_active ? "Active" : "Inactive"}
                                    </span>

                                    <button
                                        onClick={() => navigate(`/admin-bot/${bot.id}`)}
                                        className="group inline-flex items-center gap-1 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40"
                                    >
                                        View
                                        <ArrowUpRight
                                            size={12}
                                            className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBots;