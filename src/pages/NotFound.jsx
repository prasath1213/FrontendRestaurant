import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "50px 20px",
            }}
        >
            <h1 style={{ fontSize: "72px", margin: 0, color: "#e63946" }}>404</h1>
            <h2 style={{ margin: "10px 0" }}>Page Not Found</h2>
            <p style={{ color: "#666", marginBottom: "24px" }}>
                Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                style={{
                    padding: "10px 24px",
                    background: "#e63946",
                    color: "#fff",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
            >
                Go Back Home
            </Link>
        </div>
    );
}