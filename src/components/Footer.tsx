"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-900 text-white">
      {/* Contact CTA */}
      <section className="bg-dark-800 py-16 sm:py-20 md:py-28">
        <div className="section-padding text-center">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
            {t("footer.cta.label")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6 sm:mb-8 max-w-4xl mx-auto">
            {t("footer.cta.title")}
          </h2>
          <Link href="mailto:ecn2studio@gmail.com" className="btn-primary">
            {t("footer.cta.button")}
          </Link>
        </div>
      </section>

      {/* Main Footer */}
      <div className="section-padding py-8 sm:py-12 md:py-16 flex flex-col md:flex-row items-start justify-between gap-8 sm:gap-10">
        {/* Left - Logo + Slogan */}
        <div className="max-w-md">
          <Link href="/" className="flex items-center gap-3 group">
            <span
              className="font-logo text-2xl font-[900] tracking-wide text-white group-hover:text-accent transition-colors duration-300 uppercase"
              style={{ WebkitTextStroke: "0.5px currentColor" }}
            >
              ECN<span className="text-accent">2</span> STUDIO
            </span>
          </Link>
          <p className="text-gray-500 text-xs tracking-wide mt-1">
            {t("footer.brandName")}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {t("footer.slogan")}
          </p>
        </div>

        {/* Right - Contact */}
        <div>
          <h4 className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4">
            {t("footer.contact")}
          </h4>
          <div className="space-y-2">
            <a
              href="mailto:ecn2studio@gmail.com"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 block"
            >
              ecn2studio@gmail.com
            </a>
            <a
              href="tel:+886972339366"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 block"
            >
              +886 972-339-366
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-dark-800 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ECN2 STUDIO. All rights reserved.
      </div>
    </footer>
  );
}
