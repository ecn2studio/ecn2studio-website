import Services from "@/components/Services";

export default function ServicesPage() {
  return (
    <>
      {/* Page Banner */}
      <section className="pt-32 pb-16 bg-dark-900 section-padding">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
          What We Do
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
          服務項目
        </h1>
        <div className="w-20 h-1 bg-accent" />
        <p className="text-gray-400 text-lg mt-6 max-w-2xl">
          從片場到銀幕，ECN2 STUDIO 提供全方位的專業影視後期技術服務。
        </p>
      </section>

      <Services />
    </>
  );
}
