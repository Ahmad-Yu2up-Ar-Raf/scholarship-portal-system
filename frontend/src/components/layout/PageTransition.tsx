import { useEffect, useRef } from "react"
import { useLocation } from "react-router"
import gsap from "gsap"
import { playSound, unlockSound } from "@/lib/sound"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    unlockSound()
    playSound("open", { volume: 0.5 })
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    if (!ref.current) return
    gsap.fromTo(ref.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" })
  }, [location.pathname])

  return <div ref={ref}>{children}</div>
}
