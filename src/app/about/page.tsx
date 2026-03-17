import About from "@/components/About";

export default function AboutPage() {
  return (
    <>
      {/* Page Banner */}
      <section className="pt-32 pb-16 bg-dark-900 section-padding">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
          About Us
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
          關於我們
        </h1>
        <div className="w-20 h-1 bg-accent" />
        <p className="text-gray-400 text-lg mt-6 max-w-2xl">
          認識 ECN2 STUDIO，一支專注於影視後期製作的專業團隊。
        </p>
      </section>

      <About />
    </>
  );
}
