import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Handle token from Google OAuth redirect in URL query params
    useEffect(() => {
        const urlToken = new URLSearchParams(location.search).get("token");
        if (urlToken) {
            localStorage.setItem("token", urlToken);
            toast.success("Google sign-up successful!");
            navigate("/");
        }
    }, [location.search, navigate]);

    // Fade in and loading skeleton timers
    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeIn(true), 100);
        const loadTimer = setTimeout(() => setIsLoading(false), 1500);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(loadTimer);
        };
    }, []);

    // Handle navigating to login with fade out effect
    const handleLoginHere = (e) => {
        e.preventDefault();
        setFadeOut(true);
        setTimeout(() => navigate("/login"), 500);
    };

    // Handle form submission for sign up
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed.");

            toast.success("Signup successful!");
            localStorage.setItem("token", data.token);
            navigate("/login");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Redirect to backend Google OAuth endpoint
    const handleGoogleSignupRedirect = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    };

    return (
        <>
            <Toaster position="top-center" />
            <div
                className={`h-screen w-screen flex items-center justify-center bg-gray-100 transition-all duration-500 ease-in-out ${fadeOut ? "opacity-0" : fadeIn ? "opacity-100" : "opacity-0 translate-y-2"
                    }`}
            >
                <div className="w-full h-screen bg-white shadow-md rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    {/* Left Illustration */}
                    <div className="relative hidden md:flex items-center justify-center bg-[#e0f7fa]">
                        <div
                            className="absolute top-4 left-6 flex items-center space-x-2 text-lg font-bold cursor-pointer"
                            onClick={() => navigate("/home")}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") navigate("/home");
                            }}
                            aria-label="Go to home"
                        >
                            <img src="logo.png" alt="logo" className="h-6 w-6 object-contain" />
                            <span>CRM_platform</span>
                        </div>
                        <DotLottieReact
                            src="https://lottie.host/1d0c9454-36a8-43ca-b948-f3c318fecb2a/QIXtsTAiD1.lottie"
                            loop
                            autoplay
                            style={{ width: "80%", height: "80%" }}
                            aria-label="Illustration animation"
                        />
                    </div>

                    {/* Right Form */}
                    <div className="p-10 md:p-20 flex flex-col justify-center">
                        {isLoading ? (
                            <div className="space-y-5 animate-pulse" aria-busy="true" aria-live="polite">
                                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-12 bg-gray-200 rounded"></div>
                                <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign up</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Already have an account?{" "}
                                    <button
                                        onClick={handleLoginHere}
                                        className="text-red-500 font-semibold hover:underline"
                                        aria-label="Navigate to login"
                                    >
                                        Login here!
                                    </button>
                                </p>

                                <form onSubmit={handleSignupSubmit} className="space-y-5" noValidate>
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <div className="flex items-center border-b border-gray-300 py-2">
                                            <FiUser className="mr-2 text-gray-400" />
                                            <input
                                                id="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your full name"
                                                className="w-full outline-none"
                                                required
                                                aria-required="true"
                                                aria-label="Full name"
                                                autoComplete="name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <div className="flex items-center border-b border-gray-300 py-2">
                                            <FiMail className="mr-2 text-gray-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email address"
                                                className="w-full outline-none"
                                                required
                                                aria-required="true"
                                                aria-label="Email address"
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <div className="flex items-center border-b border-gray-300 py-2">
                                            <FiLock className="mr-2 text-gray-400" />
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Create a password"
                                                className="w-full outline-none"
                                                required
                                                aria-required="true"
                                                aria-label="Password"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-700 ml-2"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 bg-red-500 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                <span>Signing Up...</span>
                                            </>
                                        ) : (
                                            <span>Sign Up</span>
                                        )}
                                    </button>
                                </form>

                                {/* Social Login */}
                                <div className="text-center mt-6 text-sm text-gray-500">
                                    or continue with
                                    <div className="flex justify-center mt-3">
                                        <button
                                            onClick={handleGoogleSignupRedirect}
                                            className={`flex items-center space-x-2 px-4 py-2 border rounded-full transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-md ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                                                }`}
                                            aria-label="Sign up with Google"
                                            type="button"
                                        >
                                            <FcGoogle className="text-xl" />
                                            <span className="text-sm font-medium">continue with Google</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;
