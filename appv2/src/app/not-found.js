"use client";
import React, { useEffect } from "react";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import { useTheme } from './context/ThemeContext';

export default function Custom404() {
    const { theme } = useTheme();

    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(theme);
        document.body.classList.add("font-urbanist");
    }, [theme]);

    return (
        <div className="min-h-screen flex flex-col relative">
            <section className="flex items-center justify-center h-screen">
                <div className={`text-center backdrop-blur-xl rounded-2xl p-8 border transition-colors duration-200 ${
                    theme === 'dark' 
                        ? 'bg-gray-800/50 text-white border-gray-700/50' 
                        : 'bg-white/50 text-gray-900 border-gray-200/50'
                }`}>
                    <h1 className="text-5xl font-bold text-orange-400 mb-4">Page Not Found?</h1>
                    <p className="text-slate-400 mb-8">
                        Whoops, this is embarrassing. <br /> 
                        Looks like the page you were looking for was not found.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Link 
                            href="/" 
                            className="btn bg-orange-400 hover:bg-orange-500 border-orange-400 hover:border-orange-500 text-white rounded-xl flex items-center gap-2 px-4 py-2"
                        > 
                            <ArrowLeft className="w-4 h-4" /> 
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
