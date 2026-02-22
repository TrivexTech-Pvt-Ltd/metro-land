"use client";

import React from "react";

interface SpinnerProps {
    fullPage?: boolean;
    message?: string;
}

export default function ({
    fullPage = false,
    message = "Loading real-time data..."
}: SpinnerProps) {
    const content = (
        <div className="spinner-container">
            <div className="spinner"></div>
            {message && <p className="loading-text">{message}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="spinner-overlay">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-12 w-full h-full min-h-[300px]">
            {content}
        </div>
    );
}

