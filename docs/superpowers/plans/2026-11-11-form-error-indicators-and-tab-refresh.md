# Form Error Indicators & Tab-Refresh Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two frontend issues on the `/daftar` scholarship registration page: (1) inconsistent destructive error styling on the `catatan` textarea and `beasiswa` custom select button (they lack red border/error styling when validation fails, unlike `FormInput`-backed fields), and (2) an unexpected page refresh/state disruption when switching browser tabs or windows.

**Architecture:** The `/daftar` page uses `@tanstack/react-form` with Zod validation. Field components (`FormInput`, `FormSelect`, `FormDateInput`, `FormImagesUpload`) wrap shadcn UI primitives and already apply `border-red-600 bg-red-50 text-red-900` destructive styling via `form-base.tsx` error logic. Two fields bypass this pattern: `catatan` uses a raw `<textarea>` and `beasiswa` uses a custom `<button>`-based picker — neither applies red border styling on error. The tab-refresh issue stems from TanStack Query's default `refetchOnWindowFocus: true`, which refetches `useScholarships`/`useMyBeasiswa` on tab return, potentially re-triggering form field reset effects.

**Tech Stack:** React 19, TanStack React Form, Zod 4, TanStack Query 5, Tailwind v4, TypeScript, Vite.

**Spec:** No external spec. This plan is derived from the issue description and direct code inspection.

## Global Constraints

- Maintain strict TypeScript (`tsc -b` must pass with no errors)
- Do not introduce unrelated refactors, breaking changes, or placeholder/commented-out code
- Follow existing Neon Brutalism styling tokens (`border-4 border-black`, `border-red-600 bg-red-50 text-red-900`, `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`)
- All error states must use `aria-invalid` and visible error text (already present; only visual border styling is missing)
- Do not modify backend files or previously merged beasiswa-ku feature files

## Review Focus

1. **`catatan` textarea raw element** — when `hasErr` is true, textarea border stays `border-black` instead of switching to destructive red; fix so it matches `FormInput` error styling
2. **`beasiswa` custom select button** — when `field.state.meta.errors.length > 0`, button border stays `border-black` instead of destructive red; fix so it matches `FormSelect` error styling
3. **QueryClient `refetchOnWindowFocus`** — default `true` causes `useScholarships`/`useMyBeasiswa` refetch on tab return; set to `false` to prevent state disruption
4. **Unsaved form data loss** — add `beforeunload` warning in `Daftar.tsx` when form is dirty but not submitted

---

### Task 1: Add destructive error styling to `catatan` textarea in Daftar.tsx

**Files:**
- Modify: `frontend/src/pages/Daftar.tsx:298-319`

**Interfaces:**
- Consumes: `field.state.meta.errors` (already computed as `hasErr`)
- Produces: textarea element with `border-red-600 bg-red-50 text-red-900` classes when `hasErr` is true

- [ ] **Step 1: Modify textarea className to apply destructive styling when invalid**

In the `catatan` field render (lines 303-315), change the `<textarea>` className from:
```
"w-full border-4 border-black bg-white p-4 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none outline-none focus:bg-yellow-50 break-words"
```
to conditionally include destructive classes:
```
cn(
  "w-full border-4 border-black bg-white p-4 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none outline-none focus:bg-yellow-50 break-words",
  hasErr && "border-red-600 bg-red-50 text-red-900 placeholder:text-red-700 focus-visible:text-red-900"
)
```

- [ ] **Step 2: Import `cn` if not already imported**

Verify `cn` is imported from `@/lib/utils` (it is, line 11).

- [ ] **Step 3: Run typecheck**

Run: `npx tsc -b`
Expected: PASS with no errors

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Daftar.tsx
git commit -m "fix: add destructive red border styling to catatan textarea on validation error"
```

---

### Task 2: Add destructive error styling to `beasiswa` custom select button in Daftar.tsx

**Files:**
- Modify: `frontend/src/pages/Daftar.tsx:273-289`

**Interfaces:**
- Consumes: `field.state.meta.errors` (already accessible in the render callback)
- Produces: select button element with `border-red-600 bg-red-50 text-red-900` classes when errors exist

- [ ] **Step 1: Extract error state and modify button className**

In the `beasiswa` field render (lines 268-294), compute `const isSelectInvalid = field.state.meta.errors.length > 0` and change the button className from:
```
"w-full border-4 border-black bg-white p-3 text-left font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 break-words"
```
to:
```
cn(
  "w-full border-4 border-black bg-white p-3 text-left font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 break-words",
  isSelectInvalid && "border-red-600 bg-red-50 text-red-900",
  !isSelectInvalid && "hover:border-black"
)
```
Also add `isSelectInvalid` to the `aria-invalid` prop (already set from `field.state.meta.errors.length > 0`).

- [ ] **Step 2: Run typecheck**

Run: `npx tsc -b`
Expected: PASS with no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/Daftar.tsx
git commit -m "fix: add destructive red border styling to beasiswa select button on validation error"
```

---

### Task 3: Disable `refetchOnWindowFocus` and add `beforeunload` warning

**Files:**
- Modify: `frontend/src/main.tsx:12-17`
- Modify: `frontend/src/pages/Daftar.tsx`

**Interfaces:**
- Consumes: QueryClient default options, TanStack Form `form.store` subscription
- Produces: QueryClient with `refetchOnWindowFocus: false`, `refetchOnReconnect: false`; `beforeunload` handler on Daftar when form is dirty

- [ ] **Step 1: Disable refetchOnWindowFocus in QueryClient**

In `main.tsx`, add `refetchOnWindowFocus: false` and `refetchOnReconnect: false` to the `defaultOptions.queries` object:

```js
const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false },
    mutations: { retry: false },
  },
})
```

- [ ] **Step 2: Add beforeunload warning in Daftar.tsx**

In `Daftar.tsx`, subscribe to `form.store` for `isSubmitting` and `modified` (or track dirty state manually), and add a `beforeunload` event listener that prompts the user when the form has unsaved changes:

```tsx
useEffect(() => {
  const isModified = useStore(form.store, (s) => s.modified)
  ...
  const handler = (e: BeforeUnloadEvent) => {
    if (isModified && !isSubmitting) {
      e.preventDefault()
      e.returnValue = ""
    }
  }
  window.addEventListener("beforeunload", handler)
  return () => window.removeEventListener("beforeunload", handler)
}, [form])
```

Note: TanStack Form's `modified` field may need to be derived from `state.modified` or tracked via `form.getState()`. Check the API — `@tanstack/react-form` exposes `form.state.modified`.

- [ ] **Step 3: Run typecheck**

Run: `npx tsc -b`
Expected: PASS with no errors

- [ ] **Step 4: Commit**

```bash
git add frontend/src/main.tsx frontend/src/pages/Daftar.tsx
git commit -m "fix: disable query refetch on window focus and add beforeunload warning for unsaved form data"
```

---

### Task 4: Verify full build and lint

**Files:**
- Test: `frontend/` (typecheck + build + lint)

**Interfaces:**
- None (verification task)

- [ ] **Step 1: Run typecheck**

Run: `npx tsc -b`
Expected: PASS with no errors

- [ ] **Step 2: Run production build**

Run: `npx vite build`
Expected: PASS, builds to `dist/` without errors (chunk size warning is pre-existing and acceptable)

- [ ] **Step 3: Run lint**

Run: `npx oxlint`
Expected: PASS with no errors

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "chore: verify typecheck, build, and lint pass"
```

---

## Post-Implementation Verification Checklist

Manual verification steps (to be performed by the developer):

- [ ] Open `/daftar` page in browser
- [ ] Leave `catatan` (textarea) empty, attempt submit → textarea should show red border (`border-red-600`) and red background (`bg-red-50`)
- [ ] Leave `beasiswa` select unselected, attempt submit → select button should show red border (`border-red-600`)
- [ ] Fill `catatan` with valid text (>20 chars), select a beasiswa → red borders should clear
- [ ] Switch to another tab and back → page should NOT reload; form data should be preserved
- [ ] Modify form data, attempt to close tab/browser → `beforeunload` warning should appear
