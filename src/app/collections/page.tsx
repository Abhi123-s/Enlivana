import { Suspense } from "react";
import type { Metadata } from "next";
import { CollectionView } from "@/components/shop/CollectionView";

export const metadata: Metadata = { title: "Collections · Enlivana" };

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="container-x py-32 text-center text-muted">Loading artworks…</div>}>
      <CollectionView />
    </Suspense>
  );
}
