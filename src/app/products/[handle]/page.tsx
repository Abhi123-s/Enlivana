import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { artworks, getArtwork } from "@/data/catalog";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return artworks.map((a) => ({ handle: a.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const art = getArtwork((await params).handle);
  return { title: art ? `${art.title} · Enlivana` : "Artwork · Enlivana" };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const art = getArtwork((await params).handle);
  if (!art) notFound();

  const others = artworks.filter((a) => a.handle !== art.handle);
  const related = [
    ...others.filter((a) => a.artform === art.artform || a.artistSlug === art.artistSlug),
    ...others,
  ]
    .filter((a, i, arr) => arr.findIndex((b) => b.handle === a.handle) === i)
    .slice(0, 4);

  return (
    <>
      <ProductDetail art={art} />
      <Reveal className="container-x pb-16 pt-6">
        <SectionHeading eyebrow="You may also like" title="More to explore" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-7">
          {related.map((a) => (
            <ProductCard key={a.handle} art={a} />
          ))}
        </div>
      </Reveal>
    </>
  );
}
