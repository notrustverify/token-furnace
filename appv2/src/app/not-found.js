"use client"; // This is a client component 👈🏽
import React, { useEffect } from "react";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import { useTheme } from './context/ThemeContext';

export default function Custom404() {
    const { theme, isDark } = useTheme();
    useEffect(() => {
        document.documentElement.classList.add(theme);
        document.body.classList.add("font-urbanist",);
      }, []);
    return (
        <>
            <section className="relative flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-orange-400 mb-4">Page Not Found?</h1>
                    <p className="text-slate-400 mb-8">Whoops, this is embarrassing. <br /> Looks like the page you were looking for was not found.</p>
                    <div className="mt-6 flex justify-center">
                        <Link href="/" className="btn bg-orange-400 hover:bg-orange-500 border-orange-400 hover:border-orange-500 text-white rounded-xl flex items-center gap-2"> <ArrowLeft className="w-4 h-4" /> Back to Home</Link>
                    </div>
                </div>
            </section>
        </>
    )
}
