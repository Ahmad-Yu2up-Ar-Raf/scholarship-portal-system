import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth"
import { loginApi } from "@/features/auth/api"
import { toast } from "sonner"
import { playSound, unlockSound } from "@/lib/sound"
import { SEO } from "@/components/seo/SEO"

export function Login() {
  const [email, setEmail] = useState("admin@admin.com")
  const [password, setPassword] = useState("password")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    await unlockSound()
    setLoading(true)
    const p = playSound("processing") as unknown as { stop?: () => void } | null
    try {
      const res = await loginApi(email, password)
      p?.stop?.()
      playSound("success")
      const token = (res as unknown as { token?: string }).token ?? "cookie"
      const user = (res as unknown as { user?: { id: number; name: string; email: string } }).user ?? { id: 1, name: "User", email }
      setAuth(user, token)
      toast.success("Login berhasil")
      nav("/daftar")
    } catch (err) {
      p?.stop?.()
      playSound("error")
      toast.error("Login gagal", { description: err instanceof Error ? err.message : "Error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <SEO title="Masuk — PIJAR BEASISWA" description="Masuk ke akun PIJAR BEASISWA untuk mendaftar beasiswa kampus. Satu akun bisa daftar banyak program berbeda." path="/login" noindex />
      <div className="grid grid-cols-1 md:grid-cols-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
        <div className="bg-primary border-b-4 md:border-b-0 md:border-r-4 border-black p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="font-head text-3xl md:text-4xl font-black uppercase break-words">PIJAR<br />BEASISWA</div>
            <p className="font-medium mt-3 break-words">Satu akun, banyak peluang. Daftar beasiswa kampus dalam hitungan menit.</p>
          </div>
          <blockquote className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-head font-black break-words">“Pendidikan adalah senjata paling ampuh untuk mengubah dunia.”</p>
            <cite className="text-xs font-bold not-italic">— Nelson Mandela</cite>
          </blockquote>
          <div className="flex gap-2 text-xs font-black">
            <span className="border-2 border-black bg-black text-white px-2 py-1">GRATIS</span>
            <span className="border-2 border-black bg-white px-2 py-1">IPK ≥3.0</span>
            <span className="border-2 border-black bg-accent px-2 py-1">3–5 HARI</span>
          </div>
        </div>
        <div className="bg-white p-8">
          <h1 className="font-head text-2xl font-black uppercase break-words">Masuk — Pijar</h1>
          <p className="text-sm font-medium mt-1 break-words">Masuk untuk mendaftar beasiswa. 1 akun bisa banyak beasiswa berbeda.</p>
          <form onSubmit={submit} className="space-y-4 mt-6">
            <div className="space-y-1">
              <Label className="font-bold">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kampus.ac.id" className="border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div className="space-y-1">
              <Label className="font-bold">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <Button type="submit" disabled={loading} className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-primary text-black font-black">
              {loading ? "Memproses..." : "Masuk"}
            </Button>
            <div className="text-sm text-center break-words">Belum punya akun? <Link to="/register" className="font-black underline">Daftar</Link></div>
          </form>
        </div>
      </div>
    </div>
  )
}
