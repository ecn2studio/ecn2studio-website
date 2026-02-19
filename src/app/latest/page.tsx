"use client";

import Latest from "@/components/Latest";
import { useLanguage } from "@/context/LanguageContext";

export default function LatestPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Page Banner */}
      <section className="pt-32 pb-16 bg-dark-800 section-padding">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
          {t("portfolioPage.label")}
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
          {t("portfolioPage.title")}
        </h1>
        <div className="w-20 h-1 bg-accent" />
        <p className="text-gray-400 text-lg mt-6 max-w-2xl">
          {t("portfolioPage.desc")}
        </p>
      </section>

      <Latest showHeader={false} />
    </>
  );
}
