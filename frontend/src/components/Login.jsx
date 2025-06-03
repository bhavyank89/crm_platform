import React, { useState, useEffect, useCallback } from "react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Spinner() {
    return (
        <svg
            className="w-5 h-5 animate-spin text-white"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    );
}

function Login({ setUser }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Detect token in URL for successful Google login
    useEffect(() => {
        const urlToken = new URLSearchParams(location.search).get("token");
        if (urlToken) {
            localStorage.setItem("token", urlToken);
            setUser(urlToken);
            toast.success("Google login successful!");
            navigate("/");
        }
    }, [location.search, navigate, setUser]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setFadeIn(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleRegisterHere = useCallback(() => {
        setFadeOut(true);
        setTimeout(() => navigate("/signup"), 500);
    }, [navigate]);

    const handleLoginSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setLoggingIn(true);

            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.trim(), password: password.trim() }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Login failed.");

                toast.success("Login successful!");
                localStorage.setItem("token", data.token);
                setUser(data.token);
                setFadeOut(true);
                setTimeout(() => navigate("/"), 500);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoggingIn(false);
            }
        },
        [email, password, navigate, setUser]
    );

    const handleGoogleLoginRedirect = useCallback(() => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
    }, []);

    return (
        <>
            <Toaster position="top-center" />
            <div
                className={`h-full w-full flex items-center justify-center bg-gray-100 transition-opacity duration-500 
        ${fadeOut ? "opacity-0 pointer-events-none" : ""} ${fadeIn ? "opacity-100" : "opacity-0"}`}
            >
                <div className="w-full h-screen bg-white shadow-md rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    {/* Left Illustration */}
                    <div className="relative hidden md:flex items-center justify-center bg-[#ffece3]">
                        <div
                            className="absolute top-4 left-6 flex items-center space-x-2 text-lg font-bold cursor-pointer"
                            onClick={() => {
                                navigate("/home");
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") navigate("/home");
                            }}
                            aria-label="Navigate to home"
                        >
                            <img src="logo.png" alt="logo" className="h-6 w-6 object-contain" />
                            <span>CRM_platform</span>
                        </div>
                        <DotLottieReact
                            src="https://lottie.host/1d0c9454-36a8-43ca-b948-f3c318fecb2a/QIXtsTAiD1.lottie"
                            loop
                            autoplay
                            style={{ width: "80%", height: "80%" }}
                        />
                    </div>

                    {/* Right Form */}
                    <div className="p-10 md:p-20 flex flex-col justify-center">
                        {isLoading ? (
                            <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Loading content">
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
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Sign in</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    If you don’t have an account register
                                    <br />
                                    You can{" "}
                                    <button
                                        onClick={handleRegisterHere}
                                        className="text-red-500 font-semibold hover:underline"
                                        type="button"
                                    >
                                        Register here!
                                    </button>
                                </p>

                                <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
                                    <div>
                                        <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <div className="flex items-center border-b border-gray-300 py-2">
                                            <FiMail className="mr-2 text-gray-400" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email address"
                                                className="w-full outline-none"
                                                required
                                                autoComplete="email"
                                                aria-describedby="emailHelp"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <div className="flex items-center border-b border-gray-300 py-2">
                                            <FiLock className="mr-2 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                className="w-full outline-none"
                                                required
                                                autoComplete="current-password"
                                                aria-describedby="passwordHelp"
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

                                    <button
                                        type="submit"
                                        disabled={loggingIn}
                                        className={`w-full py-3 bg-red-500 text-white rounded-full font-semibold transition-transform transform hover:scale-105 hover:shadow-md ${loggingIn ? "cursor-not-allowed opacity-80" : ""
                                            }`}
                                        aria-busy={loggingIn}
                                    >
                                        {loggingIn ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Spinner />
                                                <span>Logging in...</span>
                                            </div>
                                        ) : (
                                            "Login"
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-6 text-sm text-gray-500">
                                    or continue with
                                    <div className="flex justify-center mt-3">
                                        <button
                                            onClick={handleGoogleLoginRedirect}
                                            className={`flex items-center space-x-2 px-4 py-2 border rounded-full 
                      transition-all duration-500 ease-in-out
                      transform hover:scale-105 hover:shadow-md
                      ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                                            aria-label="Login with Google"
                                            type="button"
                                        >
                                            <FcGoogle className="text-xl" />
                                            <span className="text-sm font-medium">Continue with Google</span>
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

export default Login;
