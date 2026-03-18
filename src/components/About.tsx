"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { number: "200+", label: "完成專案" },
  { number: "15+", label: "年業界經驗" },
  { number: "50+", label: "合作導演" },
  { number: "30+", label: "國際影展" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
              <p>
                ECN2 STUDIO 是一支專注於影視後期製作的專業團隊，從片場到銀幕，我們陪伴每一部作品走過最關鍵的旅程。
              </p>
              <p>
                我們深信，卓越的技術是講好故事的基石。無論是 Netflix 原創影集的嚴格規格要求，
                還是院線電影的 DCP 母帶製作，我們都以最高標準為每一個專案把關。
              </p>
              <p>
                從現場 DIT 到最終交付，ECN2 STUDIO 提供一站式的後期技術解決方案，
                讓創作者專注於創作，我們負責讓技術完美落地。
              </p>
            </div>
          </div>

          {/* Right - Stats */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-dark-800 border border-dark-600 rounded-lg p-8 text-center
                             hover:border-accent/30 transition-all duration-500"
                >
                  <div className="text-accent text-4xl md:text-5xl font-black mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
