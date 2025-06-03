import React from 'react'
import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function LoginGoogle({ setUser }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlToken = new URLSearchParams(location.search).get("token");
        if (urlToken) {
            localStorage.setItem("token", urlToken);
            toast.success("Google login successful!");
            setUser(urlToken);
            navigate("/");
        } else {
            toast.error("No token found, login failed");
            navigate("/login");
        }
    }, [location, navigate]);
    return (
        <div>
            <p>redirecting to /</p>
        </div>
    )
}

export default LoginGoogle
