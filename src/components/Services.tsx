"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Service {
  id: number;
  titleKey: string;
  titleEnKey: string;
  descKey: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: 1,
    titleKey: "service1.title",
    titleEnKey: "service1.titleEn",
    descKey: "service1.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M6 18h36" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" />
        <circle cx="17" cy="14" r="1.5" fill="currentColor" />
        <circle cx="22" cy="14" r="1.5" fill="currentColor" />
        <rect x="14" y="24" width="20" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 2,
    titleKey: "service2.title",
    titleEnKey: "service2.titleEn",
    descKey: "service2.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 12h12l4 4h16v20H8V12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 28l4-4 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 3,
    titleKey: "service3.title",
    titleEnKey: "service3.titleEn",
    descKey: "service3.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="14" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M28 14v20M32 18v12M36 16v16M40 20v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    id: 4,
    titleKey: "service4.title",
    titleEnKey: "service4.titleEn",
    descKey: "service4.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="12" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M6 30h36" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="33" width="4" height="1.5" rx="0.5" fill="currentColor" />
        <rect x="16" y="33" width="8" height="1.5" rx="0.5" fill="currentColor" />
        <rect x="26" y="33" width="6" height="1.5" rx="0.5" fill="currentColor" />
        <rect x="34" y="33" width="4" height="1.5" rx="0.5" fill="currentColor" />
        <polygon points="20,18 20,26 28,22" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 5,
    titleKey: "service5.title",
    titleEnKey: "service5.titleEn",
    descKey: "service5.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
        <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 6,
    titleKey: "service6.title",
    titleEnKey: "service6.titleEn",
    descKey: "service6.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M12 8v32l6-16 6 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 16h8M28 22h12M28 28h10M28 34h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 7,
    titleKey: "service7.title",
    titleEnKey: "service7.titleEn",
    descKey: "service7.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="16" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M24 17.4a10 10 0 0 1 0 13.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 34l4 6M38 34l-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 20h4M30 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative bg-dark-800 border border-dark-600 rounded-lg p-8 md:p-10 
                  hover:border-accent/30 hover:bg-dark-700 transition-all duration-500
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Number */}
      <span className="absolute top-6 right-6 text-dark-500 text-sm font-mono">
        {String(service.id).padStart(2, "0")}
      </span>

      {/* Icon */}
      <div className="text-accent mb-6">{service.icon}</div>

      {/* Content */}
      <h3 className="text-xl md:text-2xl font-bold mb-1">{t(service.titleKey)}</h3>
      {lang === "zh" && (
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
          {t(service.titleEnKey)}
        </p>
      )}
      <p className="text-gray-400 text-sm leading-relaxed">
        {t(service.descKey)}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="pb-24 md:pb-32 bg-dark-900">
      <div className="section-padding">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
