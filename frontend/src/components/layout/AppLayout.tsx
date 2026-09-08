import { Outlet, useLocation } from "react-router"
import { Header } from "@/components/layout/Header"
import { ScrollToTop } from "@/components/layout/ScrollToTop"
import { PageTransition } from "@/components/layout/PageTransition"
import { useEffect } from "react"
import { playSound, unlockSound } from "@/lib/sound"

const AUTH_PATHS = ["/login", "/register", "/signup"]

export function AppLayout() {
  useEffect(() => {
    const handler = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest("button, a, [role='button']")
      if (!isInteractive) return
      // avoid double-play for nav which already plays select
      if (target.closest("nav")) return
      await unlockSound()
      playSound("press", { volume: 0.5 })
    }
    document.addEventListener("click", handler, { capture: true })
    return () => document.removeEventListener("click", handler, { capture: true } as never)
  }, [])

  const { pathname } = useLocation()
  const hideHeader = AUTH_PATHS.includes(pathname)

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      {!hideHeader && <Header />}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}
