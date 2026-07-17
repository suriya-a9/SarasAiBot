import React from "react";
import {
    Bot,
    MessageSquare,
    Users,
    Activity,
    Plus,
    Settings,
    ArrowUpRight,
} from "lucide-react";

const stats = [
    {
        title: "Total Conversations",
        value: "12,458",
        icon: MessageSquare,
        color: "text-blue-600 border-blue-100 bg-blue-50/30",
    },
    {
        title: "Active Users",
        value: "2,341",
        icon: Users,
        color: "text-emerald-600 border-emerald-100 bg-emerald-50/30",
    },
    {
        title: "Messages Today",
        value: "8,923",
        icon: Bot,
        color: "text-violet-600 border-violet-100 bg-violet-50/30",
    },
    {
        title: "Success Rate",
        value: "98.7%",
        icon: Activity,
        color: "text-amber-600 border-amber-100 bg-amber-50/30",
    },
];

const recentChats = [
    {
        user: "John Doe",
        message: "How do I reset my password?",
        time: "2 mins ago",
        status: "Resolved",
    },
    {
        user: "Sarah",
        message: "Pricing information",
        time: "8 mins ago",
        status: "Active",
    },
    {
        user: "Michael",
        message: "Need invoice copy",
        time: "15 mins ago",
        status: "Pending",
    },
    {
        user: "Emma",
        message: "API integration help",
        time: "22 mins ago",
        status: "Resolved",
    },
];

const Dashboard = () => {
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

                <button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#40295C] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-900 hover:scale-[1.01] active:scale-[0.99] shadow-sm">
                    <Plus size={16} className="transition-transform group-hover:rotate-90" />
                    Create Chatbot
                </button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
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
                        {recentChats.map((chat) => (
                            <div
                                key={chat.user}
                                className="flex flex-col gap-4 p-6 transition-colors hover:bg-zinc-50/30 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-zinc-950">
                                        {chat.user}
                                    </h3>
                                    <p className="text-sm text-zinc-500 line-clamp-1 max-w-xl">
                                        {chat.message}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-6 md:justify-end">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${chat.status === "Resolved"
                                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                            : chat.status === "Pending"
                                                ? "bg-amber-50 border-amber-100 text-amber-700"
                                                : "bg-blue-50 border-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {chat.status}
                                    </span>
                                    <p className="text-xs text-zinc-400 font-medium whitespace-nowrap min-w-17.5 text-right">
                                        {chat.time}
                                    </p>
                                </div>
                            </div>
                        ))}
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
                                <p className="text-xs font-medium text-zinc-400">Response Latency</p>
                                <p className="text-sm font-semibold text-zinc-900 tracking-tight">1.2s</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-zinc-400">Core Engine</p>
                                <p className="text-sm font-semibold text-zinc-900 tracking-tight">Optimized</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-zinc-400">Index Volume</p>
                                <p className="text-sm font-semibold text-zinc-900 tracking-tight">145 Files</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <h2 className="text-sm font-bold text-zinc-900 tracking-tight mb-4">
                            Quick System Routing
                        </h2>

                        <div className="space-y-2">
                            <button className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40">
                                <span>Create New Instance</span>
                                <ArrowUpRight size={14} className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600" />
                            </button>

                            <button className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40">
                                <span>Index Orchestration</span>
                                <ArrowUpRight size={14} className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600" />
                            </button>

                            <button className="group flex w-full items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40">
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