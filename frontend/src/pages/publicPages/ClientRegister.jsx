import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import registerBanner from "../../assets/register_banner.png";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ClientRegister() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [captchaToken, setCaptchaToken] = useState("");
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
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!captchaToken) {
                toast.error("Please complete the CAPTCHA");
                return;
            }

            setLoading(true);

            const payload = {
                ...formData,
                captchaToken,
            };

            const { data } = await api.post("/clientAuth/register", payload);

            if (data?.success) {
                toast.success("Registration successful");
                navigate("/");
            }
        } catch (error) {
            if (
                error.response?.status === 400 &&
                error.response?.data?.errors
            ) {
                const v = {};
                error.response.data.errors.forEach((err) => {
                    v[err.path] = err.msg;
                });
                setErrors(v);
            } else {
                toast.error(
                    error.response?.data?.message || "Something went wrong"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full h-11 rounded-lg border px-4 outline-none transition-colors text-sm ${errors[field] ? "border-red-500" : "border-gray-300 focus:border-gray-500"
        }`;

    return (
        <div className="h-screen w-full flex overflow-hidden bg-white">
            <div className="hidden lg:block lg:w-[42%] h-full">
                <img
                    src={registerBanner}
                    alt="Register"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 h-full flex items-center justify-center px-6 lg:px-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-5">
                        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Sign in to{" "}
                            <span className="text-blue-600">Saras Ai</span> account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className={inputClass("name")}
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    placeholder="Mobile Number"
                                    className={inputClass("mobileNumber")}
                                />
                                {errors.mobileNumber && <p className="mt-1 text-xs text-red-500">{errors.mobileNumber}</p>}
                            </div>
                        </div>

                        <div>
                            <input
                                type="email"
                                name="workEmail"
                                value={formData.workEmail}
                                onChange={handleChange}
                                placeholder="Your work email"
                                className={inputClass("workEmail")}
                            />
                            {errors.workEmail && <p className="mt-1 text-xs text-red-500">{errors.workEmail}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className={`${inputClass("password")} pr-11`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    className={inputClass("company")}
                                />
                                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
                            </div>
                            <div>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Website URL"
                                    className={inputClass("website")}
                                />
                                {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
                            </div>
                        </div>
                        <Turnstile
                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                            onSuccess={(token) => setCaptchaToken(token)}
                            onExpire={() => setCaptchaToken("")}
                            onError={() => setCaptchaToken("")}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-lg bg-linear-to-r from-blue-600 to-violet-500 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? "Please wait..." : "Get started"}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button type="button" onClick={() => navigate("/login")} className="text-blue-600 font-medium">
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}