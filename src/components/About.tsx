"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const coreValues = [
  {
    titleKey: "about.value1.title",
    descKey: "about.value1.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M16 24l5 5 11-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    titleKey: "about.value2.title",
    descKey: "about.value2.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="18" cy="24" r="10" stroke="currentColor" strokeWidth="2" opacity="0.7" />
        <circle cx="30" cy="24" r="10" stroke="currentColor" strokeWidth="2" opacity="0.7" />
        <circle cx="24" cy="18" r="10" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      </svg>
    ),
  },
  {
    titleKey: "about.value3.title",
    descKey: "about.value3.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 14h8v20H8V14zM20 10h8v28h-8V10zM32 18h8v16h-8V18z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 24h12M28 26h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    titleKey: "about.value4.title",
    descKey: "about.value4.desc",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 6v8M24 34v8M6 24h8M34 24h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M11 11l5 5M32 32l5 5M11 37l5-5M32 16l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="pb-24 md:pb-32 bg-dark-900 overflow-hidden">
      <div ref={ref} className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Text */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <p>{t("about.p3")}</p>
            </div>
          </div>

          {/* Right - Core Values */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {coreValues.map((value, index) => (
                <div
                  key={index}
                  className="group bg-dark-800 border border-dark-600 rounded-lg p-6
                             hover:border-accent/30 hover:bg-dark-700 transition-all duration-500 relative overflow-hidden"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className="text-accent mb-4 group-hover:scale-110 transition-transform duration-500">
                    {value.icon}
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-bold text-white mb-2">
                    {t(value.titleKey)}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(value.descKey)}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
