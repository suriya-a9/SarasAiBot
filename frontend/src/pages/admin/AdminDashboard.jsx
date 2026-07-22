import React, { useState, useEffect } from "react";
import {
    Building2,
    Bot,
    TrendingUp,
    Activity,
    Users,
    MessageSquare,
    ArrowUpRight,
    UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminAuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [counts, setCounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCounts();
    }, []);

    async function loadCounts() {
        setLoading(true);
        setError(null);
        try {
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`${API_BASE_URL}/api/admin/dashboard-count`, {
                headers: authHeaders,
            });
            if (!res.ok) throw new Error("Failed to load dashboard counts");
            const json = await res.json();
            if (!json.success) throw new Error("Failed to load dashboard counts");
            setCounts(json.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const avgBotsPerClient =
        counts && counts.clients > 0 ? (counts.bots / counts.clients).toFixed(1) : "—";

    const statCards = [
        {
            title: "Total Clients",
            value: counts ? counts.clients.toLocaleString() : "—",
            icon: Building2,
            color: "text-blue-600 border-blue-100 bg-blue-50/30",
        },
        {
            title: "Total Bots",
            value: counts ? counts.bots.toLocaleString() : "—",
            icon: Bot,
            color: "text-violet-600 border-violet-100 bg-violet-50/30",
        },
        {
            title: "Avg Bots / Client",
            value: avgBotsPerClient,
            icon: TrendingUp,
            color: "text-emerald-600 border-emerald-100 bg-emerald-50/30",
        },
    ];

    const liveCards = [
        {
            title: "Active Bots",
            value: counts ? counts.activeBots.toLocaleString() : "—",
            icon: Activity,
            hint: "bots currently deployed/live",
            color: "text-emerald-600 border-emerald-100 bg-emerald-50/30",
        },
        {
            title: "New Clients (7d)",
            value: counts ? counts.newClients7d.toLocaleString() : "—",
            icon: UserPlus,
            hint: "signups this week",
            color: "text-blue-600 border-blue-100 bg-blue-50/30",
        },
        {
            title: "Messages Today",
            value: counts ? counts.messagesToday.toLocaleString() : "—",
            icon: MessageSquare,
            hint: "platform-wide message volume",
            color: "text-violet-600 border-violet-100 bg-violet-50/30",
        },
        {
            title: "Active End Users",
            value: counts ? counts.activeEndUsers.toLocaleString() : "—",
            icon: Users,
            hint: "unique visitors, last 30 days",
            color: "text-amber-600 border-amber-100 bg-amber-50/30",
        },
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Platform-Wide Overview
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error}
                </div>
            )}

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {statCards.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.title}
                            className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50/20 p-6 transition-all hover:border-zinc-300 hover:bg-zinc-50/50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                        {item.title}
                                    </p>
                                    <h2 className="text-3xl font-bold tracking-tight text-zinc-950 tabular-nums">
                                        {loading ? "—" : item.value}
                                    </h2>
                                </div>
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.color} transition-colors`}
                                >
                                    <Icon size={18} strokeWidth={2.2} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {liveCards.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.title}
                            className="relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50/20 p-6 transition-all hover:border-zinc-300 hover:bg-zinc-50/50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                        {item.title}
                                    </p>
                                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950 tabular-nums">
                                        {loading ? "—" : item.value}
                                    </h2>
                                    <p className="text-xs text-zinc-400">{item.hint}</p>
                                </div>
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.color} transition-colors`}>
                                    <Icon size={18} strokeWidth={2.2} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] xl:col-span-3">
                    <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-4">
                        Quick Admin Actions
                    </h2>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        <button
                            onClick={() => navigate("/admin-client/")}
                            className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40"
                        >
                            <span>Manage Clients</span>
                            <ArrowUpRight
                                size={14}
                                className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600"
                            />
                        </button>

                        <button
                            onClick={() => navigate("/admin/bots")}
                            className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40"
                        >
                            <span>Manage Bots</span>
                            <ArrowUpRight
                                size={14}
                                className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600"
                            />
                        </button>

                        <button
                            onClick={() => navigate("/admin/settings")}
                            className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40"
                        >
                            <span>Platform Settings</span>
                            <ArrowUpRight
                                size={14}
                                className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;