"use client";
import { useEffect, useState } from "react";

/** True after the first client render; guards persisted-store UI against SSR mismatch. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
