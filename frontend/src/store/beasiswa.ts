import { create } from "zustand"

type BeasiswaStore = {
  ipk: number
  setIpk: (v: number) => void
}

// ponytail: system constant IPK — toggle for demo/evaluator
export const useBeasiswaStore = create<BeasiswaStore>((set) => ({
  ipk: 3.4,
  setIpk: (v) => set({ ipk: v }),
}))
