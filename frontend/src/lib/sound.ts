"use client"

import { createUISFX } from "uisfx"

let player: ReturnType<typeof createUISFX> | null = null
let unlocked = false

function getPlayer() {
  if (typeof window === "undefined") return null
  if (player) return player
  player = createUISFX({
    pack: "minimal",
    volume: 0.7,
    preferences: { key: "pijar:sound" },
  })
  return player
}

export async function unlockSound() {
  if (unlocked || typeof window === "undefined") return
  const p = getPlayer()
  if (!p) return
  try {
    await p.unlock()
    unlocked = true
  } catch {}
}

export function playSound(cue: Parameters<NonNullable<ReturnType<typeof createUISFX>>["play"]>[0], opts?: Parameters<NonNullable<ReturnType<typeof createUISFX>>["play"]>[1]) {
  if (typeof window === "undefined") return null
  const p = getPlayer()
  if (!p || !p.isEnabled()) return null
  // suppress until unlocked to avoid stale queue
  if (!unlocked) return null
  try {
    return p.play(cue as never, opts as never)
  } catch {
    return null
  }
}

export function useSoundUnlock() {
  // call from pointer/keyboard handler to unlock before async
  return unlockSound
}

export function isSoundEnabled() {
  const p = getPlayer()
  return p?.isEnabled() ?? true
}

export function setSoundEnabled(enabled: boolean) {
  const p = getPlayer()
  if (p) {
    if (!enabled) {
      p.stopAll()
    }
    p.setEnabled(enabled)
  }
}
