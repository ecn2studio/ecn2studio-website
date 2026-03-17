"use client";

import Link from "next/link";

const socialLinks = [
  { name: "Facebook", icon: "/icons/facebook.svg", href: "#" },
  { name: "Instagram", icon: "/icons/instagram.svg", href: "#" },
  { name: "YouTube", icon: "/icons/youtube.svg", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      {/* Contact CTA */}
      <section className="bg-dark-800 py-20 md:py-28">
        <div className="section-padding text-center">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 max-w-4xl mx-auto">
            準備好將您的故事變為現實了嗎？
          </h2>
          <Link href="/about#contact" className="btn-primary">
            聯絡我們
          </Link>
        </div>
      </section>

      {/* Main Footer */}
      <div className="section-padding py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="font-logo text-2xl font-[900] tracking-wide text-white group-hover:text-accent transition-colors duration-300 uppercase"
            style={{ WebkitTextStroke: '0.5px currentColor' }}
          >
            ECN<span className="text-accent">2</span> STUDIO
          </span>
        </Link>

        {/* Social Links */}
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent transition-colors duration-300"
              aria-label={link.name}
            >
              <img src={link.icon} alt={link.name} className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-dark-800 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ECN2 STUDIO. All rights reserved.
      </div>
    </footer>
  );
}
