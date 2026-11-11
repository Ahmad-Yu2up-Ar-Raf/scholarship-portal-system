import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useScholarships } from "@/features/scholarship/hooks-schoolarship";
import gsap from "gsap";

export function useBeasiswaDetail() {
  const { slug } = useParams();
  const { data, isLoading } = useScholarships();
  const heroRef = useRef<HTMLDivElement>(null);
  const scholarship = data?.find((s) => s.slug === slug);

  useEffect(() => {
    if (!heroRef.current || !scholarship) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".detail-pop", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "all",
      });
    }, heroRef);
    return () => ctx.revert();
  }, [scholarship?.id]);

  return {
    slug,
    scholarship,
    isLoading,
    heroRef,
  };
}
