import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getClientToken() {
    return localStorage.getItem("clientToken");
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

const ConversationsPage = ({ botId: propBotId }) => {
    const { botId: routeBotId } = useParams();
    const [activeBotId, setActiveBotId] = useState(propBotId || routeBotId || null);
    const [conversations, setConversations] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConvoData, setSelectedConvoData] = useState(null);

    const [selectedConvo, setSelectedConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    useEffect(() => {
        const resolvedBotId = propBotId || routeBotId || null;
        setActiveBotId(resolvedBotId);
    }, [propBotId, routeBotId]);

    useEffect(() => {
        const loadInitialBot = async () => {
            if (activeBotId) {
                await loadConversations(1, activeBotId);
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/bots`, {
                    headers: { Authorization: `Bearer ${getClientToken()}` },
                });

                if (!res.ok) throw new Error("Failed to load your bots");

                const bots = await res.json();
                const firstBot = Array.isArray(bots) ? bots[0] : null;

                if (!firstBot?.id) {
                    setConversations([]);
                    setPagination({ page: 1, totalPages: 1, total: 0 });
                    setError("No bot available yet.");
                    setLoading(false);
                    return;
                }

                setActiveBotId(firstBot.id);
                await loadConversations(1, firstBot.id);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        loadInitialBot();
    }, [activeBotId]);

    async function loadConversations(page, currentBotId = activeBotId) {
        if (!currentBotId) {
            setLoading(false);
            setError("No bot selected.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/bots/${currentBotId}/conversations?page=${page}&limit=20`,
                { headers: { Authorization: `Bearer ${getClientToken()}` } }
            );
            if (!res.ok) throw new Error("Failed to load conversations");
            const data = await res.json();
            setConversations(data.conversations || []);
            setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function openConversation(conversationId) {
        if (!activeBotId) {
            setError("No bot selected.");
            return;
        }

        setSelectedConvo(conversationId);
        setSelectedConvoData(
            conversations.find((c) => c.id === conversationId) || null
        );
        setMessagesLoading(true);
        setMessages([]);
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/bots/${activeBotId}/conversations/${conversationId}`,
                { headers: { Authorization: `Bearer ${getClientToken()}` } }
            );
            if (!res.ok) throw new Error("Failed to load conversation");
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setMessagesLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12">
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl">
                    Conversations
                </h1>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {pagination.total} total conversation{pagination.total === 1 ? "" : "s"}
                </p>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error}
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 space-y-3">
                    {loading ? (
                        <p className="text-sm font-medium text-zinc-400">Loading…</p>
                    ) : conversations.length === 0 ? (
                        <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/40 p-8 text-center">
                            <MessageSquare className="mx-auto text-zinc-300" size={28} />
                            <p className="mt-3 text-sm font-medium text-zinc-400">
                                No conversations yet. Once visitors start chatting on your site, they'll show up here.
                            </p>
                        </div>
                    ) : (
                        conversations.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => openConversation(c.id)}
                                className={`w-full text-left rounded-2xl border p-4 transition-all ${selectedConvo === c.id
                                    ? "border-[#40295C] bg-[#40295C]/5"
                                    : "border-zinc-200/60 bg-white hover:border-zinc-300"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold text-zinc-700 truncate">
                                        {c.visitor_name
                                            ? c.visitor_name
                                            : `Visitor ${c.visitor_id ? c.visitor_id.slice(0, 8) : "unknown"}`}
                                    </span>
                                    {(c.visitor_email || c.visitor_phone) && (
                                        <p className="mt-0.5 text-[11px] text-zinc-400 truncate">
                                            {[c.visitor_email, c.visitor_phone]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </p>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-zinc-700 line-clamp-2">
                                    {c.first_message || "No messages"}
                                </p>
                                <p className="mt-2 text-[11px] font-semibold text-zinc-400">
                                    {c.message_count} message{c.message_count === "1" ? "" : "s"}
                                </p>
                            </button>
                        ))
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => loadConversations(pagination.page - 1)}
                                className="flex items-center gap-1 rounded-lg border border-zinc-200/80 px-3 py-2 text-xs font-semibold text-zinc-600 disabled:opacity-40"
                            >
                                <ChevronLeft size={13} /> Prev
                            </button>
                            <span className="text-xs font-medium text-zinc-400">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => loadConversations(pagination.page + 1)}
                                className="flex items-center gap-1 rounded-lg border border-zinc-200/80 px-3 py-2 text-xs font-semibold text-zinc-600 disabled:opacity-40"
                            >
                                Next <ChevronRight size={13} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3">
                    <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/20 overflow-hidden min-h-100">
                        <div className="border-b border-zinc-200/60 bg-white p-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-zinc-900">
                                    Transcript
                                </h2>

                                {selectedConvoData &&
                                    (selectedConvoData.visitor_name ||
                                        selectedConvoData.visitor_email ||
                                        selectedConvoData.visitor_phone) && (
                                        <p className="mt-1 text-xs text-zinc-400">
                                            {[
                                                selectedConvoData.visitor_name,
                                                selectedConvoData.visitor_email,
                                                selectedConvoData.visitor_phone,
                                            ]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </p>
                                    )}
                            </div>
                            {selectedConvo && (
                                <button onClick={() => {
                                    setSelectedConvo(null);
                                    setSelectedConvoData(null);
                                }} className="text-zinc-400 hover:text-zinc-700">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="p-5 space-y-3 max-h-130 overflow-y-auto">
                            {!selectedConvo ? (
                                <p className="text-sm font-medium text-zinc-400 text-center py-16">
                                    Select a conversation to view the full transcript.
                                </p>
                            ) : messagesLoading ? (
                                <p className="text-sm font-medium text-zinc-400 text-center py-16">Loading…</p>
                            ) : (
                                messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user"
                                            ? "ml-auto bg-[#40295C] text-white"
                                            : "bg-white border border-zinc-200/70 text-zinc-700"
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationsPage;