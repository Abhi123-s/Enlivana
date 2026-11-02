import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/shop/LoginForm";

export const metadata: Metadata = { title: "Sign in · Enlivana" };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
