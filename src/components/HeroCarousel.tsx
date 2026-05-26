"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Slide {
  id: number;
  titleKey: string;
  subtitleKey: string;
  categoryKey: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 41,
    titleKey: "slide41.title",
    subtitleKey: "slide41.subtitle",
    categoryKey: "slide41.category",
    image: "/images/欠婚幻燈片.jpg",
  },
  {
    id: 42,
    titleKey: "slide42.title",
    subtitleKey: "slide42.subtitle",
    categoryKey: "slide42.category",
    image: "/images/失樂園幻燈片.jpg",
  },
  {
    id: 39,
    titleKey: "slide39.title",
    subtitleKey: "slide39.subtitle",
    categoryKey: "slide39.category",
    image: "/images/乩身幻燈片.jpeg",
  },
  {
    id: 40,
    titleKey: "slide40.title",
    subtitleKey: "slide40.subtitle",
    categoryKey: "slide40.category",
    image: "/images/深度安靜幻燈片.jpg",
  },
  {
    id: 1,
    titleKey: "slide1.title",
    subtitleKey: "slide1.subtitle",
    categoryKey: "slide1.category",
    image: "/images/slide1.jpg",
  },
  {
    id: 2,
    titleKey: "slide2.title",
    subtitleKey: "slide2.subtitle",
    categoryKey: "slide2.category",
    image: "/images/slide2.jpg",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { t, lang } = useLanguage();

  const goTo = useCallback(
    (index: number) => {
      if (isLocked) return;
      setIsLocked(true);
      // 先立即隱藏文字（無動畫）
      setTextVisible(false);
      // 切換背景圖片
      setCurrent(index);
      // 等背景切換完成後，文字浮上來
      setTimeout(() => {
        setTextVisible(true);
        setTimeout(() => setIsLocked(false), 700);
      }, 600);
    },
    [isLocked]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden bg-dark-900">
      {/* Slide Backgrounds */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={slide.image}
            alt={t(slide.titleKey)}
            fill
            className="object-cover object-top"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-end pb-24 sm:pb-32 md:pb-40 section-padding">
        <div
          className={`max-w-4xl ${
            textVisible
              ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
              : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-white/60 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-1 block">
            {t("hero.production")}
          </span>
          <span className="text-accent text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
            {t(slides[current].categoryKey)}
          </span>
          <h1 className={`font-black leading-[0.95] tracking-tight mb-2 ${
            lang === "en"
              ? "text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
              : "text-3xl sm:text-4xl md:text-7xl lg:text-8xl"
          }`}>
            {t(slides[current].subtitleKey)}
          </h1>
          <h1 className={`font-black leading-[0.95] tracking-tight text-accent ${
            lang === "en"
              ? "text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
              : "text-3xl sm:text-4xl md:text-7xl lg:text-8xl"
          }`}>
            {t(slides[current].titleKey)}
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link href="/latest" className="btn-primary text-center">
              {t("hero.learnMore")}
            </Link>
            <a href="mailto:ecn2studio@gmail.com" className="btn-outline text-center">
              {t("hero.contactUs")}
            </a>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-500 rounded-full ${
              index === current
                ? "w-8 sm:w-10 h-1.5 sm:h-2 bg-accent"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-8 md:right-20 text-white/60 font-mono z-10">
        <span className="text-accent font-bold text-lg sm:text-2xl">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-sm sm:text-base">{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
