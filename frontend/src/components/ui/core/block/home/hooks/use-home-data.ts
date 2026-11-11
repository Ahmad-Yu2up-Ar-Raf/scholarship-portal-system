import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useBeasiswaList } from "@/features/beasiswa/hooks";
import { useScholarships } from "@/features/scholarship/hooks-schoolarship";
import gsap from "gsap";
import type { HomeStats, ScholarshipTypeItem } from "../types/home.types";

export function useHomeData() {
  const { data } = useBeasiswaList();
  const {
    data: scholarships,
    isLoading: scholarshipsLoading,
    isError: scholarshipsError,
  } = useScholarships();
  const [searchParams] = useSearchParams();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const ranked = [...(scholarships ?? [])].sort(
    (a, b) => (b.beasiswas_count ?? 0) - (a.beasiswas_count ?? 0),
  );
  const types: ScholarshipTypeItem[] = ranked.slice(0, 2).map((s) => ({
    id: s.slug,
    title: s.name,
    label: s.name,
    syarat: s.requirements,
    desc: s.description,
    color_theme: s.color_theme,
    count: s.beasiswas_count ?? 0,
  }));

  const stats: HomeStats = {
    total: data?.length ?? 0,
    verified:
      data?.filter((d) => d.status_ajuan === "lulus verifikasi").length ?? 0,
    pending:
      data?.filter((d) => d.status_ajuan === "belum di verifikasi").length ?? 0,
  };

  const topRecipients = (data ?? [])
    .filter((d) => d.status_ajuan === "lulus verifikasi")
    .slice(0, 3);

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");
    if (scrollTo) {
      setTimeout(
        () =>
          document
            .getElementById(scrollTo)
            ?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }, [searchParams]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "all",
      });
      gsap.from(".gsap-card", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.3,
        clearProps: "all",
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!cardsRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".gsap-timeline", {
        opacity: 0,
        x: -20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all",
      });
    }, cardsRef);
    return () => ctx.revert();
  }, []);

  return {
    heroRef,
    cardsRef,
    scholarships,
    scholarshipsLoading,
    scholarshipsError,
    types,
    stats,
    topRecipients,
  };
}
