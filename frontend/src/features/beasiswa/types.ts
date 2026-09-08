export type BeasiswaType = "akademik" | "non_akademik"

export type BeasiswaFormValues = {
  nama: string
  email: string
  hp: string
  semester: string
  ipk: number
  beasiswa: string
  berkas: File | null
}

export type BeasiswaSubmission = {
  id: number
  nama: string
  email: string
  hp: string
  semester: number
  ipk: string | number
  beasiswa: string | null
  scholarship_id: number | null
  scholarship?: { id: number; name: string; slug: string; color_theme: string } | null
  asal_sekolah: string | null
  photo_path: string | null
  photo_url: string | null
  berkas_path: string | null
  berkas_url: string | null
  status_ajuan: string
  created_at: string
}
