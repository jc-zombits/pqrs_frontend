"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // redirecciona automáticamente al login
  }, [router]);

  return null; // no muestra nada mientras redirige
}
