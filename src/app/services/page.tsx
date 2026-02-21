"use client";

import Services from "@/components/Services";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Page Banner */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-dark-900 section-padding">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
          {t("servicesPage.label")}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-4 sm:mb-6">
          {t("servicesPage.title")}
        </h1>
        <div className="w-16 sm:w-20 h-1 bg-accent" />
        <p className="text-gray-400 text-base sm:text-lg mt-4 sm:mt-6 max-w-2xl">
          {t("servicesPage.desc")}
        </p>
      </section>

      <Services />
    </>
  );
}
