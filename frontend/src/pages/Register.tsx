import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth"
import { registerApi } from "@/features/auth/api"
import { toast } from "sonner"
import { playSound, unlockSound } from "@/lib/sound"
import { SEO } from "@/components/seo/SEO"

export function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await unlockSound()
    if (password !== confirm) { playSound("error"); toast.error("Password tidak cocok"); return }
    setLoading(true)
    const p = playSound("processing") as unknown as { stop?: () => void } | null
    try {
      const res = await registerApi(name, email, password, confirm)
      p?.stop?.()
      playSound("success")
      const token = (res as unknown as { token?: string }).token ?? "cookie"
      const user = (res as unknown as { user?: { id: number; name: string; email: string } }).user ?? { id: 1, name, email }
      setAuth(user, token)
      toast.success("Registrasi berhasil")
      nav("/daftar")
    } catch (err) {
      p?.stop?.()
      playSound("error")
      toast.error("Registrasi gagal", { description: err instanceof Error ? err.message : "Error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8"><div className="w-full max-w-6xl">
      <SEO title="Daftar Akun — PIJAR BEASISWA" description="Buat akun PIJAR BEASISWA gratis. Satu akun bisa daftar banyak beasiswa berbeda, pantau status verifikasi real-time." path="/register" noindex />
      <div className="grid grid-cols-1 md:grid-cols-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
        <div className="bg-accent border-b-4 md:border-b-0 md:border-r-4 border-black p-8 flex flex-col justify-between gap-6 text-black">
          <div>
            <div className="font-head text-3xl md:text-4xl font-black uppercase break-words">GABUNG<br />PIJAR</div>
            <p className="font-medium mt-3 break-words">Buat akun gratis. Daftar banyak beasiswa, pantau status real-time.</p>
          </div>
          <blockquote className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-head font-black break-words">“Investasi dalam pengetahuan membayar bunga terbaik.”</p>
            <cite className="text-xs font-bold not-italic">— Benjamin Franklin</cite>
          </blockquote>
          <div className="flex gap-2 text-xs font-black flex-wrap">
            <span className="border-2 border-black bg-black text-white px-2 py-1">10 PROGRAM</span>
            <span className="border-2 border-black bg-white px-2 py-1">PDF/ZIP</span>
            <span className="border-2 border-black bg-primary px-2 py-1">RP 2,4 M+</span>
          </div>
        </div>
        <div className="bg-white p-8">
          <h1 className="font-head text-2xl font-black uppercase break-words">Daftar — Pijar</h1>
          <p className="text-sm font-medium mt-1 break-words">Buat akun untuk mendaftar. Gratis, 1 akun banyak beasiswa berbeda.</p>
          <form onSubmit={submit} className="space-y-4 mt-6">
            <div className="space-y-1"><Label className="font-bold">Nama</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className="border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" /></div>
            <div className="space-y-1"><Label className="font-bold">Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kampus.ac.id" className="border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" /></div>
            <div className="space-y-1"><Label className="font-bold">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" /></div>
            <div className="space-y-1"><Label className="font-bold">Konfirmasi Password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" /></div>
            <Button type="submit" disabled={loading} className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black font-black">{loading ? "Memproses..." : "Daftar"}</Button>
            <div className="text-sm text-center break-words">Sudah punya akun? <Link to="/login" className="font-black underline">Masuk</Link></div>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}
