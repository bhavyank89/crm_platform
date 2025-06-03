import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function LoginGoogle({ setUser }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlToken = new URLSearchParams(location.search).get("token");
        if (urlToken) {
            localStorage.setItem("token", urlToken);
            setUser(urlToken);
            toast.success("Google login successful!");
            navigate("/", { replace: true });
        } else {
            toast.error("No token found, login failed");
            navigate("/login", { replace: true });
        }
    }, [location.search, navigate, setUser]);

    return (
        <>
            <Toaster position="top-center" />
            <div className="flex items-center justify-center h-screen">
                <p>Redirecting...</p>
            </div>
        </>
    );
}

export default LoginGoogle;
