import { api } from "@/api/ky"

export type AuthUser = { id: number; name: string; email: string }

export async function loginApi(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const res = await api.post("login", { json: { email, password } }).json<{ user: AuthUser; token: string }>()
  return res
}

export async function registerApi(name: string, email: string, password: string, password_confirmation: string) {
  const res = await api.post("register", { json: { name, email, password, password_confirmation } }).json<{ user: AuthUser; token: string }>()
  return res
}

export async function logoutApi() {
  await api.post("logout").json()
}
