"use client";

import Team from "@/components/Team";
import { useLanguage } from "@/context/LanguageContext";

export default function TeamPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Page Banner */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-dark-900 section-padding">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
          {t("teamPage.label")}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-4 sm:mb-6">
          {t("teamPage.title")}
        </h1>
        <div className="w-16 sm:w-20 h-1 bg-accent" />
        <p className="text-gray-400 text-base sm:text-lg mt-4 sm:mt-6 max-w-2xl">
          {t("teamPage.desc")}
        </p>
      </section>

      <Team />
    </>
  );
}
