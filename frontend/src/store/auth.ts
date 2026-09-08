import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = { id: number; name: string; email: string }

type AuthState = {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  setUser: (user: User | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      setUser: (user) => set({ user }),
      clear: () => set({ user: null, token: null }),
    }),
    { name: "pijar:auth" }
  )
)
