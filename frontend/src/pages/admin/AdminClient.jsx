import React, { useState, useEffect } from "react";
import {
    Building2,
    Search,
    Mail,
    Phone,
    Globe,
    ArrowUpRight,
    ImageOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AdminAuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getImageUrl(image) {
    if (!image) return null;
    return `${API_BASE_URL}/uploads/${image}`;
}

const AdminClient = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        loadClients();
    }, []);

    async function loadClients() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/clients`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to load clients");
            const json = await res.json();
            if (!json.success) throw new Error("Failed to load clients");
            setClients(json.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function toggleStatus(client) {
        const nextStatus = client.status === "Active" ? "Inactive" : "Active";
        setTogglingId(client.id);

        setClients((prev) =>
            prev.map((c) => (c.id === client.id ? { ...c, status: nextStatus } : c))
        );

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
            const json = await res.json();
            if (!json.success && json.success !== undefined) throw new Error("Failed to update status");
        } catch (err) {
            setClients((prev) =>
                prev.map((c) => (c.id === client.id ? { ...c, status: client.status } : c))
            );
            setError(err.message);
        } finally {
            setTogglingId(null);
        }
    }

    const filteredClients = clients.filter((c) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
            c.name?.toLowerCase().includes(q) ||
            c.company?.toLowerCase().includes(q) ||
            c.workemail?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text">
                        Clients
                    </h1>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        {clients.length} Total Client{clients.length === 1 ? "" : "s"}
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
                        placeholder="Search name, company, email…"
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
                ) : filteredClients.length === 0 ? (
                    <p className="p-6 text-sm font-medium text-zinc-400">No clients found.</p>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {filteredClients.map((client) => {
                            const imgUrl = getImageUrl(client.image);
                            return (
                                <div
                                    key={client.id}
                                    className="flex flex-col gap-4 p-6 transition-colors hover:bg-zinc-50/30 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-50 text-zinc-400">
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
                                                <Building2 size={18} strokeWidth={2} />
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-sm font-semibold text-zinc-950">
                                                {client.company || client.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <Mail size={12} /> {client.workemail}
                                                </span>
                                                {client.mobile_number && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Phone size={12} /> {client.mobile_number}
                                                    </span>
                                                )}
                                                {client.website && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Globe size={12} /> {client.website.replace(/^https?:\/\//, "")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:justify-end">
                                        <button
                                            onClick={() => toggleStatus(client)}
                                            disabled={togglingId === client.id}
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-colors disabled:opacity-50 ${client.status === "Active"
                                                ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                                : "bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-200/60"
                                                }`}
                                            title="Click to toggle status"
                                        >
                                            {togglingId === client.id ? "…" : client.status}
                                        </button>

                                        <button
                                            onClick={() => navigate(`/admin-client/${client.id}`)}
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminClient;