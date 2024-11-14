"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { IconMenu2, IconX } from '@tabler/icons-react'; // For icons (using Tabler icons)

const navbar: React.FC = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md p-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-semibold">
                    <span className="text-blue-500">My</span>App
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex space-x-4">
                    <Link href="/" className="text-gray-700 hover:text-blue-500">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-blue-500">
                        About
                    </Link>
                    <Link href="/services" className="text-gray-700 hover:text-blue-500">
                        Services
                    </Link>
                    <Link href="/contact" className="text-gray-700 hover:text-blue-500">
                        Contact
                    </Link>
                </nav>

                {/* User Action Button for Desktop */}
                <div className="hidden md:flex items-center space-x-2">
                    <Button variant="default">Sign In</Button>
                </div>

                {/* Mobile Hamburger Menu Button */}
                <button
                    className="md:hidden flex items-center text-gray-700 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown Section */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-white shadow-md mt-2 p-4">
                    <Link href="/" className="block py-2 text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/about" className="block py-2 text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
                        About
                    </Link>
                    <Link href="/services" className="block py-2 text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
                        Services
                    </Link>
                    <Link href="/contact" className="block py-2 text-gray-700 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>
                        Contact
                    </Link>

                    {/* Mobile User Action Button */}
                    <div className="mt-4">
                        <Button variant="default" onClick={() => setMobileMenuOpen(false)}>
                            Sign In
                        </Button>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default navbar;
