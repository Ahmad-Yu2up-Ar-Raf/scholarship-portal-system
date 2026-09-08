import { Navigate } from "react-router"
import { useAuthStore } from "@/store/auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  if (!user || !token) return <Navigate to="/login" replace />
  return <>{children}</>
}
