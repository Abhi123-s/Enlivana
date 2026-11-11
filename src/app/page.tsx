import { Hero } from "@/components/home/Hero";
import {
  // Advisory,
  ArtformTiles,
  // ArtistFeature,
  // CollectionBand,
  // FeaturedGrid,
  // PriceChips,
  Stats,
  // Testimonials,
} from "@/components/home/HomeSections";


export default function Home() {
  return (
    <>
      <Hero />
      <div id="discover" className="scroll-mt-16 md:scroll-mt-[72px]">
        <ArtformTiles />
      </div>
      {/* <FeaturedGrid /> */}
      {/* <CollectionBand /> */}
      {/* <ArtistFeature /> */}
      {/* <PriceChips /> */}
      {/* <Advisory /> */}
      {/* <Stats /> */}
      {/* <Testimonials /> */}
    </>
  );
}
