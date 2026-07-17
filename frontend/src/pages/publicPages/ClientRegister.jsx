import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import logo from "../../assets/chat-logo.png";

export default function ClientRegister() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        workEmail: "",
        password: "",
        mobileNumber: "",
        company: "",
        website: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await api.post("/clientAuth/register", formData);
            if (data?.success) {
                toast.success("Registration successful");
                navigate("/");
            }
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                const v = {};
                error.response.data.errors.forEach(err => v[err.path] = err.msg);
                setErrors(v);
            } else {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-white px-6 py-8">
            <Link to='/' className="flex items-center gap-2">
                <img src={logo} alt="logo" className="w-12 h-12" />
                <span className="text-xl font-bold tracking-tight text-gray-900">Saras Ai Bot</span>
            </Link>
            <div className="w-full max-w-md mx-auto mt-16">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create your account
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                        Register your <span className="text-blue-600">Saras Ai</span> account
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={`w-full h-14 rounded-lg border px-4 outline-none transition-colors ${errors.name
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                            }`}
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.name}
                        </p>
                    )}

                    <input
                        type="email"
                        name="workEmail"
                        value={formData.workEmail}
                        onChange={handleChange}
                        placeholder="Your work email"
                        className={`w-full h-14 rounded-lg border px-4 outline-none transition-colors ${errors.workEmail
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                            }`}
                    />

                    {errors.workEmail && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.workEmail}
                        </p>
                    )}

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className={`w-full h-14 rounded-lg border pl-4 pr-12 outline-none transition-colors ${errors.password
                                ? "border-red-500"
                                : "border-gray-300 focus:border-gray-500"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password}
                        </p>
                    )}

                    <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Mobile Number"
                        className={`w-full h-14 rounded-lg border px-4 outline-none transition-colors ${errors.mobileNumber
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                            }`}
                    />

                    {errors.mobileNumber && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.mobileNumber}
                        </p>
                    )}

                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className={`w-full h-14 rounded-lg border px-4 outline-none transition-colors ${errors.company
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                            }`}
                    />

                    {errors.company && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.company}
                        </p>
                    )}

                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Website URL"
                        className={`w-full h-14 rounded-lg border px-4 outline-none transition-colors ${errors.website
                            ? "border-red-500"
                            : "border-gray-300 focus:border-gray-500"
                            }`}
                    />

                    {errors.website && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.website}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-lg bg-emerald-400 hover:bg-emerald-500 font-semibold text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Please wait..." : "Create Account"}
                    </button>
                </form>
                <div className="mt-8">
                    <div className="relative flex items-center">
                        <div className="grow border-t border-gray-200"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="grow border-t border-gray-200"></div>
                    </div>
                    <div className="mt-8 text-center">
                        <p>Already have an account? <button type="button" onClick={() => navigate("/login")} className="text-blue-600 font-medium">Log In</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
}