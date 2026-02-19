import HeroCarousel from "@/components/HeroCarousel";
import Latest from "@/components/Latest";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Latest limit={5} />
    </>
  );
}
