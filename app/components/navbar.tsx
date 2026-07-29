"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StoreBadges } from "@/components/marketing/store-badges";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-[#1e3a2f] text-[#f5f6f1]"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          <span>Chef</span>
          <span className="text-[#cdf23e]">AI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[#c3c8ba] transition-colors hover:text-[#f5f6f1]">
            Features
          </a>
          <a href="#pricing" className="text-sm text-[#c3c8ba] transition-colors hover:text-[#f5f6f1]">
            Pricing
          </a>
          <StoreBadges size="compact" />
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-[#f5f6f1]" />
          <span className="block w-6 h-0.5 bg-[#f5f6f1]" />
          <span className="block w-6 h-0.5 bg-[#f5f6f1]" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="md:hidden flex flex-col gap-2 px-6 py-4 border-t border-[#f5f6f1]/15"
        >
          <a href="#features" className="text-sm py-2 text-[#c3c8ba] transition-colors hover:text-[#f5f6f1]">
            Features
          </a>
          <a href="#pricing" className="text-sm py-2 text-[#c3c8ba] transition-colors hover:text-[#f5f6f1]">
            Pricing
          </a>
          <StoreBadges size="compact" className="mt-1" />
        </motion.div>
      )}
    </motion.header>
  );
}
