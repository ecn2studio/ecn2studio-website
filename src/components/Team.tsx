"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface Member {
  id: number;
  nameKey: string;
  roleKey: string;
  bioKey: string;
  image: string;
}

const members: Member[] = [
  { id: 1, nameKey: "team.m1.name", roleKey: "team.m1.role", bioKey: "team.m1.bio", image: "/images/team/member1.jpg" },
  { id: 2, nameKey: "team.m2.name", roleKey: "team.m2.role", bioKey: "team.m2.bio", image: "/images/team/member2.jpg" },
  { id: 3, nameKey: "team.m3.name", roleKey: "team.m3.role", bioKey: "team.m3.bio", image: "/images/team/member3.jpg" },
  { id: 4, nameKey: "team.m4.name", roleKey: "team.m4.role", bioKey: "team.m4.bio", image: "/images/team/member4.jpg" },
  { id: 5, nameKey: "team.m5.name", roleKey: "team.m5.role", bioKey: "team.m5.bio", image: "/images/team/member5.jpg" },
  { id: 6, nameKey: "team.m6.name", roleKey: "team.m6.role", bioKey: "team.m6.bio", image: "/images/team/member6.jpg" },
  { id: 7, nameKey: "team.m7.name", roleKey: "team.m7.role", bioKey: "team.m7.bio", image: "/images/team/member7.jpg" },
  { id: 8, nameKey: "team.m8.name", roleKey: "team.m8.role", bioKey: "team.m8.bio", image: "/images/team/member8.jpg" },
  { id: 9, nameKey: "team.m9.name", roleKey: "team.m9.role", bioKey: "team.m9.bio", image: "/images/team/member9.jpg" },
  { id: 10, nameKey: "team.m10.name", roleKey: "team.m10.role", bioKey: "team.m10.bio", image: "/images/team/member10.jpg" },
];

function MemberCard({ member, index }: { member: Member; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-dark-800 mb-4 sm:mb-5">
        {!imgError ? (
          <Image
            src={member.image}
            alt={t(member.nameKey)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12 sm:w-16 sm:h-16 mb-2">
              <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="text-xs tracking-widest uppercase">Photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">
          {t(member.nameKey)}
        </h3>
        <p className="text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5 sm:mt-1">
          {t(member.roleKey)}
        </p>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-2 sm:mt-3">
          {t(member.bioKey)}
        </p>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <section id="team" className="pb-16 sm:pb-24 md:pb-32 bg-dark-900">
      <div className="section-padding">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {members.map((member, index) => (
            <MemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
