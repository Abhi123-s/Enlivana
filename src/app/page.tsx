import { Hero } from "@/components/home/Hero";
import {
  Advisory,
  ArtformTiles,
  ArtistFeature,
  CollectionBand,
  FeaturedGrid,
  PriceChips,
  Stats,
  Testimonials,
  TrustStrip,
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ArtformTiles />
      <FeaturedGrid />
      <CollectionBand />
      <ArtistFeature />
      <PriceChips />
      <Advisory />
      <Stats />
      <Testimonials />
    </>
  );
}
