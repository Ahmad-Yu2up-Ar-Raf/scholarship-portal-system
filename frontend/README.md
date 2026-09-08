# PIJAR BEASISWA — Frontend (Vite + React)

> SPA React 19 + Vite 8 + Tailwind v4 + TanStack Form/Query, UI **Neon Brutalism** (`base` registry), SEO `react-helmet-async` + JSON-LD. Konsumsi API Laravel di `../backend`.

**Root docs:** `../README.md` adalah panduan setup monorepo lengkap. File ini fokus pada frontend saja.

---

## Setup

```bash
npm install
cp .env.example .env
# VITE_API_URL=http://127.0.0.1:8000/api/v1
# VITE_SITE_URL=https://pijar-beasiswa.example.com
npm run dev      # http://localhost:5173
npx tsc --noEmit # typecheck — 0 errors required
npm run build    # tsc -b && vite build → dist/
npm run sitemap  # refresh public/sitemap.xml dari API live (opsional)
```

Lihat `../README.md` untuk catantan LAN (`192.168.1.4`) & CORS.

---

## Routing

`src/router/index.tsx` — `createBrowserRouter` + `AppLayout` (sticky Header, sound, PageTransition):

| Path | Page | SEO |
|---|---|---|
| `/` | `Home` | `FAQPage` + `WebSite` SearchAction |
| `/beasiswa` | `BeasiswaCatalog` | `CollectionPage` ItemList |
| `/beasiswa/:slug` | `BeasiswaDetail` | `EducationalOccupationalProgram` |
| `/daftar` | `Daftar` (ProtectedRoute) | noindex + Breadcrumb |
| `/peringkat` | `Peringkat` leaderboard | Breadcrumb |
| `/login`, `/register` | `Login`, `Register` | noindex |
| `/hasil` | `Hasil` → redirect `/peringkat` | noindex |
| `*` | `NotFound` | noindex |

---

## SEO

- `index.html` — `lang="id"`, `theme-color #ffdc58`, OG + Twitter, `site.webmanifest`, JSON-LD `EducationalOrganization`.
- `src/lib/seo.ts` — `SITE_URL` (dari `VITE_SITE_URL`), `canonical()`, `DEFAULT_DESCRIPTION`.
- `src/components/seo/SEO.tsx` — wrapper `Helmet` (title, description, canonical, OG/Twitter, robots).
- `src/components/seo/JsonLd.tsx` — `JsonLd`, `breadcrumbJsonLd`, `scholarshipJsonLd`, `faqJsonLd`, `collectionJsonLd`.
- `public/robots.txt` + `public/sitemap.xml` + `scripts/generate-sitemap.mjs`.

---

## UI — Neon Brutalism

Token di `src/index.css` (`@theme inline` hard shadows, `--primary #ffdc58`, `Archivo Black` + `Space Grotesk`).

Semua komponen dari `shadcn add https://neobrutalism.com/r/base/<component>.json` — jangan hand-roll. Lihat `../README.md` untuk daftar lengkap `npx shadcn add ...`.

`src/hooks/use-form.ts` + `src/components/ui/fragments/custom-ui/form/*` dipakai ulang dari template catering — `withGlobalBehaviors()` mirror error `onSubmit` ke `onChange`/`onBlur`.

---

## Env

```ini
VITE_API_URL=http://127.0.0.1:8000/api/v1
VITE_SITE_URL=https://pijar-beasiswa.example.com
```

---

## Build & Lint

```bash
npx tsc --noEmit
npm run build
npm run lint   # oxlint
npm run preview
```

*API client:* `src/api/ky.ts` — `ky` dengan `prefixUrl VITE_API_URL`, inject `Bearer` dari `localStorage:pijar:auth`.
