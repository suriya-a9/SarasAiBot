import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Building2, Globe, Edit2, Check, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
    const { clientToken } = useAuth();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        workemail: "",
        mobile_number: "",
        company: "",
        website: "",
        avatar: "",
        avatarFile: null,
    });

    const [editable, setEditable] = useState(false);
    const [saving, setSaving] = useState(false);

    const backendBaseUrl = api.defaults.baseURL?.replace(/\/api$/, "") || "";

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/clientAuth/profile", {
                headers: {
                    Authorization: `Bearer ${clientToken}`,
                },
            });

            const profile = data?.profile ?? data?.data ?? data ?? {};
            const imageValue = profile.image || profile.avatar || profile.photo || "";
            const avatarUrl = imageValue
                ? String(imageValue).startsWith("http")
                    ? imageValue
                    : `${backendBaseUrl}/uploads/${imageValue}`
                : "";

            setFormData({
                name: profile.name || "",
                workemail: profile.workEmail || profile.workemail || profile.email || "",
                mobile_number: profile.mobile_number || profile.mobileNumber || profile.phone || "",
                company: profile.company || "",
                website: profile.website || "",
                avatar: avatarUrl,
                avatarFile: null,
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = ({ target }) => {
        const file = target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setFormData((prev) => ({
            ...prev,
            avatarFile: file,
            avatar: previewUrl,
        }));
    };

    const handleEdit = () => setEditable(true);
    const handleCancel = () => {
        fetchProfile();
        setEditable(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.workemail) {
            toast.error("Name and email are required");
            return;
        }

        setSaving(true);
        try {
            const formPayload = new FormData();
            formPayload.append("name", formData.name);
            formPayload.append("mobileNumber", formData.mobile_number);
            formPayload.append("company", formData.company);
            formPayload.append("website", formData.website);

            if (formData.avatarFile) {
                formPayload.append("image", formData.avatarFile);
            }

            const res = await api.patch("/clientAuth/profile", formPayload, {
                headers: {
                    Authorization: `Bearer ${clientToken}`,
                },
            });

            const updatedData = res?.data?.data ?? res?.data ?? {};
            const updatedProfile = updatedData?.data ?? updatedData?.profile ?? updatedData;
            const imageValue = updatedProfile.image || updatedProfile.avatar || updatedProfile.photo || "";
            const avatarUrl = imageValue
                ? String(imageValue).startsWith("http")
                    ? imageValue
                    : `${backendBaseUrl}/uploads/${imageValue}`
                : formData.avatar;

            setFormData((prev) => ({
                ...prev,
                name: updatedProfile.name ?? prev.name,
                workemail: prev.workemail,
                mobile_number: updatedProfile.mobile_number ?? prev.mobile_number,
                company: updatedProfile.company ?? prev.company,
                website: updatedProfile.website ?? prev.website,
                avatar: avatarUrl,
                avatarFile: null,
            }));
            setEditable(false);
            toast.success("Profile updated");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-3 justify-center items-center h-[60vh] text-zinc-400 font-medium text-xs uppercase tracking-wider">
                <Loader2 size={20} className="animate-spin text-zinc-500" />
                Synchronizing Profile Data...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-zinc-800 antialiased p-6 md:p-8 lg:p-12 selection:bg-zinc-100 selection:text-zinc-900">
            <div className="mx-auto">

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-[#40295C] sm:text-5xl bg-linear-to-b from-zinc-950 to-zinc-600 bg-clip-text text-[#40295C]">
                            My Profile
                        </h1>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Identity & Corporate Information Settings
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!editable ? (
                            <button
                                onClick={handleEdit}
                                className="group flex items-center justify-center gap-2 rounded-full border border-zinc-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:text-zinc-950 hover:bg-zinc-50/40 cursor-pointer"
                            >
                                <Edit2 size={14} className="text-[#40295C] transition-colors group-hover:text-zinc-600" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-500 shadow-sm hover:bg-zinc-50 hover:text-zinc-800 transition disabled:opacity-50"
                                >
                                    <X size={14} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-900 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Check size={14} />
                                    )}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/20 p-6 flex flex-col items-center justify-center text-center">
                        <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden bg-linear-to-tr from-zinc-100 to-zinc-50 flex items-center justify-center text-zinc-400">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Identity Frame"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <span className="text-3xl font-bold tracking-tight text-zinc-800">
                                    {(formData.name || "U").charAt(0).toUpperCase()}
                                </span>
                            )}

                            {editable && (
                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/70 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Edit2 size={14} className="mb-1" />
                                    Upload
                                </label>
                            )}
                        </div>
                        <h3 className="mt-4 font-bold text-zinc-900 tracking-tight">{formData.name || "Anonymous Instance"}</h3>
                        <p className="mt-1 text-xs font-medium text-zinc-400 tracking-wide uppercase">{formData.company || "No Corporate Affiliation"}</p>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl border border-zinc-200/60 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        readOnly={!editable}
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium transition-all outline-none border ${editable
                                            ? 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20'
                                            : 'border-transparent bg-zinc-50/60 text-zinc-600 cursor-text'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Enterprise Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        readOnly
                                        name="workemail"
                                        type="email"
                                        value={formData.workemail}
                                        className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium border border-transparent bg-zinc-50/60 text-zinc-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Mobile Telephony</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        readOnly={!editable}
                                        name="mobile_number"
                                        type="tel"
                                        value={formData.mobile_number}
                                        onChange={handleChange}
                                        className={`w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium transition-all outline-none border ${editable
                                            ? 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20'
                                            : 'border-transparent bg-zinc-50/60 text-zinc-600 cursor-text'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Organization</label>
                                <div className="relative">
                                    <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        readOnly={!editable}
                                        name="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className={`w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium transition-all outline-none border ${editable
                                            ? 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20'
                                            : 'border-transparent bg-zinc-50/60 text-zinc-600 cursor-text'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Digital Domain Address</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        readOnly={!editable}
                                        name="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className={`w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium transition-all outline-none border ${editable
                                            ? 'border-zinc-200 bg-white text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400/20'
                                            : 'border-transparent bg-zinc-50/60 text-zinc-600 cursor-text'
                                            }`}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}