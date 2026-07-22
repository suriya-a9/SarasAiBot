import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    Globe,
    BadgeCheck,
    Cpu,
    Sparkles,
    MessageCircle,
    Palette,
    LayoutGrid,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AdminAuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getImageUrl(image) {
    if (!image) return null;
    return `${API_BASE_URL}/uploads/${image}`;
}

const AdminClientDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadClient();
    }, [id]);

    async function loadClient() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/clients/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to load client");
            const json = await res.json();
            if (!json.success) throw new Error("Failed to load client");
            const data = Array.isArray(json.data) ? json.data[0] : json.data;
            setClient(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function toggleStatus() {
        if (!client) return;
        const nextStatus = client.status === "Active" ? "Inactive" : "Active";
        setUpdating(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/${client.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ status: nextStatus }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            setClient((prev) => ({ ...prev, status: nextStatus }));
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6 md:p-8 lg:p-12">
                <p className="text-sm font-medium text-zinc-400">Loading…</p>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="min-h-screen bg-white p-6 md:p-8 lg:p-12">
                <button
                    onClick={() => navigate("/admin-client")}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900"
                >
                    <ArrowLeft size={14} /> Back to Clients
                </button>
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {error || "Client not found."}
                </div>
            </div>
        );
    }

    const imgUrl = getImageUrl(client.image);

    const fields = [
        { label: "Contact Name", value: client.name, icon: BadgeCheck },
        { label: "Work Email", value: client.workEmail || client.workemail, icon: Mail },
        { label: "Mobile Number", value: client.mobile_number, icon: Phone },
        { label: "Website", value: client.website, icon: Globe, isLink: true },
    ];

    const botFields = client.bot
        ? [
              { label: "Bot Name", value: client.bot.name, icon: Sparkles },
              { label: "Bot Tone", value: client.bot.tone, icon: Palette },
              { label: "Bot Language", value: client.bot.language, icon: MessageCircle },
              { label: "Bot Active", value: client.bot.is_active ? "Yes" : "No", icon: Cpu },
          ]
        : [];

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <button
                onClick={() => navigate("/admin-client")}
                className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
                <ArrowLeft size={14} /> Back to Clients
            </button>

            <div className="flex flex-col gap-6 border-b border-zinc-100 pb-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50 text-zinc-400">
                        {imgUrl ? (
                            <img
                                src={imgUrl}
                                alt={client.company}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <Building2 size={26} strokeWidth={2} />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#40295C] sm:text-4xl">
                            {client.company}
                        </h1>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Client ID: {client.id}
                        </p>
                    </div>
                </div>

                <button
                    onClick={toggleStatus}
                    disabled={updating}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold border transition-colors disabled:opacity-50 ${client.status === "Active"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200/60"
                        }`}
                >
                    {updating
                        ? "Updating…"
                        : `Status: ${client.status} (click to ${client.status === "Active" ? "deactivate" : "activate"
                        })`}
                </button>
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
                                    {field.isLink && field.value ? (
                                        <a
                                            href={field.value}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-semibold text-blue-600 hover:underline break-all"
                                        >
                                            {field.value}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-semibold text-zinc-900 break-all">
                                            {field.value || "—"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {client.bot && (
                <div className="mt-10 rounded-2xl border border-zinc-200/60 bg-zinc-50/20 p-6">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-950">Bot Details</h2>
                            <p className="text-sm text-zinc-500">Details for the client&apos;s active bot.</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            {client.bot.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {botFields.map((field) => {
                            const Icon = field.icon;
                            return (
                                <div
                                    key={field.label}
                                    className="rounded-2xl border border-zinc-200/60 bg-white p-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/60 bg-zinc-50 text-zinc-500">
                                            <Icon size={18} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                                {field.label}
                                            </p>
                                            <p className="text-sm font-semibold text-zinc-900">
                                                {field.value || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* <div className="mt-6 rounded-2xl border border-zinc-200/60 bg-zinc-50 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                            Knowledge Base
                        </p>
                        <p className="text-sm text-zinc-900 whitespace-pre-line">
                            {client.bot.knowledge_base || "—"}
                        </p>
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default AdminClientDetail;