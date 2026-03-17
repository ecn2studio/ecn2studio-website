"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface Project {
  id: number;
  titleKey: string;
  categoryKey: string;
  servicesKey: string;
  year: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 39,
    titleKey: "project39.title",
    categoryKey: "project39.category",
    servicesKey: "project39.services",
    year: "2026",
    image: "/images/深度安靜海報.jpg",
  },
  {
    id: 1,
    titleKey: "project1.title",
    categoryKey: "project1.category",
    servicesKey: "project1.services",
    year: "2026",
    image: "/images/百萬人海報.jpg",
  },
  {
    id: 2,
    titleKey: "project2.title",
    categoryKey: "project2.category",
    servicesKey: "project2.services",
    year: "2026",
    image: "/images/雙囍海報.jpg",
  },
  {
    id: 3,
    titleKey: "project3.title",
    categoryKey: "project3.category",
    servicesKey: "project3.services",
    year: "2026",
    image: "/images/功夫海報.jpg",
  },
  {
    id: 15,
    titleKey: "project15.title",
    categoryKey: "project15.category",
    servicesKey: "project15.services",
    year: "2026",
    image: "/images/凶宅專賣店海報.jpg",
  },
  {
    id: 4,
    titleKey: "project4.title",
    categoryKey: "project4.category",
    servicesKey: "project4.services",
    year: "2025",
    image: "/images/陽光海報.jpg",
  },
  {
    id: 5,
    titleKey: "project5.title",
    categoryKey: "project5.category",
    servicesKey: "project5.services",
    year: "2025",
    image: "/images/大濛海報.jpg",
  },
  {
    id: 12,
    titleKey: "project12.title",
    categoryKey: "project12.category",
    servicesKey: "project12.services",
    year: "2025",
    image: "/images/監所男子囚生記海報.jpg",
  },
  {
    id: 6,
    titleKey: "project6.title",
    categoryKey: "project6.category",
    servicesKey: "project6.services",
    year: "2025",
    image: "/images/蟲海報.jpg",
  },
  {
    id: 7,
    titleKey: "project7.title",
    categoryKey: "project7.category",
    servicesKey: "project7.services",
    year: "2025",
    image: "/images/女孩海報.jpg",
  },
  {
    id: 8,
    titleKey: "project8.title",
    categoryKey: "project8.category",
    servicesKey: "project8.services",
    year: "2025",
    image: "/images/我們意外的勇氣海報.jpg",
  },
  {
    id: 9,
    titleKey: "project9.title",
    categoryKey: "project9.category",
    servicesKey: "project9.services",
    year: "2025",
    image: "/images/泥娃娃海報.jpg",
  },
  {
    id: 10,
    titleKey: "project10.title",
    categoryKey: "project10.category",
    servicesKey: "project10.services",
    year: "2025",
    image: "/images/我家的事海報.jpg",
  },
  {
    id: 13,
    titleKey: "project13.title",
    categoryKey: "project13.category",
    servicesKey: "project13.services",
    year: "2025",
    image: "/images/我與惡的距離2海報.jpg",
  },
  {
    id: 14,
    titleKey: "project14.title",
    categoryKey: "project14.category",
    servicesKey: "project14.services",
    year: "2025",
    image: "/images/忘了我記得海報.jpg",
  },
  {
    id: 11,
    titleKey: "project11.title",
    categoryKey: "project11.category",
    servicesKey: "project11.services",
    year: "2025",
    image: "/images/有病才會喜歡你海報.jpg",
  },
  // ─── 2024 ───
  {
    id: 27,
    titleKey: "project27.title",
    categoryKey: "project27.category",
    servicesKey: "project27.services",
    year: "2024",
    image: "/images/影后海報.jpg",
  },
  {
    id: 26,
    titleKey: "project26.title",
    categoryKey: "project26.category",
    servicesKey: "project26.services",
    year: "2024",
    image: "/images/為我辦一場西式的喪禮海報.jpg",
  },
  {
    id: 25,
    titleKey: "project25.title",
    categoryKey: "project25.category",
    servicesKey: "project25.services",
    year: "2024",
    image: "/images/小雁與吳愛麗海報.jpg",
  },
  {
    id: 24,
    titleKey: "project24.title",
    categoryKey: "project24.category",
    servicesKey: "project24.services",
    year: "2024",
    image: "/images/今天一起為愛鼓掌海報.jpg",
  },
  {
    id: 23,
    titleKey: "project23.title",
    categoryKey: "project23.category",
    servicesKey: "project23.services",
    year: "2024",
    image: "/images/正港分局海報.jpg",
  },
  {
    id: 22,
    titleKey: "project22.title",
    categoryKey: "project22.category",
    servicesKey: "project22.services",
    year: "2024",
    image: "/images/鬼才之道海報.jpg",
  },
  {
    id: 21,
    titleKey: "project21.title",
    categoryKey: "project21.category",
    servicesKey: "project21.services",
    year: "2024",
    image: "/images/不夠善良的我們海報.jpg",
  },
  {
    id: 20,
    titleKey: "project20.title",
    categoryKey: "project20.category",
    servicesKey: "project20.services",
    year: "2024",
    image: "/images/莎莉海報.jpg",
  },
  {
    id: 19,
    titleKey: "project19.title",
    categoryKey: "project19.category",
    servicesKey: "project19.services",
    year: "2024",
    image: "/images/青春18海報.jpg",
  },
  {
    id: 18,
    titleKey: "project18.title",
    categoryKey: "project18.category",
    servicesKey: "project18.services",
    year: "2024",
    image: "/images/何百芮的地獄毒白海報.jpg",
  },
  {
    id: 17,
    titleKey: "project17.title",
    categoryKey: "project17.category",
    servicesKey: "project17.services",
    year: "2024",
    image: "/images/還錢海報.jpg",
  },
  {
    id: 16,
    titleKey: "project16.title",
    categoryKey: "project16.category",
    servicesKey: "project16.services",
    year: "2024",
    image: "/images/壞男孩海報.jpg",
  },
  // ─── 2023 ───
  {
    id: 35,
    titleKey: "project35.title",
    categoryKey: "project35.category",
    servicesKey: "project35.services",
    year: "2023",
    image: "/images/此時此刻海報.jpg",
  },
  {
    id: 36,
    titleKey: "project36.title",
    categoryKey: "project36.category",
    servicesKey: "project36.services",
    year: "2023",
    image: "/images/美食無間海報.jpg",
  },
  {
    id: 28,
    titleKey: "project28.title",
    categoryKey: "project28.category",
    servicesKey: "project28.services",
    year: "2023",
    image: "/images/周處除三害海報.jpg",
  },
  {
    id: 33,
    titleKey: "project33.title",
    categoryKey: "project33.category",
    servicesKey: "project33.services",
    year: "2023",
    image: "/images/查無此心海報.jpg",
  },
  {
    id: 32,
    titleKey: "project32.title",
    categoryKey: "project32.category",
    servicesKey: "project32.services",
    year: "2023",
    image: "/images/我的麻吉4個鬼海報.jpg",
  },
  {
    id: 31,
    titleKey: "project31.title",
    categoryKey: "project31.category",
    servicesKey: "project31.services",
    year: "2023",
    image: "/images/請問還有哪裡需要加強海報.jpg",
  },
  {
    id: 30,
    titleKey: "project30.title",
    categoryKey: "project30.category",
    servicesKey: "project30.services",
    year: "2023",
    image: "/images/疫起海報.jpg",
  },
  {
    id: 37,
    titleKey: "project37.title",
    categoryKey: "project37.category",
    servicesKey: "project37.services",
    year: "2023",
    image: "/images/不良執念清除師海報.jpg",
  },
  {
    id: 38,
    titleKey: "project38.title",
    categoryKey: "project38.category",
    servicesKey: "project38.services",
    year: "2023",
    image: "/images/模仿犯海報.jpg",
  },
  {
    id: 29,
    titleKey: "project29.title",
    categoryKey: "project29.category",
    servicesKey: "project29.services",
    year: "2023",
    image: "/images/黑的教育海報.jpg",
  },
  {
    id: 34,
    titleKey: "project34.title",
    categoryKey: "project34.category",
    servicesKey: "project34.services",
    year: "2023",
    image: "/images/關於我和鬼變成家人的那件事海報.jpg",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group cursor-pointer
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                  transition-all duration-700`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* 文字區域 - 在圖片上方 */}
      <div className="mb-2 sm:mb-3">
        <span className="text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          {t(project.categoryKey)}
        </span>
        <h3 className="text-sm sm:text-xl md:text-2xl font-bold mt-0.5 sm:mt-1 leading-tight">
          {t(project.titleKey)}
        </h3>
        <span className="text-gray-400 text-xs sm:text-sm">{project.year}</span>
      </div>

      {/* 圖片區域 */}
      <div className="relative overflow-hidden rounded-lg aspect-[7/10] bg-dark-800">
        <Image
          src={project.image}
          alt={t(project.titleKey)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

        {/* 參與項目覆蓋層 */}
        <div
          className={`absolute inset-0 bg-dark-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center
                      transition-all duration-500 ${
                        showServices ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
          onClick={() => setShowServices(false)}
        >
          <span className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {lang === "zh" ? "參與製作項目" : "Our Services"}
          </span>
          <h4 className="text-xl md:text-2xl font-bold mb-4">
            {t(project.titleKey)}
          </h4>
          <div className="w-10 h-0.5 bg-accent mb-4" />
          {t(project.servicesKey).split(" / ").map((service, i) => (
            <span
              key={i}
              className="text-gray-300 text-sm md:text-base leading-relaxed block mb-1"
            >
              {service}
            </span>
          ))}
          <span className="text-gray-500 text-xs mt-6 uppercase tracking-widest">
            {lang === "zh" ? "點擊任意處關閉" : "Tap to close"}
          </span>
        </div>

        {/* 箭頭按鈕 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowServices(!showServices);
          }}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent text-dark-900 
                      flex items-center justify-center z-10
                      transition-all duration-500
                      ${showServices
                        ? "opacity-100 rotate-45"
                        : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0"
                      }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {showServices ? (
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M1 8h14M9 2l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}

// 依年份分組
const years = ["2026", "2025", "2024", "2023"];

function getProjectsByYear(year: string) {
  return projects.filter((p) => p.year === year);
}

export default function Latest({
  showHeader = true,
  limit,
}: {
  showHeader?: boolean;
  limit?: number;
}) {
  const { t } = useLanguage();
  // 如果有 limit，取最新的前 N 筆（不分年份）
  const displayProjects = limit ? projects.slice(0, limit) : null;

  return (
    <section id="latest" className="py-16 sm:py-24 md:py-32 bg-dark-900">
      <div className="section-padding">
        {/* Section Header */}
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-16 md:mb-20">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
                {t("latest.sectionLabel")}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight">
                {t("latest.sectionTitle")}
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-accent mt-3 sm:mt-4" />
            </div>
            <Link
              href="/latest"
              className="btn-primary mt-6 sm:mt-8 md:mt-0 self-start md:self-auto"
            >
              {t("latest.viewAll")}
            </Link>
          </div>
        )}

        {limit && displayProjects ? (
          /* 首頁模式：只顯示最新 N 筆，不分年份 */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          /* 作品集頁面模式：依年份分區顯示全部 */
          years.map((year) => {
            const yearProjects = getProjectsByYear(year);
            if (yearProjects.length === 0) return null;
            return (
              <div key={year} className="mb-10 sm:mb-16 last:mb-0">
                {/* 年份標題 */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-accent">
                    {year}
                  </h3>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* 該年份的作品 Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                  {yearProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
