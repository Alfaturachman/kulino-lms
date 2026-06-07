'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function LandingNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-surface/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <span
                            className="text-[18px] font-black tracking-[0.05em] text-[#005695] select-none font-sans"
                            style={
                                {
                                    fontWeight: 900,
                                    WebkitTextStroke: '1px #005695',
                                    textStroke: '1px #005695',
                                } as any
                            }
                        >
                            KULINO
                        </span>
                    </Link>
                </div>

                {/* Right Container */}
                <div className="flex items-center gap-8">
                    {/* Navigation links - hidden on mobile, visible on desktop */}
                    <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-muted">
                        <Link
                            href="#how-it-works"
                            className="hover:text-ink transition-colors"
                        >
                            Cara Kerja
                        </Link>
                        <Link
                            href="#stats"
                            className="hover:text-ink transition-colors"
                        >
                            Keunggulan
                        </Link>
                        <Link
                            href="#testimonials"
                            className="hover:text-ink transition-colors"
                        >
                            Testimoni
                        </Link>
                        <Link
                            href="#faq"
                            className="hover:text-ink transition-colors"
                        >
                            FAQ
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center">
                        <Link
                            href="/login"
                            className="rounded-md bg-[#005695] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#004b80] hover:shadow-md hover:-translate-y-[1px]"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="flex md:hidden text-ink hover:text-ink/80 transition-colors p-1"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Panel */}
            {isOpen && (
                <div className="md:hidden border-b border-border bg-surface px-6 py-5 space-y-4 absolute top-16 left-0 right-0 shadow-lg z-40 transition-all duration-200">
                    <nav className="flex flex-col gap-4 text-[14px] font-semibold text-ink2">
                        <Link
                            href="#how-it-works"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-ink transition-colors"
                        >
                            Cara Kerja
                        </Link>
                        <Link
                            href="#stats"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-ink transition-colors"
                        >
                            Keunggulan
                        </Link>
                        <Link
                            href="#testimonials"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-ink transition-colors"
                        >
                            Testimoni
                        </Link>
                        <Link
                            href="#faq"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-ink transition-colors"
                        >
                            FAQ
                        </Link>
                        <hr className="border-border" />
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center rounded-lg bg-[#005695] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#004b80] block"
                        >
                            Login
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
