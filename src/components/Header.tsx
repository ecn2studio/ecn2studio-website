"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.portfolio", href: "/latest" },
  { labelKey: "nav.about", href: "/about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-dark-900/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="section-padding flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="font-logo text-xl sm:text-2xl md:text-4xl lg:text-5xl font-[900] tracking-wide text-white group-hover:text-accent transition-colors duration-300 uppercase"
            style={{ WebkitTextStroke: '0.5px currentColor' }}
          >
            ECN<span className="text-accent">2</span> STUDIO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
                pathname === link.href
                  ? "text-accent"
                  : "text-gray-300 hover:text-accent"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <Link href="mailto:ecn2studio@gmail.com" className="btn-primary">
            {t("nav.contact")}
          </Link>
          {/* 語言切換 */}
          <div className="flex items-center gap-1 text-sm font-medium tracking-wide">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded transition-colors duration-300 ${
                lang === "en"
                  ? "text-accent"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <span className="text-gray-600">/</span>
            <button
              onClick={() => setLang("zh")}
              className={`px-2 py-1 rounded transition-colors duration-300 ${
                lang === "zh"
                  ? "text-accent"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              中文
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-7 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-dark-900/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-2xl font-bold uppercase tracking-widest transition-colors duration-300 ${
                pathname === link.href
                  ? "text-accent"
                  : "text-gray-300 hover:text-accent"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <Link href="mailto:ecn2studio@gmail.com" className="btn-primary text-lg mt-4">
            {t("nav.contact")}
          </Link>
          {/* 手機版語言切換 */}
          <div className="flex items-center gap-2 mt-6 text-lg font-medium tracking-wide">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded transition-colors duration-300 ${
                lang === "en"
                  ? "text-accent"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <span className="text-gray-600">/</span>
            <button
              onClick={() => setLang("zh")}
              className={`px-3 py-1 rounded transition-colors duration-300 ${
                lang === "zh"
                  ? "text-accent"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              中文
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
