import ky from "ky"

const rawBase = import.meta.env.VITE_API_URL ?? "http://192.168.1.4:8000/api/v1"
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`

// Ky v2: `prefixUrl` → `prefix` (throws if prefixUrl used). Use `prefix` only.
export const api = ky.create({
  prefix: base,
  timeout: 15000,
  retry: 0,
  credentials: "include",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set("Accept", "application/json")
        try {
          const raw = localStorage.getItem("pijar:auth")
          if (raw) {
            const parsed = JSON.parse(raw) as { state?: { token?: string } }
            const token = parsed?.state?.token
            if (token) request.headers.set("Authorization", `Bearer ${token}`)
          }
        } catch {}
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (response.status === 401) {
          try {
            localStorage.removeItem("pijar:auth")
          } catch {}
          if (!request.url.includes("/login") && !request.url.includes("/register") && location.pathname !== "/login") {
            // soft redirect, keep SPA
            // window.location.href = "/login"
          }
        }
        return response
      },
    ],
  },
})

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "HTTPError") {
    const httpErr = error as unknown as { response: { status: number }; message: string }
    return httpErr.message ?? `HTTP ${httpErr.response.status}`
  }
  if (error instanceof TypeError) return "Gagal terhubung ke server — pastikan backend di http://192.168.1.4:8000 berjalan"
  if (error instanceof Error) return error.message
  return "Terjadi kesalahan"
}
