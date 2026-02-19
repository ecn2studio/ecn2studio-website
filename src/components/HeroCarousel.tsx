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
  {
    id: 3,
    titleKey: "slide3.title",
    subtitleKey: "slide3.subtitle",
    categoryKey: "slide3.category",
    image: "/images/slide3.jpg",
  },
  {
    id: 4,
    titleKey: "slide4.title",
    subtitleKey: "slide4.subtitle",
    categoryKey: "slide4.category",
    image: "/images/slide4.jpg",
  },
  {
    id: 5,
    titleKey: "slide5.title",
    subtitleKey: "slide5.subtitle",
    categoryKey: "slide5.category",
    image: "/images/slide5.jpg",
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
      <div className="relative h-full flex items-end pb-32 md:pb-40 section-padding">
        <div
          className={`max-w-4xl ${
            textVisible
              ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
              : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-accent text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
            {t(slides[current].categoryKey)}
          </span>
          <h1 className={`font-black leading-[0.95] tracking-tight mb-2 ${
            lang === "en" ? "text-4xl md:text-5xl lg:text-6xl" : "text-5xl md:text-7xl lg:text-8xl"
          }`}>
            {t(slides[current].subtitleKey)}
          </h1>
          <h1 className={`font-black leading-[0.95] tracking-tight text-accent ${
            lang === "en" ? "text-4xl md:text-5xl lg:text-6xl" : "text-5xl md:text-7xl lg:text-8xl"
          }`}>
            {t(slides[current].titleKey)}
          </h1>
          <div className="flex gap-4 mt-8">
            <Link href="/latest" className="btn-primary">
              {t("hero.learnMore")}
            </Link>
            <a href="mailto:ecn2studio@gmail.com" className="btn-outline">
              {t("hero.contactUs")}
            </a>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-500 rounded-full ${
              index === current
                ? "w-10 h-2 bg-accent"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-10 right-8 md:right-20 text-white/60 font-mono z-10">
        <span className="text-accent font-bold text-2xl">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="mx-2">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
