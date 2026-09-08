# PIJAR BEASISWA — Backend (Laravel API)

> Laravel API-only untuk platform beasiswa kampus. Melayani katalog `scholarships` (public) + pendaftaran `beasiswa` (authenticated) yang dikonsumsi SPA React/Vite di `../frontend`.

**Monorepo:** root `../README.md` adalah sumber arsitektur & setup lengkap. File ini fokus pada backend saja.

---

## Tech Stack

| Concern | Pilihan |
|---|---|
| Framework | **Laravel 12+** (PHP 8.3+, skeleton 13.8) |
| Auth | **Sanctum 4** Bearer tokens + **Breeze API** |
| Database | **SQLite** lokal (`database/database.sqlite`), **Neon Postgres** production (`DB_CONNECTION=pgsql`) |
| API docs | **Scramble** `^0.13` (OpenAPI) |
| Testing | **Pest 4** |
| Style | **Pint** |

---

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
# SQLite lokal:
#   DB_CONNECTION=sqlite  (buat file database/database.sqlite)
# Neon prod:
#   DB_CONNECTION=pgsql  DB_HOST=ep-xxxx.neon.tech  DB_SSLMODE=require  ...
php artisan migrate --seed     # 5 scholarships + admin@admin.com/password + demo beasiswa
php artisan storage:link       # untuk photo/berkas
php artisan serve --host=0.0.0.0 --port=8000
```

Cek:

```bash
curl http://127.0.0.1:8000/api/v1/scholarships | jq
curl "http://127.0.0.1:8000/api/v1/beasiswa?per_page=5" | jq
```

---

## API Contract

Prefix `api/v1` — lihat `routes/api.php`.

| Method | Path | Auth | Catatan |
|---|---|---|---|
| `GET` | `/scholarships?search=&type=&page=&per_page=` | — | `withCount beasiswas`, sort `beasiswas_count desc` |
| `GET` | `/scholarships/{id}` | — | — |
| `GET` | `/beasiswa?search=&status=&sort=&per_page=` | — | `search` di `nama/email/asal_sekolah`, `sort=ipk_desc` |
| `GET` | `/beasiswa/{id}` | — | — |
| `POST` | `/beasiswa` | `auth:sanctum` | multipart `photo`+`berkas`, unique `(user_id, scholarship_id)` |
| `GET` | `/my-beasiswa` | `auth:sanctum` | milik user login |
| `POST` | `/register`, `/login` | — | Breeze |
| `POST` | `/logout` | `auth:sanctum` | — |
| `GET` | `/user` | `auth:sanctum` | — |

OpenAPI via Scramble: `GET /docs/api` (jika enabled).

---

## Aturan Bisnis (server-enforced)

- `status_ajuan` selalu server-injected `belum di verifikasi` saat create — tidak pernah dari client.
- `scholarship_id` di-resolve dari field `beasiswa` (slug/nama) jika tidak dikirim — 422 jika tetap null.
- Deduplikasi `per user + per scholarship`: `exists(user_id, scholarship_id)` → 422 `Anda sudah terdaftar pada beasiswa ini.` Migrasi `per_scholarship_unique_on_beasiswas` sudah fix constraint dari `unique(user_id)` awal.
- `berkas` → `storage/berkas` (pdf/zip ≤5MB), `photo` → `storage/photos` (jpg/png ≤2MB). Validasi di `BeasiswaRequest`.
- `ipk` 0–4, `semester` 1–8, `hp` regex `^[0-9]+$` 10–15.

---

## Struktur

```
app/
├── Enums/ScholarshipType.php  # academic/non_academic/sports/arts/technology
├── Http/Controllers/{BeasiswaController, ScholarshipController}  # FLAT
├── Http/Requests/BeasiswaRequest.php
├── Http/Resources/{BeasiswaResource, ScholarshipResource}
└── Models/{Beasiswa, Scholarship, User}
database/
├── migrations/  # users, beasiswas, scholarships, user+scholarship FK, per_scholarship_unique, type+catatan
├── factories/{BeasiswaFactory, ScholarshipFactory}
└── seeders/{ScholarshipSeeder (5 types), BeasiswaSeeder, DatabaseSeeder (admin@admin.com)}
routes/{api.php, auth.php}
config/cors.php  # allowed_origins: FRONTEND_URL + localhost:5173 + LAN IP
```

---

## Env Penting

```ini
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173
DB_CONNECTION=sqlite   # atau pgsql untuk Neon
# pgsql: DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_SSLMODE=require
```

---

## Test & Style

```bash
php artisan test            # Pest
./vendor/bin/pint --dirty   # format file yang berubah
./vendor/bin/pint           # format semua
```

---

*Consumer:* SPA di `../frontend` (`src/api/ky.ts` → `VITE_API_URL`). CORS & Sanctum sudah sinkron.
