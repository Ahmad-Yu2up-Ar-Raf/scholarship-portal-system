# Beasiswa App — Product Requirements Document (PRD)

> **Phase 1 — Planning & Deep Research** — No executable code in this phase. All findings are validated against `docs/Beasiswa-App.md`, benchmark codebase `C:/Dev/Web/catering`, and `neobrutalism.com` documentation scraped on 2026-09-07.

---

## 1. Executive Summary

Platform: Online campus scholarship registration filtered by cumulative GPA (IPK). Certification context: **Junior Web Developer (FR.SKEMA-02-07)**, 180-minute exam, 6 competency units (`J.620100.005.02`, `010.01`, `015.01`, `016.01`, `017.02`, `019.02`). Deliverables per spec: homepage with 2+ scholarship types, conditional registration form, and results view with `status_ajuan = "belum di verifikasi"`.

Current repo state: **Greenfield** — `docs/Beasiswa-App.md` (64.8K) is the sole asset. No `frontend/`, `backend/`, `package.json`, or `.git` exists. Planning assumes ground-up scaffold reusing the `catering` template verbatim.

---

## 2. Scrape & Benchmark Verification

### 2.1 Inspected Files

| Source | Path | Purpose |
|---|---|---|
| Requirements | `docs/Beasiswa-App.md:1-185` | 3-page exam brief, 10 business rules (§C Skenario), 6 unit Tugas-tugas |
| Benchmark Hook | `C:/Dev/Web/catering/frontend/src/hooks/use-form.ts:1-200` | `createFormHook` + `createFormHookContexts` + `withGlobalBehaviors()` — the ONE form entry point |
| Benchmark Form Fragments | `frontend/src/components/ui/fragments/custom-ui/form/form-base.tsx:1-103` | `Field` wrapper, `submissionAttempts>0` error gate |
|  | `form-input.tsx:1-110` | Numeric sanitization, `null` on empty, `invalid>valid>focus` border priority |
|  | `form-select.tsx:1-122` | `NONE_VALUE=__none__` sentinel, `!h-12 !rounded-2xl` |
|  | `form-textarea.tsx:1-92` | `min-h-[120px]` |
|  | `form-radio-group.tsx:1-152` | Per-option active classes |
|  | `form-currency-input.tsx:1-106` | `Intl.NumberFormat id-ID IDR` masking |
|  | `form-tag-input.tsx:1-162` | Chip + Enter-to-add |
|  | `form-images-upload.tsx:1-56` | Thin wrapper over `MediaDropzone` |
|  | `media-dropzone.tsx:1-260` | Drag-drop, `WeakMap<File,URL>`, `ACCEPTED png/jpeg/webp`, `MAX 5MB` |
|  | `form-checkbox*.tsx`, `form-combobox.tsx`, `form-date-input.tsx` | Additional field primitives |
| Domain Block | `frontend/src/components/ui/core/block/admin/paket/components/paket-form.tsx:1-225` | Presentational-only form (`form: PaketFormReturnType`), `1.2fr/0.8fr` grid, sticky thumbnail |
|  | `paket-form-actions.tsx:1-55` | `form.Subscribe isSubmitting` + `activeUploads` guard |
|  | `hooks/use-paket-mutations.ts:1-372` | `retry:false`, optimistic `onMutate`, `resolveUploads()` via `Promise.all` |
|  | `validations/paket-schema.ts:1-75` | Zod enums + `fileOrUrl` union |
|  | `utils/paket-form-mapper.ts:1-114` | `toFormDefaults` / `areFormValuesEqual` with `FILE_SENTINEL` / `toPaketPayload` |
| Frontend Config | `frontend/package.json:1-74` | Source of truth for version pinning (see §3) |
| Neobrutalism | `https://neobrutalism.com/` | Registry model, Base/Radix/ReactAria variants, `shadcn add <url>` |
|  | `https://neobrutalism.com/docs` | Five traits: thick borders, hard shadows, loud color, square+heavy type, tactile press |
|  | `https://neobrutalism.com/docs/installation` | Fonts `Archivo Black` + `Space Grotesk`, `globals.css` tokens, `--radius:0` |
|  | `https://neobrutalism.com/docs/installation/vite` | 7-step Vite setup: `tailwindcss@4` + `@tailwindcss/vite`, `tsconfig` `@/*`, `vite.config.ts` alias |

### 2.2 Neobrutalism Compliance Summary

- **Install model:** No package — CLI copies source. Every component URL is `https://neobrutalism.com/r/<base|radix>/<component>.json`. This project uses **`base`** (matches catering's `radix-ui` + `base-ui` mix; base primitives are newer, catering already depends on `@base-ui/react@1.7.0`).
- **Style traits enforced by tokens:** `--border:#000`, `--radius:0`, `--shadow: 3px 3px 0 0 var(--border)` (+ `xs/sm/md/lg/xl/2xl` hard offsets, zero blur), loud palette `--primary:#ffdc58`, `--background:#fff7e8`. No gradients/glassmorphism.
- **Fonts:** `Archivo Black` (headings, `--font-head`) + `Space Grotesk` (body, `--font-sans`) via `next/font/google` in Next.js or `@fontsource` in Vite. Catering uses `Fraunces + Space Grotesk + Instrument Serif` — swap to neobrutal tokens on scaffold.
- **A11y:** Radix/Base primitives provide focus/keyboard/screen-reader out of the box — no custom ARIA needed.

---

## 3. Target Package Versions (Validated)

Resolved against `catering/frontend/package.json:16-55`, Vite docs, and Laravel release feed. Pin with `package.json` exact ranges; run `npx taze` post-scaffold to surface drift.

### 3.1 Backend

| Package | Target | Source / Notes |
|---|---|---|
| PHP | `^8.3` (8.3 or 8.4) | Laravel 12 requires `>=8.2`; 8.3 is current stable. Catering backend runs Laravel 12 on 8.3. |
| Laravel | `^12` via `laravel new --api` | `laravel new` scaffolds current stable (12.x as of 2026-09). API-only flag per assumptions. |
| Laravel Breeze | `^2.3` (API stack) | `composer require laravel/breeze --dev` then `php artisan breeze:install api`. API guard uses `sanctum`. |
| SQLite | bundled (`database/database.sqlite`) | Default for exam/demo; zero-config. Add `DB_CONNECTION=sqlite` to `.env`. No MySQL needed per spec. |
| Scramble (OpenAPI) | `^0.12` | Optional — catering uses it to generate `/docs/api`. Include if API docs required. |
| Pest / PHPUnit | `^3 / ^11` | Catering uses Pest 3; aligns with Laravel 12. |

No conflict: `laravel new` + Breeze API + SQLite is the supported path. Do not add `breeze:blade` — this is headless.

### 3.2 Frontend

| Package | Target | Source / Notes |
|---|---|---|
| Node | `>=20 LTS` (22 LTS recommended) | Vite 8 requires Node 20+. |
| Vite | `^8.0` (`6.x` via `@vitejs/plugin-react`) | Catering `vite@8`, `@vitejs/plugin-react@6` |
| React | `^19.2.6` | Catering `react@19.2.6`, `react-dom@19.2.6` |
| TypeScript | `~6.0` (or `^5.9`) | Catering `typescript@~6`, `typescript-eslint@8` |
| Tailwind CSS | `^4.0` + `@tailwindcss/vite ^4` | Catering `tailwindcss@4`, `@tailwindcss/vite@4`. v4 removes `tailwind.config.js` — tokens live in `src/index.css` via `@theme inline`. |
| Tailwind Merge | `^3.6.0` | Catering `tailwind-merge@3.6` for `cn()` |
| Radix / Base UI | `radix-ui@1.6.7` + `@base-ui/react@1.7.0` | Catering pins both; neobrutalism ships both variants — use `base` URLs to align with Base UI. |
| React Router | `^8.3.0` (or `react-router-dom`) | Catering `react-router@8.3`. Use `createBrowserRouter` + `RouterProvider`. |
| TanStack React Query | `^5.101.4` | Catering `5.101.4`. `retry:false` on mutations per benchmark. |
| TanStack React Form | `^1.33.4` + `@tanstack/react-store ^0.11.1` | Catering `1.33.4`. Pairs with `useAppForm` factory. |
| Zod | `^3.25` (or `^4` if `standardSchema` needed) | Not in catering `package.json` but used in `paket-schema.ts`; add `zod@^3.25` + `@tanstack/zod-form-adapter` if using adapter, or `zodValidator` inline. |
| Zustand | `^5.0.14` | Catering `5.0.14` — for global `ipk` constant store + `activeUploads` counter. |
| Ky | `^2.0.2` | Catering `ky@2.0.2` — fetch wrapper with `prefixUrl: http://192.168.1.4:8000/api/v1`. |
| Sonner | `^2.0.7` | Catering `sonner@2.0.7` — toasts for `onSubmitInvalid` + success. |
| shadcn CLI | `^4.15.0` (`shadcn@latest`) | Catering `shadcn@4.15`. Used only as `dlx` — not a runtime dep. |
| Fonts | `@fontsource-variable/archivo-black` + `@fontsource-variable/space-grotesk` | Replace catering's `fraunces/instrument-serif`. Install as `@fontsource` for Vite (no `next/font`). |
| Optional (from catering) | `gsap@3.15`, `framer-motion@12.43`, `vaul@1.1`, `embla-carousel-react@8.6`, `recharts@3.10` | Keep only if blocks need them; otherwise omit to stay lean (ponytail rule). |

### 3.3 Version Conflicts & Resolutions

| Conflict | Resolution |
|---|---|
| React 19 + `@types/react@19` vs older TanStack Form | TanStack Form 1.33.4 explicitly supports React 19 — no downgrade. |
| Tailwind v4 vs legacy `tailwind.config.js` tutorials | Use catering's v4 path: `src/index.css` `@import "tailwindcss"; @theme inline { ... }`. No config file. |
| Vite 8 + Node 18 | Require Node 20+; document `nvm use 22` in README. |
| Zod 4 breaking `zodResolver` shape | Pin `zod@^3.25` until TanStack adapter supports v4; note in PRD as follow-up. |
| `shadcn init` overwrites `src/index.css` | Run `shadcn init` before injecting neobrutalism theme tokens; then overwrite with `globals.css` block from `neobrutalism.com/docs/installation#add-the-theme`. |
| Ky base URL `192.168.1.4:8000` unreachable on `localhost` dev | Add `VITE_API_URL` env fallback: `import.meta.env.VITE_API_URL ?? "http://192.168.1.4:8000/api/v1"` |

---

## 4. Infrastructure & Paths

Per assumptions:

```
C:/Dev/Web/Beasiswa-app/
├── backend/               # Laravel API-only (laravel new --api)
│   └── http://192.168.1.4:8000/api/v1
├── frontend/              # Vite + React + Tailwind v4
│   └── http://localhost:5173 (dev)
└── docs/
    ├── Beasiswa-App.md    # exam brief (existing)
    └── PRD.md             # this file
```

- Backend binds `0.0.0.0:8000` so `192.168.1.4` is reachable from LAN devices. Document `php artisan serve --host=0.0.0.0 --port=8000`.
- Frontend `VITE_API_URL` points to that LAN IP; keep `localhost` fallback for single-machine dev.

---

## 5. Functional Requirements

### 5.1 Views & Navigation (FR.SKEMA §C.1)

| View | Route | Menu Label | Notes |
|---|---|---|---|
| Homepage | `/` | Beranda | Hero + scholarship types + CTA to Daftar |
| Jenis Beasiswa | `/#jenis` (anchor) or `/beasiswa` | Jenis Beasiswa | ≥2 cards: Akademik / Non-Akademik (plus optional e.g. Tahfidz, Prestasi). Each card shows syarat ringkas. |
| Daftar Beasiswa | `/daftar` | Daftar Beasiswa | Registration form (see §5.2). Entry via menu + hero CTA. |
| Hasil | `/hasil` | Hasil | Table of submissions, all form fields + `status_ajuan`. |

Navigation: Neobrutalism `navigation-menu` or simple `header` with `button` links (`react-router` `<NavLink>`). Mobile uses `sheet`/`drawer`.

### 5.2 Registration Form — 10 Business Rules → Field Spec

| # | Spec Rule | Field | Type | Validation (Zod) | UI Behavior |
|---|---|---|---|---|---|
| 1 | Masukkan nama | `nama` | `Input` | `z.string().trim().min(3).max(100)` | Required, placeholder "Nama lengkap" |
| 2 | Email format validated | `email` | `Input` | `z.string().trim().email("Format email tidak valid")` | `type="email"`, `inputMode="email"` |
| 3 | HP number-only | `phone` | `Input` | `z.string().regex(/^[0-9]+$/, "Hanya angka").min(10).max(15)` | `inputMode="numeric"`, client sanitization `replace(/[^0-9]/g,"")` — same as `catering/form-input.tsx:35` |
| 4 | Semester 1–8 | `semester` | `Select` | `z.enum(["1","2","3","4","5","6","7","8"])` or `z.coerce.number().int().min(1).max(8)` | `Select` with 8 options, `NONE_VALUE` sentinel `__none__` |
| 5 | IPK auto from constant | `ipk` | `Input` (disabled, readOnly) | `z.number().min(0).max(4)` — value from `const IPK = 3.4` (or `2.9` for failure case) | Displayed on mount via `useBeasiswaStore.ipk` or `const IPK` constant. Not editable. |
| 6 | IPK < 3 blocks Beasiswa + Upload + Simpan | `beasiswa_type`, `berkas`, `submit` | `Select` + `MediaDropzone` + `Button` | Schema-level: `superRefine` disables file/type when `ipk < 3` OR UI simply disables controls | `disabled={ipk < 3}` on all three; show `Alert` "IPK di bawah 3.0 tidak memenuhi syarat" |
| 7 | IPK ≥ 3 autofocus Beasiswa | `beasiswa_type` | `Select` | — | `useEffect(() => { if (ipk >= 3) document.getElementById("beasiswa_type")?.focus() }, [ipk])` |
| 8 | Upload pdf/jpg/zip | `berkas` | `MediaDropzone` | `z.union([z.instanceof(File), z.string().url()]).refine(validateExt, "Hanya pdf/jpg/zip")` with `MAX_BYTES 5MB` (reuse catering's `MediaDropzone` limits, relax `ACCEPTED_TYPES` to `application/pdf,image/jpeg,application/zip`) | Drag-drop tiles, `WeakMap<File,string>` previews, `accept: ".pdf,.jpg,.jpeg,.zip"` |
| 9 | Daftar → `status_ajuan="belum di verifikasi"` | — | — | Injected in `toBeasiswaPayload()` mapper | Shown in `Sonner` success toast, then `navigate("/hasil")` |
| 10 | Hasil shows all fields + status | — | `Table` | — | Columns: Nama, Email, HP, Semester, IPK, Beasiswa, Berkas (link), Status (Badge), Tanggal Daftar |

Additional assumptions (allowed per `Note: Silakan tambahkan asumsi lainnya`): `created_at` timestamp, `id` auto-increment, `berkas` stored as filename or URL, `status_ajuan` enum `belum di verifikasi | diverifikasi | ditolak` (only first value used on create).

### 5.3 Conditional Logic — State Diagram

```
[Mount /daftar] → Read IPK constant (e.g. 3.4)
       │
       ├─ ipk < 3.0 ──→ beasiswa_type.disabled = true
       │                berkas.disabled = true
       │                submit.disabled = true
       │                Show Alert (destructive): "IPK < 3.0 — tidak memenuhi syarat"
       │
       └─ ipk >= 3.0 ─→ beasiswa_type.focus()
                        berkas.enabled = true
                        submit.enabled = true
                        Form validates onSubmit (withGlobalBehaviors mirrors to onChange/onBlur,
                        errors shown only after submissionAttempts > 0)
```

Backend also enforces gate: `BeasiswaRequest` rule `ipk >= 3` or return 422 — client gate is UX, server gate is truth.

---

## 6. Component Mapping — Only `shadcn@latest` + Neobrutalism `base`

No native hand-rolled components. Every primitive is a neobrutalism `base` variant wrapping Radix/Base UI.

| Need | Neobrutalism Component | Registry URL | Used For |
|---|---|---|---|
| Actions | `button` | `…/r/base/button.json` | Submit, Batal, CTA, Nav |
| Text input | `input` | `…/r/base/input.json` | Nama, Email, Phone, IPK (readOnly) |
| Dropdown | `select` | `…/r/base/select.json` | Semester, Beasiswa type |
| Alternative dropdown | `native-select` | `…/r/base/native-select.json` | Optional fallback for semester |
| Multiline | `textarea` | `…/r/base/textarea.json` | Optional "Alasan mengajukan" if added |
| Choice | `radio-group` | `…/r/base/radio-group.json` | Alternative for Beasiswa type (2 options) |
| Boolean | `checkbox` | `…/r/base/checkbox.json` | Persetujuan syarat |
| Container | `card` | `…/r/base/card.json` | Jenis Beasiswa cards, form sections, Hasil rows |
| Labels | `label` + `field` | `…/r/base/label.json`, `…/r/base/field.json` | `FormBase` wrapper (`Field`, `FieldLabel`, `FieldError`, `FieldDescription`) |
| Grouping | `separator` | `…/r/base/separator.json` | Section dividers |
| Feedback | `alert` | `…/r/base/alert.json` | IPK < 3 warning |
| Status | `badge` | `…/r/base/badge.json` | `status_ajuan` pill in Hasil table |
| Data | `table` | `…/r/base/table.json` | Hasil view (or `data-table` for sort/filter) |
| Overlay | `dialog` | `…/r/base/dialog.json` | Optional confirmation on Daftar |
| Navigation | `navigation-menu` | `…/r/base/navigation-menu.json` | Header nav |
| Mobile nav | `sheet` / `drawer` | `…/r/base/sheet.json` | Mobile menu |
| Loading | `spinner` | `…/r/base/spinner.json` | Submit + upload states (`paket-form-actions` pattern) |
| Toast | `sonner` | `…/r/base/sonner.json` | `toast.error("Validasi Gagal")` + success |
| Date | `calendar` + `popover` | `…/r/base/calendar.json`, `…/r/base/popover.json` | If tanggal lahir needed |
| Tabs | `tabs` | `…/r/base/tabs.json` | Switch Akademik / Non-Akademik detail |

**Additive only:** Do not create `src/components/ui/button.tsx` by hand — always via CLI. Theme tokens are edited in `src/index.css`, never in component files.

### 6.1 Custom Form Layer (Reused, Not Reinvented)

Reuse **verbatim** from catering:

- `src/hooks/use-form.ts` — copy 200 lines, no edits.
- `src/components/ui/fragments/custom-ui/form/*` (14 files) — copy all; only change `ACCEPTED_TYPES` and `MAX_BYTES` in `media-dropzone.tsx` to allow `pdf/jpg/zip` for this domain.
- `src/components/ui/fragments/shadcn-ui/*` — `field.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`, `label.tsx`, `badge.tsx`, `card.tsx`, etc. — these are the base shadcn primitives that neobrutalism components internally depend on. Keep catering's versions; neobrutal install will overwrite only the brutal-styled wrappers.

Domain block skeleton to create (mirrors `ui/core/block/admin/paket`):

```
src/components/ui/core/block/beasiswa/
├── components/
│   ├── beasiswa-form.tsx              # presentational, props { form: BeasiswaFormReturnType }
│   ├── beasiswa-form-actions.tsx      # form.Subscribe isSubmitting + activeUploads guard
│   └── beasiswa-result-table.tsx      # Table with Badge for status_ajuan
├── hooks/
│   ├── use-beasiswa-mutations.ts      # create/list via Ky + TanStack Query
│   └── use-beasiswa-query.ts          # useQuery for /hasil
├── validations/
│   └── beasiswa-schema.ts             # Zod schema (see §7)
├── config/
│   └── beasiswa-enum-options.ts       # [{value:"akademik",label:"Beasiswa Akademik"}, ...]
├── utils/
│   ├── beasiswa-form-mapper.ts        # toFormDefaults / areFormValuesEqual / toBeasiswaPayload
│   └── beasiswa-format.ts             # format helpers (semester label, etc.)
└── types/
    └── beasiswa.ts                    # BeasiswaSubmission, BeasiswaFormValues
```

---

## 7. Form Schema & Types

### 7.1 Zod Schema (`validations/beasiswa-schema.ts`)

```ts
import { z } from "zod"

export const beasiswaTypeEnum = z.enum(["akademik", "non_akademik"])
export type BeasiswaType = z.infer<typeof beasiswaTypeEnum>

export const beasiswaSchema = z.object({
  nama: z.string().trim().min(3, "Minimal 3 karakter").max(100),
  email: z.string().trim().email("Format email tidak valid").max(255),
  phone: z.string()
    .regex(/^[0-9]+$/, "Hanya angka")
    .min(10, "Minimal 10 digit").max(15, "Maksimal 15 digit"),
  semester: z.enum(["1","2","3","4","5","6","7","8"], { errorMap: () => ({ message: "Pilih semester 1–8" }) }),
  ipk: z.number().min(0).max(4), // constant, not user-editable
  beasiswa_type: beasiswaTypeEnum, // disabled when ipk < 3
  berkas: z.union([z.instanceof(File), z.string().url()])
    .refine((v) => {
      const name = v instanceof File ? v.name : v
      return /\.(pdf|jpe?g|zip)$/i.test(name)
    }, "Hanya pdf, jpg, atau zip")
    .array().min(1, "Upload minimal 1 berkas").max(3),
  // status_ajuan is server-injected, not in form
}).superRefine((data, ctx) => {
  if (data.ipk < 3 && data.berkas?.length) {
    ctx.addIssue({ code: "custom", path: ["berkas"], message: "IPK < 3.0 tidak dapat upload berkas" })
  }
})

export type BeasiswaFormValues = z.infer<typeof beasiswaSchema>
```

- `ipk` is **not** validated as required input — it is set via `defaultValues: { ipk: IPK_CONSTANT }` and displayed readOnly.
- Client disables `beasiswa_type`/`berkas`/`submit` when `ipk < 3`; `superRefine` is the server-truth backup.

### 7.2 Types (`types/beasiswa.ts`)

```ts
export type BeasiswaSubmission = BeasiswaFormValues & {
  id: number
  status_ajuan: "belum di verifikasi" // literal on create
  created_at: string // ISO
  berkas_urls?: string[] // resolved after upload
}
```

---

## 8. State Management Flow

```
[Zustand: useBeasiswaStore]
  ipk: number (constant 3.4 | 2.9 — single source of truth)
  setIpk(n) — for demo toggle (optional dev switch)

[ TanStack React Form: useAppForm<BeasiswaFormValues> ]
  defaultValues: { nama:"", email:"", phone:"", semester:"__none__", ipk, beasiswa_type:"__none__", berkas:[] }
  validators: { onChange: beasiswaSchema, onSubmit: beasiswaSchema } // withGlobalBehaviors auto-fills onBlur
  onSubmit: async ({ value }) => {
    toast.loading("Menyimpan...")
    const urls = await resolveUploads(value.berkas) // Promise.all → Ky POST /upload (or local mock)
    const payload = toBeasiswaPayload({ ...value, berkas: urls }) // injects status_ajuan
    await createMutation.mutateAsync(payload) // Ky POST /beasiswa
    toast.success("Pendaftaran berhasil")
    navigate("/hasil")
  }
  onSubmitInvalid: globalOnSubmitInvalid // toast + focusFirstInvalidField (built into useAppForm)

[ TanStack React Query ]
  useBeasiswaList() → GET /beasiswa → cached, invalidated on create
  useBeasiswaCreate() → POST /beasiswa, optimistic setQueryData, retry:false

[ Ky instance ]
  ky.create({ prefixUrl: import.meta.env.VITE_API_URL ?? "http://192.168.1.4:8000/api/v1", hooks: { beforeRequest: [attach XSRF], afterResponse: [handle 422 envelope] } })
```

Error handling: `getErrorMessage(err)` extracts `HTTPError.response.json().message` → fallback `HTTP ${status}` → `TypeError` network. Same as `catering/hooks/use-paket-mutations.ts:40-70`.

---

## 9. Frontend Routes

| Route | Component | Guard | Data |
|---|---|---|---|
| `/` | `pages/home.tsx` | — | Static + Jenis Beasiswa cards |
| `/daftar` | `pages/daftar.tsx` | — | `BeasiswaForm` with IPK constant |
| `/hasil` | `pages/hasil.tsx` | — | `useBeasiswaList()` table |

Router uses `createBrowserRouter` per catering `src/router/`. Add `404` fallback.

---

## 10. API Endpoints (Laravel API-only)

Base: `http://192.168.1.4:8000/api/v1`

| Method | Path | Controller | Request | Response | Notes |
|---|---|---|---|---|---|
| GET | `/beasiswa` | `BeasiswaController@index` | — | `200 { data: BeasiswaResource[] }` | Paginated if needed; exam allows non-paginated |
| POST | `/beasiswa` | `BeasiswaController@store` | `BeasiswaRequest` (see below) | `201 { data: BeasiswaResource }` | Injects `status_ajuan` |
| GET | `/beasiswa/{id}` | `BeasiswaController@show` | — | `200 { data: BeasiswaResource }` | Optional for detail |
| POST | `/upload` | `UploadController@store` | `multipart file` | `200 { url: string }` | Optional if storing files locally; otherwise `berkas` is base64 or local path for demo |
| GET | `/beasiswa-types` | `BeasiswaTypeController@index` | — | `200 { data: {value,label}[] }` | Optional — frontend can hardcode 2 types |

### 10.1 `BeasiswaRequest` Validation (mirrors Zod, server is truth)

```php
'nama'           => ['required','string','min:3','max:100'],
'email'          => ['required','email','max:255'],
'phone'          => ['required','regex:/^[0-9]+$/','min:10','max:15'],
'semester'       => ['required','integer','between:1,8'],
'ipk'            => ['required','numeric','between:0,4'],
'beasiswa_type'  => ['required','in:akademik,non_akademik','required_if:ipk,>=,3'], // custom rule: 422 if ipk<3
'berkas'         => ['required','array','min:1','max:3'],
'berkas.*'       => ['file','mimes:pdf,jpg,jpeg,zip','max:5120'],
```

Server injects: `'status_ajuan' => 'belum di verifikasi'` on create.

### 10.2 Data Model (`beasiswas` table)

| Column | Type | Notes |
|---|---|---|
| `id` | `id` | PK |
| `nama` | `string 100` | |
| `email` | `string 255` + `index` | |
| `phone` | `string 15` | digits only |
| `semester` | `tinyInteger` `1..8` | |
| `ipk` | `decimal 3,2` | e.g. 3.40 |
| `beasiswa_type` | `enum akademik,non_akademik` | |
| `berkas_path` | `json` or `string` | stored paths / URLs |
| `status_ajuan` | `string default 'belum di verifikasi'` | enum in app layer |
| `created_at` / `updated_at` | `timestamps` | |

Migration: `php artisan make:model Beasiswa -mcr` (model + migration + controller + resource + request).

CORS: `config/cors.php` allows `http://localhost:5173` and `http://192.168.1.4:5173`.

---

## 11. File Handling

- Accept: `.pdf,.jpg,.jpeg,.zip` — matches spec "pdf/jpg/zip". Catering's `MediaDropzone` restricts to `png/jpeg/webp` — relax to `ACCEPTED_TYPES = ["application/pdf","image/jpeg","application/zip"]` + `ACCEPTED_EXTS = [".pdf",".jpg",".jpeg",".zip"]`.
- Max per file: `5MB` (same as catering). Max files: `3`.
- Storage: For exam, `localStorage` + fake `URL.createObjectURL` is acceptable (see catering's deferred upload: `File` stays local until submit). For Laravel, `Storage::disk('public')->putFile('berkas', $file)` and return URL. Deferred pattern: `resolveUploads()` does `Promise.all(files.map(uploadDeferredImage))` with `activeUploads` counter for footer spinner.
- Preview: `WeakMap<File,string>` for object URLs — revoke on unmount.

---

## 12. `npx shadcn@latest add ...` Commands

Run from `frontend/` after `shadcn init`. Use **`base`** variant (matches `@base-ui/react`). One command per component — idempotent.

```bash
# Core form & layout (required)
npx shadcn@latest add https://neobrutalism.com/r/base/button.json
npx shadcn@latest add https://neobrutalism.com/r/base/input.json
npx shadcn@latest add https://neobrutalism.com/r/base/label.json
npx shadcn@latest add https://neobrutalism.com/r/base/field.json
npx shadcn@latest add https://neobrutalism.com/r/base/card.json
npx shadcn@latest add https://neobrutalism.com/r/base/select.json
npx shadcn@latest add https://neobrutalism.com/r/base/native-select.json
npx shadcn@latest add https://neobrutalism.com/r/base/textarea.json

# Choice & feedback
npx shadcn@latest add https://neobrutalism.com/r/base/radio-group.json
npx shadcn@latest add https://neobrutalism.com/r/base/checkbox.json
npx shadcn@latest add https://neobrutalism.com/r/base/alert.json
npx shadcn@latest add https://neobrutalism.com/r/base/badge.json
npx shadcn@latest add https://neobrutalism.com/r/base/separator.json
npx shadcn@latest add https://neobrutalism.com/r/base/spinner.json
npx shadcn@latest add https://neobrutalism.com/r/base/sonner.json

# Data & navigation
npx shadcn@latest add https://neobrutalism.com/r/base/table.json
npx shadcn@latest add https://neobrutalism.com/r/base/navigation-menu.json
npx shadcn@latest add https://neobrutalism.com/r/base/sheet.json
npx shadcn@latest add https://neobrutalism.com/r/base/dialog.json
npx shadcn@latest add https://neobrutalism.com/r/base/tabs.json

# Optional (add only if needed; otherwise skip per ponytail)
npx shadcn@latest add https://neobrutalism.com/r/base/calendar.json
npx shadcn@latest add https://neobrutalism.com/r/base/popover.json
npx shadcn@latest add https://neobrutalism.com/r/base/avatar.json
npx shadcn@latest add https://neobrutalism.com/r/base/skeleton.json
```

Registry alias (optional, for `search`/`list`):

```json
// components.json
{ "registries": { "@neobrutalism": "https://neobrutalism.com/r/radix/{name}.json", "@neobrutalism-base": "https://neobrutalism.com/r/base/{name}.json" } }
```

Font install for Vite (not `next/font`):

```bash
npm install @fontsource-variable/archivo-black @fontsource-variable/space-grotesk
# then in src/main.tsx: import "@fontsource-variable/archivo-black"; import "@fontsource-variable/space-grotesk";
```

---

## 13. Folder Hierarchy (Unit 015.01 Compliant)

```
Beasiswa-app/
├── docs/
│   ├── Beasiswa-App.md
│   └── PRD.md
├── README.md
├── backend/                          # laravel new Beasiswa-app --api
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/BeasiswaController.php
│   │   │   ├── Requests/BeasiswaRequest.php
│   │   │   └── Resources/BeasiswaResource.php
│   │   └── Models/Beasiswa.php
│   ├── database/migrations/*_create_beasiswas_table.php
│   ├── routes/api.php                # prefix v1
│   └── config/cors.php
└── frontend/                         # vite create --template react-ts
    ├── src/
    │   ├── api/ky.ts                 # Ky instance with VITE_API_URL
    │   ├── components/ui/
    │   │   ├── fragments/custom-ui/form/*   # 14 reused files
    │   │   ├── fragments/shadcn-ui/*        # field, input, select, etc.
    │   │   └── core/block/beasiswa/*        # domain block (see §6.1)
    │   ├── hooks/use-form.ts         # reused 200-line factory
    │   ├── pages/{home,daftar,hasil}.tsx
    │   ├── router/index.tsx
    │   ├── store/beasiswa.ts         # Zustand ipk + activeUploads
    │   ├── lib/utils.ts              # cn()
    │   └── index.css                 # @import "tailwindcss"; @theme inline + :root tokens
    ├── vite.config.ts
    ├── tsconfig.json
    └── components.json
```

`README.md` at root documents hierarchy per Unit 015.01 §2.2.

---

## 14. Verification Checklist (Pre-Submit)

- [ ] Neobrutalism docs scraped: 5 traits, base/radix variants, theme tokens, Vite 7-step.
- [ ] Benchmark mapped: `use-form.ts` + 14 form fragments + `paket` domain pattern.
- [ ] Conditional logic quantified: `ipk < 3` disables 3 controls; `ipk >= 3` autofocuses `beasiswa_type`.
- [ ] Zod schema mirrors `BeasiswaRequest` — no drift.
- [ ] All UI via neobrutalism `base` URLs — no hand-rolled native components.
- [ ] Only docs generated in this phase — no `laravel new` / `vite create` executed.
- [ ] Versions pinned, conflicts resolved (§3.3).
- [ ] `npx shadcn` command list complete.

---

## 15. Risks & Next Steps

| Risk | Mitigation |
|---|---|
| `192.168.1.4` not reachable on evaluator's network | Env fallback + `localhost` docs; make `VITE_API_URL` configurable |
| Zod v4 / TanStack Form adapter lag | Pin Zod 3.25, note upgrade path |
| File upload exceeds 5MB per exam sample | Validate client + server, show `sonner` error, cap at 3 files |
| IPK constant confusion (3.4 vs 2.9) | Expose dev toggle in Zustand store for demo; default `3.4` |

**Next session (execution):** `composer create-project laravel/laravel backend`, `npm create vite@latest frontend -- --template react-ts`, install Tailwind v4 + `@tailwindcss/vite`, run `shadcn init`, add font packages, inject neobrutalism theme into `src/index.css`, copy `use-form.ts` + `custom-ui/form` fragments, scaffold `beasiswa` domain block, implement 3 routes + Zod schema + Ky client, wire `status_ajuan` mapper.

---

*Generated: 2026-09-07 — Phase 1 Planning Only.*
