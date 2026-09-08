import { Link, NavLink, useLocation, useNavigate } from "react-router"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { playSound, unlockSound } from "@/lib/sound"
import { useAuthStore } from "@/store/auth"
import { logoutApi } from "@/features/auth/api"
import { toast } from "sonner"

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const handleNav = async () => {
    await unlockSound()
    playSound("select", { volume: 0.6 })
  }
  const user = useAuthStore((s) => s.user)
  const clear = useAuthStore((s) => s.clear)
  const handleLogout = async () => {
    await unlockSound()
    playSound("select", { volume: 0.8 })
    try {
      await logoutApi()
    } catch {
      // still clear locally
    }
    clear()
    try {
      localStorage.removeItem("pijar:auth")
    } catch {
      // ignore
    }
    toast.success("Berhasil keluar")
    navigate("/login")
  }
  const handleCekSyarat = async (e: React.MouseEvent) => {
    e.preventDefault()
    await unlockSound()
    playSound("open")
    if (location.pathname !== "/") {
      navigate("/?scrollTo=jenis")
    } else {
      document.getElementById("jenis")?.scrollIntoView({ behavior: "smooth" })
    }
  }
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 border-2 border-black font-black text-xs tracking-wide transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] ${isActive ? "bg-primary text-black" : "bg-white text-black hover:bg-muted"}`

  useEffect(() => {
    if (!headerRef.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    gsap.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "all" })
  }, [])

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-background border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-black text-white text-xs font-bold">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="bg-primary text-black px-2 py-0.5">KEMDIKBUD RI</span>
            <span className="hidden md:inline">PIJAR • PLATFORM BEASISWA CERDAS</span>
          </span>
          <span className="hidden lg:inline">Verifikasi 3–5 Hari Kerja • 100% Gratis</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-head text-lg md:text-xl font-black tracking-tight border-2 border-black bg-primary px-3 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
          PIJAR<span className="bg-black text-white px-1.5 ml-1">BEASISWA</span>
        </Link>
        <nav className="flex items-center gap-1.5 flex-wrap">
          <NavLink to="/" className={linkCls} onClick={handleNav}>Beranda</NavLink>
          <NavLink to="/beasiswa" className={linkCls} onClick={handleNav}>Beasiswa</NavLink>
          <NavLink to="/daftar" className={linkCls} onClick={handleNav}>Daftar</NavLink>
          <NavLink to="/peringkat" className={linkCls} onClick={handleNav}>Peringkat</NavLink>
          {user ? (
            <>
              <span className="hidden sm:inline text-xs font-bold border-2 border-black bg-muted px-2 py-1 max-w-[140px] truncate">{user.email}</span>
              <button onClick={handleLogout} className="px-3 py-1.5 border-2 border-black bg-red-500 text-white font-black text-xs tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">Keluar</button>
            </>
          ) : (
            <NavLink to="/login" className={linkCls} onClick={handleNav}>Masuk</NavLink>
          )}
        </nav>
        <a href="#jenis" onClick={handleCekSyarat} className={cn(buttonVariants({ variant: "secondary" }), "hidden md:inline-flex border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs cursor-pointer")}>
          Cek Syarat
        </a>
      </div>
    </header>
  )
}
