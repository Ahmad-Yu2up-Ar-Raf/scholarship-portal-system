# PIJAR BEASISWA — Platform Beasiswa Kampus

> **PIJAR** = Platform Beasiswa Cerdas — pendaftaran beasiswa kampus terpadu dengan filter IPK otomatis. Dibangun untuk spesifikasi **Junior Web Developer FR.SKEMA-02-07** (6 unit kompetensi, 180 menit), dieksekusi sebagai aplikasi full-stack production-grade.

[![Stack](https://img.shields.io/badge/stack-Laravel%2012%2B%20%7C%20React%2019%20%7C%20Vite%208%20%7C%20Tailwind%204-000?labelColor=000)](./docs/PRD.md)
[![UI](https://img.shields.io/badge/UI-Neobrutalism%20%2F%20shadcn%20base-ffdc58?labelColor=000)](https://neobrutalism.com)
[![SEO](https://img.shields.io/badge/SEO-react--helmet--async%20%7C%20JSON--LD%20%7C%20sitemap-0a0?labelColor=000)](#seo)
[![License](https://img.shields.io/badge/license-MIT-000?labelColor=000)](#license)

---

## Daftar Isi

- [Arsitektur](#arsitektur)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Setup Backend (Laravel)](#setup-backend-laravel)
- [Setup Frontend (Vite + React)](#setup-frontend-vite--react)
- [Environment Variables](#environment-variables)
- [Alur Bisnis — 10 Aturan](#alur-bisnis--10-aturan)
- [API Contract](#api-contract)
- [SEO](#seo)
- [UI — Neon Brutalism](#ui--neon-brutalism)
- [Build, Test & Deploy](#build-test--deploy)
- [Troubleshooting](#troubleshooting)
- [Referensi](#referensi)

---

## Arsitektur

```
Beasiswa-app/
├── backend/   Laravel 12+ API-only  → http://127.0.0.1:8000/api/v1
│   ├── app/Http/Controllers/{BeasiswaController, ScholarshipController}
│   ├── app/Models/{Beasiswa, Scholarship, User}
│   ├── routes/api.php  (prefix v1)
│   └── database/{migrations, seeders}
├── frontend/  Vite 8 + React 19 + Tailwind v4 + TanStack Form/Query
│   ├── src/pages/{Home, BeasiswaCatalog, BeasiswaDetail, Daftar, Peringkat, Login, Register}
│   ├── src/components/seo/{SEO, JsonLd}
│   ├── src/lib/seo.ts  (SITE_URL, canonical)
│   └── public/{robots.txt, sitemap.xml, og-default.png}
├── docs/      PRD + exam brief (Beasiswa-App.md)
└── README.md  (this file)
```

- **Backend:** `laravel new --api` + Breeze API + Sanctum (Bearer). SQLite untuk lokal, Neon Postgres untuk production (`DB_CONNECTION=pgsql`). CORS mengizinkan `FRONTEND_URL` + `localhost:5173`.
- **Frontend:** Scaffold dari template `catering` — `hooks/use-form.ts` factory + 6 `custom-ui/form` fragments dipakai ulang. Semua UI dari registry **Neobrutalism `base`** (`shadcn add https://neobrutalism.com/r/base/<component>.json`), tanpa komponen hand-rolled.
- **API client:** `ky` dengan `prefixUrl: VITE_API_URL` dan inject `Authorization: Bearer` dari `localStorage:pijar:auth`.
- **State:** Zustand (`ipk` store + `auth` persist) + TanStack Form (`useAppForm` + `withGlobalBehaviors()` — error `onSubmit` di-mirror ke `onChange`/`onBlur`, tapi ditampilkan hanya setelah `submissionAttempts>0`).

---

## Fitur

- **Katalog beasiswa** — search + filter `all/academic/non_academic/sports/arts/technology`, paginasi `per_page=6`, `Muat Lebih Banyak`.
- **Detail beasiswa `/beasiswa/:slug`** — hero `color_theme`, syarat `•`-split, dokumen wajib, CTA `scholarship_id` pre-select.
- **Pendaftaran `/daftar`** — form kondisional (lihat 10 aturan di bawah), `ScholarshipPickerDialog` live search, upload `berkas` PDF/ZIP ≤5MB + `photo` JPG/PNG ≤2MB, `status_ajuan` server-injected `belum di verifikasi`.
- **Peringkat `/peringkat`** — podium top-3 `ipk_desc` + tabel paginasi `per_page=5` + search debounced 400ms, GSAP podium yoyo.
- **Auth** — `/login`, `/register`, `/logout`, `GET /user`, `GET /my-beasiswa` (Sanctum).
- **SEO** — `react-helmet-async` per-route, OpenGraph + Twitter, canonical, JSON-LD (`EducationalOrganization`, `CollectionPage`, `EducationalOccupationalProgram`, `BreadcrumbList`, `FAQPage`), `robots.txt` + `sitemap.xml`, `lang="id"`.
- **Aksesibilitas & Motion** — `prefers-reduced-motion` guard di semua GSAP, `next-themes` light-only, `uisfx` minimal soundpack.

---

## Tech Stack

| Layer | Pilihan | Versi |
|---|---|---|
| PHP | 8.3+ (8.4 di host ini) | `^8.3` |
| Laravel | 12+ API | `^12` (skeleton `laravel/laravel` 13.8 di repo ini — backward compat) |
| Breeze | API stack | `^2.3` |
| Sanctum | Bearer | `^4.0` |
| DB | SQLite (lokal) / Neon Postgres (prod) | `database.sqlite` / `DB_CONNECTION=pgsql` |
| Scramble | OpenAPI | `^0.13` |
| Test | Pest + Pint | `^4.7` / `^1.27` |
| Node | 20+ (22 LTS) | — |
| Vite | 8 | `^8.2.2` |
| React | 19 | `^19.2.8` |
| TypeScript | 6 | `~6.0.2` |
| Tailwind | 4 | `^4.3.3` + `@tailwindcss/vite ^4` |
| Router | React Router | `^8.3.1` |
| Forms | TanStack React Form | `^1.33.5` |
| Validasi | Zod | `^4.5.4` |
| Query | TanStack React Query | `^5.102.8` |
| HTTP | Ky | `^2.1.0` |
| Store | Zustand | `^5.0.15` |
| UI | Neobrutalism `base` via `shadcn@latest` | `shadcn@4.15` |
| Fonts | Archivo Black + Space Grotesk | `@fontsource/*` |
| SEO | react-helmet-async | `^3.0.0` |
| Animasi | GSAP 3 + framer-motion 13 | — |
| Toast | Sonner | `^2.0.8` |

Matrix lengkap + resolusi konflik → [`docs/PRD.md §3`](./docs/PRD.md#3-target-package-versions-validated).

---

## Struktur Proyek

```
Beasiswa-app/
├── backend/
│   ├── app/Enums/ScholarshipType.php
│   ├── app/Http/Controllers/BeasiswaController.php
│   ├── app/Http/Controllers/ScholarshipController.php
│   ├── app/Http/Requests/BeasiswaRequest.php
│   ├── app/Http/Resources/{BeasiswaResource, ScholarshipResource}
│   ├── app/Models/{Beasiswa, Scholarship}
│   ├── database/migrations/  # beasiswas, scholarships, user+scholarship FK, unique composite
│   ├── database/seeders/{ScholarshipSeeder, BeasiswaSeeder}
│   ├── routes/api.php
│   └── config/cors.php
├── frontend/
│   ├── index.html  # lang=id, theme-color, OG/Twitter, preconnect, JSON-LD Organization
│   ├── src/index.css  # @theme inline hard shadows, --primary #ffdc58, Archivo Black
│   ├── src/main.tsx  # HelmetProvider + QueryClient + ThemeProvider
│   ├── src/router/index.tsx  # 8 routes + NotFound SEO
│   ├── src/components/seo/{SEO.tsx, JsonLd.tsx}
│   ├── src/lib/seo.ts  # SITE_URL, canonical(), DEFAULT_DESCRIPTION
│   ├── src/pages/*
│   ├── src/features/{beasiswa, scholarship, auth}
│   ├── src/hooks/use-form.ts
│   ├── public/{robots.txt, sitemap.xml, site.webmanifest, og-default.png}
│   └── scripts/generate-sitemap.mjs
└── docs/
    ├── Beasiswa-App.md  # brief LSP Informatika
    ├── PRD.md
    └── uisfx-guide.md
```

---

## Prasyarat

- **PHP** ≥8.3 + **Composer** ≥2.7 + ekstensi `sqlite3` (atau Postgres untuk prod)
- **Node.js** ≥20 (22 LTS direkomendasikan) + **npm** ≥10
- **Git**

Cek versi:

```bash
php -v && composer -V
node -v && npm -v
git --version
```

---

## Setup Backend (Laravel)

```bash
cd backend

# 1. Install deps (vendor di-ignore — harus install)
composer install

# 2. Env — SQLite untuk lokal (paling cepat)
cp .env.example .env
# Edit .env:
#   APP_URL=http://127.0.0.1:8000
#   FRONTEND_URL=http://localhost:5173
#   DB_CONNECTION=sqlite
#   # kosongkan DB_HOST/PORT/DATABASE untuk sqlite, atau set untuk Neon:
#   # DB_CONNECTION=pgsql
#   # DB_HOST=ep-xxxx.neon.tech  DB_PORT=5432  DB_DATABASE=neondb  DB_USERNAME=...  DB_PASSWORD=...

# Untuk SQLite, buat file kosong:
# (Windows) type nul > database\database.sqlite
# (macOS/Linux) touch database/database.sqlite
mkdir -p database && touch database/database.sqlite

# 3. Key + migrate + seed
php artisan key:generate
php artisan migrate --seed
# Seed membuat: 5 scholarships (academic s/d technology) + admin@admin.com / password + demo beasiswa

# 4. (Opsional) storage link untuk photo/berkas
php artisan storage:link

# 5. Serve — bind 0.0.0.0 agar bisa diakses dari LAN (VITE_API_URL pakai IP LAN jika perlu)
php artisan serve --host=0.0.0.0 --port=8000
# atau: php artisan serve --host=127.0.0.1 --port=8000
```

**Akun seed:** `admin@admin.com` / `password` (via `DatabaseSeeder`).

**Verifikasi:**

```bash
curl http://127.0.0.1:8000/api/v1/scholarships | jq
curl "http://127.0.0.1:8000/api/v1/beasiswa?per_page=5" | jq
```

---

## Setup Frontend (Vite + React)

```bash
cd frontend

# 1. Install
npm install

# 2. Env
cp .env.example .env
# Isi:
#   VITE_API_URL=http://127.0.0.1:8000/api/v1   # atau http://192.168.1.4:8000/api/v1 untuk LAN
#   VITE_SITE_URL=https://pijar-beasiswa.example.com  # untuk canonical & sitemap

# 3. Dev
npm run dev
# → http://localhost:5173

# 4. Typecheck & build
npx tsc --noEmit
npm run build
npm run preview  # preview dist/
```

> **Catatan LAN:** Jika frontend diakses dari device lain (HP/tablet) di jaringan yang sama, set `VITE_API_URL` ke `http://<IP-LAN>:8000/api/v1` dan tambahkan IP tersebut di `backend/config/cors.php` → `allowed_origins`.

---

## Environment Variables

### `backend/.env` (ringkas)

```ini
APP_NAME="Beasiswa App"
APP_ENV=local
APP_KEY=base64:...
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173

# Lokal — SQLite
DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database/database.sqlite  # opsional, default database/database.sqlite

# Produksi — Neon Postgres (ganti DB_CONNECTION)
# DB_CONNECTION=pgsql
# DB_HOST=ep-xxxx.neon.tech
# DB_PORT=5432
# DB_DATABASE=neondb
# DB_USERNAME=neondb_owner
# DB_PASSWORD=***
# DB_SSLMODE=require

SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

### `frontend/.env` (ringkas)

```ini
VITE_API_URL=http://127.0.0.1:8000/api/v1
VITE_SITE_URL=https://pijar-beasiswa.example.com
```

`VITE_SITE_URL` dipakai untuk `<link rel="canonical">`, OG `og:url`, dan `sitemap.xml`. Tanpa ini, fallback ke `https://pijar-beasiswa.example.com`.

---

## Alur Bisnis — 10 Aturan

Disarikan dari `docs/Beasiswa-App.md:87-104`:

| # | Field | Aturan |
|---|---|---|
| 1 | `nama` | string 3–100 |
| 2 | `email` | `z.string().email()` |
| 3 | `hp` | digit saja 10–15, `replace(/[^0-9]/g,"")` |
| 4 | `semester` | select 1–8 |
| 5 | `ipk` | konstanta `3.4` (atau `2.9` untuk demo gagal), readOnly, dari `useBeasiswaStore` |
| 6 | `ipk < 3` | `beasiswa`, `berkas`, `submit` **disabled** + `Alert` destructive |
| 7 | `ipk ≥ 3` | autofocus `beasiswa` (ScholarshipPickerDialog) |
| 8 | `berkas` | `pdf/zip` ≤5MB, max 1 file, drag-drop `MediaDropzone` |
| 9 | `photo` | `jpg/png` ≤2MB, max 1 (tambahan lokal — avatar bulat) |
| 10 | `status_ajuan` | server-injected `belum di verifikasi` → `lulus verifikasi` / `ditolak` (cek `/peringkat`) |

```
ipk < 3  ──→  beasiswa disabled / upload disabled / submit disabled
ipk ≥ 3  ──→  beasiswa autofocus ──→ submit enabled
```

Server re-validasi gate (`BeasiswaRequest`) — client hanya UX. Satu `user_id` bisa daftar banyak `scholarship_id` berbeda, tapi **unique composite** `(user_id, scholarship_id)` mencegah duplikat beasiswa yang sama (422 `Anda sudah terdaftar pada beasiswa ini.`).

---

## API Contract

Prefix: `/api/v1` — lihat `backend/routes/api.php`.

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/scholarships?search=&type=&page=&per_page=` | — | List scholarships, `withCount beasiswas`, sort `beasiswas_count desc` |
| `GET` | `/scholarships/{scholarship}` | — | Detail |
| `GET` | `/beasiswa?search=&status=&sort=&per_page=` | — | List beasiswa, filter `nama/email/asal_sekolah like`, `status_ajuan`, sort `ipk_desc` |
| `GET` | `/beasiswa/{beasiswa}` | — | Detail |
| `POST` | `/beasiswa` | `auth:sanctum` | Create (multipart `berkas`+`photo`), dedupe, `status_ajuan` injected |
| `GET` | `/my-beasiswa` | `auth:sanctum` | Punya user login (eager `scholarship`) |
| `POST` | `/register` | — | Breeze |
| `POST` | `/login` | — | Breeze |
| `POST` | `/logout` | `auth:sanctum` | — |
| `GET` | `/user` | `auth:sanctum` | Current user |

OpenAPI via **Scramble**: `GET /docs/api` (jika enabled).

---

## SEO

### Baseline (`index.html`)

- `lang="id"`, `theme-color #ffdc58`, `color-scheme light`, `viewport`, `format-detection`.
- Fallback `<title>`, `<meta name="description">`, `keywords`, `robots`, `canonical`.
- OpenGraph (`og:type, site_name, locale id_ID, title, description, url, image 1200×630`) + Twitter `summary_large_image`.
- `preconnect` fonts, `site.webmanifest`, `apple-touch-icon`.
- JSON-LD `EducationalOrganization` global.

### Dinamis (`react-helmet-async`)

`src/components/seo/SEO.tsx` — wrapper tipis di atas `Helmet`:

```tsx
<SEO title="Katalog Beasiswa — Cari & Filter Program IPK ≥3.0" description="..." path="/beasiswa" />
```

| Route | Title | Path | JSON-LD |
|---|---|---|---|
| `/` | `PIJAR BEASISWA — Platform Beasiswa Kampus IPK ≥3.0` | `/` | `FAQPage` + `WebSite` SearchAction |
| `/beasiswa` | `Katalog Beasiswa — Cari & Filter Program IPK ≥3.0` | `/beasiswa` | `BreadcrumbList` + `CollectionPage` ItemList |
| `/beasiswa/:slug` | `{name} — Beasiswa {type_label}` | `/beasiswa/:slug` | `BreadcrumbList` + `EducationalOccupationalProgram` |
| `/daftar` | `Daftar Beasiswa — Form Pendaftaran IPK ≥3.0` | `/daftar` | `BreadcrumbList` (noindex) |
| `/peringkat` | `Peringkat Juara — Leaderboard IPK Tertinggi` | `/peringkat` | `BreadcrumbList` |
| `/login` | `Masuk — PIJAR BEASISWA` | `/login` | — (noindex) |
| `/register` | `Daftar Akun — PIJAR BEASISWA` | `/register` | — (noindex) |
| `*` | `404 — Halaman Tidak Ditemukan` | `/404` | — (noindex) |

Fallback deskripsi: `DEFAULT_DESCRIPTION` di `src/lib/seo.ts` (≤160 char, dipakai jika prop `description` kosong — tidak pernah crash).

### robots & sitemap

- `public/robots.txt` — `Allow: /`, `Disallow: /daftar /login /register`, `Sitemap: /sitemap.xml`.
- `public/sitemap.xml` — 5 static + 5 slug fallback. Build-time enhancer: `npm run sitemap` (`scripts/generate-sitemap.mjs`) fetch `GET /api/v1/scholarships?per_page=50` untuk harvest slug live; fallback ke seed jika API unreachable.
- `public/site.webmanifest` — `name PIJAR BEASISWA`, `theme_color #ffdc58`, `lang id`.

> **CSR caveat:** Vite SPA tidak pre-render. `react-helmet-async` tetap memperbaiki tab title & social preview saat share setelah hydrate, dan JSON-LD tetap terbaca crawler modern. Untuk index penuh tanpa JS, pertimbangkan prerender (`vite-plugin-prerender`) atau migrasi route SEO-kritis ke `next-app/` (Next 16 sudah ada sebagai scaffold).

---

## UI — Neon Brutalism

Token di `frontend/src/index.css`:

```css
@import "tailwindcss";
@theme inline {
  --shadow: 3px 3px 0 0 var(--border);
  --shadow-md: 4px 4px 0 0 var(--border);
  /* xs/sm/lg/xl/2xl hard offsets, zero blur */
}
:root {
  --radius: 0; --background: #fff7e8; --foreground: #000;
  --primary: #ffdc58; --border: #000;
  --font-head: "Archivo Black"; --font-sans: "Space Grotesk";
}
```

Ciri: `border-4 border-black`, `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`, `rounded-none`, `hover:translate-x-[2px]`, fill loud. Semua komponen via `shadcn add https://neobrutalism.com/r/base/<component>.json` — jangan hand-roll.

Daftar komponen (dari `frontend/`):

```bash
npx shadcn@latest add https://neobrutalism.com/r/base/button.json
npx shadcn@latest add https://neobrutalism.com/r/base/input.json
npx shadcn@latest add https://neobrutalism.com/r/base/label.json
npx shadcn@latest add https://neobrutalism.com/r/base/field.json
npx shadcn@latest add https://neobrutalism.com/r/base/card.json
npx shadcn@latest add https://neobrutalism.com/r/base/select.json
npx shadcn@latest add https://neobrutalism.com/r/base/textarea.json
npx shadcn@latest add https://neobrutalism.com/r/base/alert.json
npx shadcn@latest add https://neobrutalism.com/r/base/badge.json
npx shadcn@latest add https://neobrutalism.com/r/base/separator.json
npx shadcn@latest add https://neobrutalism.com/r/base/spinner.json
npx shadcn@latest add https://neobrutalism.com/r/base/sonner.json
npx shadcn@latest add https://neobrutalism.com/r/base/table.json
npx shadcn@latest add https://neobrutalism.com/r/base/dialog.json
npx shadcn@latest add https://neobrutalism.com/r/base/drawer.json
```

---

## Build, Test & Deploy

```bash
# Frontend — typecheck + build
cd frontend
npx tsc --noEmit          # 0 errors required
npm run build             # tsc -b && vite build → dist/
npm run sitemap           # refresh public/sitemap.xml dari API live (opsional, pre-deploy)
npm run lint              # oxlint

# Backend — test + pint
cd backend
php artisan test          # Pest
./vendor/bin/pint         # format
php artisan migrate:fresh --seed  # reset DB
```

**Deploy — Frontend (Vercel/Netlify/Static):**

1. Set env `VITE_API_URL=https://api.yourdomain.com/api/v1`, `VITE_SITE_URL=https://yourdomain.com`.
2. `npm run sitemap && npm run build` → deploy `dist/` + `public/` assets.
3. Pastikan `robots.txt` & `sitemap.xml` ter-serve di root.

**Deploy — Backend (Laravel Forge/Vapor/Neon):**

1. Set `APP_URL`, `FRONTEND_URL`, `DB_CONNECTION=pgsql` + kredensial Neon.
2. `composer install --no-dev --optimize-autoloader`
3. `php artisan migrate --force && php artisan storage:link`
4. `php artisan config:cache && php artisan route:cache`

---

## Troubleshooting

| Gejala | Penyebab | Fix |
|---|---|---|
| `CORS` error di browser | `FRONTEND_URL` belum include origin | Tambahkan `http://localhost:5173` / IP LAN di `backend/config/cors.php` `allowed_origins` |
| `VITE_API_URL` 404 | Trailing slash / prefix salah | Pastikan `VITE_API_URL` tanpa trailing slash `.../api/v1`, `ky` sudah enforce slash |
| `SQLSTATE no such table` | Migrate belum jalan | `php artisan migrate --seed` |
| `UNIQUE constraint user_id` | Migration lama `unique(user_id)` belum di-fix | `php artisan migrate:fresh --seed` (migration `per_scholarship_unique` sudah correct) |
| `401` saat `POST /beasiswa` | Belum login / token hilang | Login dulu, cek `localStorage:pijar:auth` |
| `IPK < 3` form terkunci tapi tetap submit | Client bypass | Server `BeasiswaRequest` tetap re-validasi — bukan bug |
| `sitemap.xml` kosong slug | API unreachable saat build | `scripts/generate-sitemap.mjs` fallback ke 5 slug seed — tetap valid |

---

## Referensi

- Brief ujian: [`docs/Beasiswa-App.md`](./docs/Beasiswa-App.md)
- PRD lengkap: [`docs/PRD.md`](./docs/PRD.md)
- Panduan suara: [`docs/uisfx-guide.md`](./docs/uisfx-guide.md)
- Benchmark: `C:/Dev/Web/catering` (`hooks/use-form.ts`, `custom-ui/form/*`)
- UI docs: [neobrutalism.com](https://neobrutalism.com) · [Vite](https://neobrutalism.com/docs/installation/vite) · [Components](https://neobrutalism.com/components)

---

*Maintained by PIJAR BEASISWA — KEMDIKBUD RI. PR: `main` ← feature branches. Issues & Discussions di GitHub.*
