import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = { title: "Cart · Enlivana" };

export default function Page() {
  return <CartPage />;
}
