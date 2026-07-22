import React, { useState, useEffect } from "react";
import {
    Bot,
    MessageSquare,
    Users,
    Activity,
    Plus,
    Settings,
    ArrowUpRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getClientToken() {
    return localStorage.getItem("clientToken");
}

function formatRelativeTime(iso) {
    if (!iso) return "—";
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

const Dashboard = ({ botId: propBotId }) => {
    const navigate = useNavigate();
    const { botId: routeBotId } = useParams();
    const [activeBotId, setActiveBotId] = useState(propBotId || routeBotId || null);

    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setActiveBotId(propBotId || routeBotId || null);
    }, [propBotId, routeBotId]);

    useEffect(() => {
        async function resolveBotAndLoad() {
            let botId = activeBotId;

            if (!botId) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/bots`, {
                        headers: { Authorization: `Bearer ${getClientToken()}` },
                    });
                    if (!res.ok) throw new Error("Failed to load your bots");
                    const bots = await res.json();
                    botId = Array.isArray(bots) && bots[0] ? bots[0].id : null;
                    if (!botId) {
                        setError("No bot available yet.");
                        setLoading(false);
                        return;
                    }
                    setActiveBotId(botId);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                    return;
                }
            }

            await loadDashboardData(botId);
        }

        resolveBotAndLoad();
    }, [activeBotId]);

    async function loadDashboardData(botId) {
        setLoading(true);
        setError(null);
        try {
            const [statsRes, activityRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/bots/${botId}/stats`, {
                    headers: { Authorization: `Bearer ${getClientToken()}` },
                }),
                fetch(`${API_BASE_URL}/api/bots/${botId}/recent-activity?limit=5`, {
                    headers: { Authorization: `Bearer ${getClientToken()}` },
                }),
            ]);

            if (!statsRes.ok) throw new Error("Failed to load stats");
            if (!activityRes.ok) throw new Error("Failed to load recent activity");

            const statsData = await statsRes.json();
            const activityData = await activityRes.json();

            setStats(statsData);
            setActivity(activityData.activity || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const statCards = [
        {
            title: "Total Conversations",
            value: stats ? stats.totalConversations.toLocaleString() : "—",
            icon: MessageSquare,
            color: "text-blue-600 border-blue-100 bg-blue-50/30",
        },
        {
            title: "Active Users",
            value: stats ? stats.activeUsers.toLocaleString() : "—",
            icon: Users,
            color: "text-emerald-600 border-emerald-100 bg-emerald-50/30",
        },
        {
            title: "Messages Today",
            value: stats ? stats.messagesToday.toLocaleString() : "—",
            icon: Bot,
            color: "text-violet-600 border-violet-100 bg-violet-50/30",
        },
        {
            title: "Success Rate",
            value: stats && stats.successRate !== null ? `${stats.successRate.toFixed(1)}%` : "—",
            icon: Activity,
            color: "text-amber-600 border-amber-100 bg-amber-50/30",
        },
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        System Operation & Performance Analytics
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error}
                </div>
            )}

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
                                        {item.value}
                                    </h2>
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
                <div className="xl:col-span-2 rounded-2xl border border-zinc-200/60 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="border-b border-zinc-200/60 p-6 flex items-center justify-between bg-zinc-50/30">
                        <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                            Live Stream Activity
                        </h2>
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </div>

                    <div className="divide-y divide-zinc-100">
                        {loading ? (
                            <p className="p-6 text-sm font-medium text-zinc-400">Loading…</p>
                        ) : activity.length === 0 ? (
                            <p className="p-6 text-sm font-medium text-zinc-400">
                                No activity yet. Conversations will show up here once visitors start chatting.
                            </p>
                        ) : (
                            activity.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="flex flex-col gap-4 p-6 transition-colors hover:bg-zinc-50/30 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold text-zinc-950">
                                            {chat.visitor_name || `Visitor ${chat.visitor_id ? chat.visitor_id.slice(0, 8) : "unknown"}`}
                                        </h3>
                                        <p className="text-sm text-zinc-500 line-clamp-1 max-w-xl">
                                            {chat.last_message}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-6 md:justify-end">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${chat.status === "Active"
                                                ? "bg-blue-50 border-blue-100 text-blue-700"
                                                : "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                }`}
                                        >
                                            {chat.status}
                                        </span>
                                        <p className="text-xs text-zinc-400 font-medium whitespace-nowrap min-w-17.5 text-right">
                                            {formatRelativeTime(chat.last_message_at)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                                Core Telemetry
                            </h2>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-zinc-200/50">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Online
                            </span>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-zinc-400">Total Conversations</p>
                                <p className="text-sm font-semibold text-zinc-900 tracking-tight">
                                    {stats ? stats.totalConversations.toLocaleString() : "—"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-zinc-400">Messages Today</p>
                                <p className="text-sm font-semibold text-zinc-900 tracking-tight">
                                    {stats ? stats.messagesToday.toLocaleString() : "—"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-zinc-400">Success Rate</p>
                                <p className="text-sm font-semibold text-zinc-900 tracking-tight">
                                    {stats && stats.successRate !== null ? `${stats.successRate.toFixed(1)}%` : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-4">
                            Quick System Routing
                        </h2>

                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/chat')}
                                className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40"
                            >
                                <span>Create New Instance</span>
                                <ArrowUpRight size={14} className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600" />
                            </button>

                            <button
                                onClick={() => activeBotId && navigate('/analytics')}
                                className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40"
                            >
                                <span>View Conversations</span>
                                <ArrowUpRight size={14} className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600" />
                            </button>

                            <button
                                onClick={() => activeBotId && navigate('/settings')}
                                className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40">
                                <span>Global Configuration</span>
                                <Settings size={14} className="text-zinc-400 transition-transform group-hover:rotate-45 group-hover:text-zinc-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;