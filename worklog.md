# Worklog — Hennifral Portfolio Website

---
Task ID: portfolio-build-001
Agent: main (orchestrator)
Task: Membangun website portofolio profesional single-page untuk Hennifral (Staff Administrasi & Manajemen Data) sesuai PRD yang diberikan pengguna.

Work Log:
- Memuat `fullstack-dev` skill dan menginisialisasi project Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui.
- Memuat `image-generation` skill dan meng-generate foto profil profesional (864x1152, pria Indonesia formal) ke `/public/profile/hennifral.png`.
- Menerapkan tema warna navy blue + light gray + white di `src/app/globals.css` (light & dark mode, custom scrollbar, grid background pattern, smooth scroll behavior).
- Update `src/app/layout.tsx` dengan font Inter, metadata SEO lengkap (title, description, keywords, OpenGraph, Twitter card, robots), `ThemeProvider` dari next-themes.
- Membuat file data terpusat `src/lib/portfolio-data.ts` berisi profil, pendidikan, pengalaman kerja (PT Shopee SPX Express, PT Paragon Technology & Innovation), sertifikasi BNSP/YEC, skill groups, contact channels, tech stack, stats, dan focus areas.
- Membuat komponen modular di `src/components/portfolio/`:
  - `theme-provider.tsx` (wrapper next-themes)
  - `navbar.tsx` (sticky nav + smooth scroll + active section highlight + theme toggle + mobile hamburger menu)
  - `section-heading.tsx` (shared heading dengan animasi framer-motion)
  - `hero-section.tsx` (foto profil, headline, CTA download CV + WhatsApp, stats grid)
  - `about-section.tsx` (ringkasan profesional, pendidikan UIN Imam Bonjol Padang, 4 focus areas)
  - `experience-section.tsx` (timeline pengalaman kerja + card sertifikasi BNSP/YEC)
  - `skills-section.tsx` (2 skill groups dengan animated progress bars + tech stack chips)
  - `contact-section.tsx` (WhatsApp CTA banner + grid 4 contact channels)
  - `footer.tsx` (brand info, quick nav, back-to-top)
- Meng-update `src/app/page.tsx` untuk merangkai semua section dalam single-page layout dengan sticky footer.
- Update `next.config.ts` dengan `allowedDevOrigins` untuk domain preview sandbox.
- Generate CV PDF placeholder ATS-friendly menggunakan ReportLab via `scripts/generate_cv.py` → `/public/cv/hennifral-cv.pdf`.
- Verifikasi `bun run lint` — 0 errors.
- Verifikasi via Agent Browser:
  - Page renders tanpa console error
  - Smooth scroll navigation berfungsi (Beranda/Tentang/Pengalaman/Keahlian/Kontak)
  - Theme toggle dark/light berfungsi
  - Mobile hamburger menu berfungsi
  - CV PDF & profile photo URLs return 200 OK
  - Semua 5 section (Beranda, Tentang, Pengalaman, Keahlian, Kontak) ter-render di DOM

Stage Summary:
- Deliverable: Website portofolio single-page Next.js yang siap deploy ke Vercel/GitHub Pages.
- Stack: Next.js 16 (App Router, Turbopack), TypeScript 5, Tailwind CSS 4, shadcn/ui (New York), Lucide icons, Framer Motion, next-themes (dark/light mode).
- Tema visual: Minimalis, navy blue (#0F2A4A oklch equivalent) + abu-abu terang + putih, sesuai PRD.
- Struktur 5 section sesuai PRD: Beranda (Hero), Tentang Saya (About), Pengalaman & Sertifikasi, Keahlian & Teknologi, Kontak & Footer.
- Aset yang dihasilkan: 1 foto profil AI-generated, 1 CV PDF placeholder, 3 screenshot verifikasi (desktop full, dark mode, mobile full).
- Catatan: Semua data personal (nomor WhatsApp, email, LinkedIn URL) adalah placeholder dan perlu diganti pengguna dengan data asli di `src/lib/portfolio-data.ts`.

---
Task ID: admin-panel-002
Agent: main (orchestrator)
Task: Membangun panel admin (Cara 3) supaya user bisa edit teks, foto, dan CV portofolio lewat UI tanpa menyentuh kode.

Work Log:
- Update Prisma schema dengan 2 model baru: SiteContent (single-row JSON blob untuk semua konten) + AdminSession (token sesi login). Jalankan `bun run db:push`.
- Buat `src/lib/portfolio-data-fallback.ts` — versi plain (no JSX) dari semua data portofolio + TypeScript types, supaya bisa di-JSON-serialize ke DB.
- Buat `src/lib/content-store.ts` — fungsi getContent/saveContent/getPhotoPath/setPhotoPath/getCvPath/setCvPath dengan fallback otomatis ke static data jika DB kosong/error. Auto-seed pada first run.
- Buat `src/lib/auth.ts` — simple password auth: password dari env ADMIN_PASSWORD (default admin123), session token random 32-byte hex disimpan di DB dengan TTL 7 hari, httpOnly cookie.
- Buat `src/components/portfolio/icon-registry.tsx` — map IconKey (string) → Lucide component, plus komponen <DynIcon name="..." /> untuk satisfy react-hooks/static-components lint rule.
- Buat 7 API routes: GET /api/portfolio (public), POST /api/admin/login, POST /api/admin/logout, GET /api/admin/session, PUT /api/admin/content (auth), POST /api/admin/upload-photo (auth, file image), POST /api/admin/upload-cv (auth, PDF), POST /api/admin/reset (auth).
- Buat komponen admin UI:
  - `login-modal.tsx` — modal login dengan password field, error display, hint password default
  - `fields.tsx` — reusable form fields: Field (text/textarea), NumberField (slider+input), StringListEditor (list of strings), IconPicker (dropdown icon)
  - `admin-dashboard.tsx` — dashboard full-screen dengan 8 tabs (Profil, Foto & CV, Pendidikan, Pengalaman, Sertifikasi, Keahlian, Kontak, Lainnya), tombol Simpan/Reset/Logout/Preview, dirty state tracking, deep clone untuk edit, status bar upload
  - `admin-gate.tsx` — orchestrator yang check ?admin=1 di URL, cek session, render LoginModal atau AdminDashboard
- Refactor 5 komponen portfolio (hero, about, experience, skills, contact, footer) untuk accept data sebagai props (bukan import langsung dari portfolio-data), pakai <DynIcon> daripada getIcon untuk lint compliance.
- Update `src/app/page.tsx` jadi server component async yang fetch content dari DB server-side, pass ke komponen + AdminGate.
- Update `src/components/portfolio/navbar.tsx` — tambah tombol gear "Admin" di navbar desktop, hardcode "Hennifral" untuk nama (karena data sekarang dinamis dari DB).
- Update `.env` dengan ADMIN_PASSWORD=admin123.
- Verifikasi via Agent Browser:
  - Buka `/?admin=1` → login modal muncul
  - Login dengan password `admin123` → dashboard muncul dengan 8 tabs
  - Edit nama "Hennifral" → "Hennifral Edited" → klik Simpan → status "Tersimpan!" muncul
  - Reload halaman publik → nama berubah ke "Hennifral Edited", link WhatsApp juga auto-update
  - Upload foto baru → path berubah dari hennifral.png → hennifral-<timestamp>.png
  - Klik Reset → confirm dialog → data kembali ke default
- Lint: 0 errors, 1 warning (unused eslint-disable comment, tidak menggangu fungsi).

Stage Summary:
- Fitur admin panel lengkap dan terverifikasi berfungsi end-to-end.
- Akses: buka `/?admin=1` (atau klik tombol gear di navbar desktop) → login dengan password `admin123` → dashboard edit.
- Yang bisa diedit via UI: Profil (nama, title, tagline, lokasi, summary), Foto Profil (upload PNG/JPEG/WebP/AVIF max 5MB), CV PDF (upload max 10MB), Pendidikan (CRUD), Pengalaman Kerja (CRUD + highlights bullet points), Sertifikasi (CRUD), Keahlian (CRUD + skill levels slider), Channel Kontak (CRUD), Statistik, Tech Stack, Focus Areas.
- Data disimpan di SQLite (`/home/z/my-project/db/custom.db`) lewat Prisma. Untuk deploy ke Vercel, ganti DATABASE_URL ke Postgres dan jalankan `bun run db:push`.
- Password default `admin123` — UBAH via env `ADMIN_PASSWORD` sebelum production!
- Tombol Reset mengembalikan content JSON ke default (tidak menghapus file foto/CV yang sudah di-upload).

---
Task ID: projects-section-003
Agent: main (orchestrator)
Task: Tambah section "Proyek & Implementasi" untuk menampilkan project Data Studio, Google Apps Script, Website, dan kategori lain. Bisa di-CRUD lewat admin panel.

Work Log:
- Update `src/lib/portfolio-data-fallback.ts`:
  - Tambah type `ProjectCategory = "Data Studio" | "Google Apps Script" | "Website" | "Lainnya"`
  - Tambah type `ProjectItem` (title, category, shortDescription, description, period, techStack[], demoUrl?, repoUrl?, thumbnailUrl?, featured, icon)
  - Extend `PortfolioContent` dengan field `projects: ProjectItem[]`
  - Tambah 3 project contoh ke fallback: Dashboard Operasional Gudang (Data Studio, featured), Auto-Report Harian (Google Apps Script, featured), Website Portofolio (Website, tidak featured)
- Update `src/lib/content-store.ts`: tambah `projects` ke `mergeWithFallback()` supaya schema-evolution safe.
- Buat `src/components/portfolio/projects-section.tsx`:
  - Section dengan SectionHeading + grid 2 kolom project cards
  - Filter chips by kategori (Semua / Data Studio / Google Apps Script / Website / Lainnya) dengan counter
  - Card: gradient header (atau thumbnail), badge Featured (kuning) + badge kategori (warna sesuai kategori), period, title, short desc, full desc, tech stack chips, tombol "Lihat Demo" + "Source"
  - Animasi framer-motion fade-in on scroll, hover lift effect
  - Empty state kalau tidak ada project di kategori
- Update `src/lib/portfolio-data.ts`: tambah "Proyek" → "#proyek" di navLinks (urutan antara Pengalaman dan Keahlian)
- Update `src/app/page.tsx`: render `<ProjectsSection projects={content.projects} />` setelah ExperienceSection
- Update `src/components/portfolio/admin/admin-dashboard.tsx`:
  - Import icon `FolderGit2` dan `Star`, type `ProjectItem` + `ProjectCategory`
  - Tambah tab `<TabsTrigger value="projects">` dengan icon FolderGit2
  - Tambah `<TabsContent value="projects">` dengan CRUD lengkap: Tambah Proyek button, project card editor (title, period, category dropdown, icon picker, shortDescription, description multiline, techStack via StringListEditor, demoUrl, repoUrl, thumbnailUrl, featured checkbox)
- Verifikasi via Agent Browser:
  - Section #proyek rendered dengan 3 project cards di halaman publik
  - Nav "Proyek" muncul di navbar
  - Filter chips berfungsi: klik "Data Studio" → 1 card visible, klik "Semua" → 3 cards
  - Admin tab "Proyek" berfungsi: 3 project cards terload dari DB
  - Tambah project baru via admin → klik "Simpan" → reload halaman publik → 4 cards muncul
  - Reset → kembali ke 3 default
  - 0 console errors, 0 lint errors

Stage Summary:
- Section "Proyek & Implementasi" lengkap dengan 3 project contoh (Looker Studio Dashboard, Auto-Report Apps Script, Website Portofolio).
- Filter interaktif by kategori dengan counter badge.
- Project cards responsive: gradient header dengan icon center + featured badge + category badge.
- Admin tab "Proyek" support CRUD lengkap: tambah/edit/hapus project, edit tech stack list, set featured, set demo/source URL.
- Lint: 0 errors, 0 warnings.
- Setiap perubahan via admin langsung tersimpan ke DB dan muncul di halaman publik (auto-persist).

---
Task ID: backup-restore-004
Agent: main (orchestrator)
Task: Pastikan data yang user edit via admin panel tersimpan permanen + tambahkan fitur backup/restore JSON supaya user punya kontrol penuh atas datanya.

Work Log:
- Verifikasi database persistence:
  - Database file: /home/z/my-project/db/custom.db (64 KB, mtime: 2026-10-27T09:49)
  - SiteContent row exists dengan data lengkap: profile (Hennifral), 2 experiences, 1 certification, 1 education, 2 skill groups, 3 projects, 4 contact channels, 4 stats, 8 tech stack, 4 focus areas
  - Photo path: /profile/hennifral-1793091410316.jpeg (foto yang user upload)
  - CV path: /cv/hennifral-cv-1793091423210.pdf (CV yang user upload)
  - Updated at: 2026-10-27T09:49:00.423Z
  - 2 admin sessions active (TTL 7 hari)
- Buat script verifikasi: /home/z/my-project/scripts/verify-db.js (cetak status DB)
- Buat 2 API routes baru:
  - GET /api/admin/export (auth required) — download JSON file portfolio-backup-YYYY-MM-DD.json
  - POST /api/admin/import (auth required) — overwrite DB content dengan payload JSON, dengan validasi struktur + merge fallback supaya schema-evolution safe
- Update /home/z/my-project/eslint.config.mjs — exclude folder scripts/ dari lint (sebagai Node.js scripts, bukan React)
- Update /home/z/my-project/src/components/portfolio/admin/admin-dashboard.tsx:
  - Tambah import icon Download + Upload (alias UploadIcon)
  - Tambah state backupBusy + importFileInput ref
  - Tambah handler handleExport (fetch /api/admin/export → trigger browser download)
  - Tambah handler handleImportClick (trigger file picker) + handleImportFile (parse JSON → POST /api/admin/import → refresh content dari server)
  - Tambah 2 tombol di header admin (sebelum Reset): Backup (download icon) + Restore (upload icon)
  - Tambah hidden <input type="file" accept="application/json">
- Buat script auto-backup: /home/z/my-project/scripts/auto-backup.js — snapshot DB ke file JSON di /home/z/my-project/backups/ dengan retention 30 backup terbaru. Bisa di-schedule via cron.
- Jalankan auto-backup pertama: /home/z/my-project/backups/portfolio-2026-10-27-10-11-32.json (11.7 KB)
- Verifikasi via Agent Browser + curl:
  - Backup button muncul di header admin
  - Restore button muncul di header admin
  - GET /api/admin/export dengan session cookie → 200 OK, file JSON 11979 bytes terdownload
  - POST /api/admin/import dengan modified backup → 200 OK, data di DB berubah (name → "Test Restore Name", email → "test-restore@example.com")
  - GET /api/portfolio setelah import → konfirmasi perubahan tersimpan
  - Restore file backup asli → data kembali ke "Hennifral" / "hennifral@gmail.com"
  - Upload via UI: file JSON di-upload lewat hidden file input → handler handleImportFile memproses dan refresh content
  - Tidak ada console error
- Lint: 0 errors, 0 warnings.

Stage Summary:
- ✅ Data admin TERSIMPAN PERMANEN di SQLite (/home/z/my-project/db/custom.db), tidak hilang saat Z.ai ditutup.
- ✅ 3 lapis perlindungan data:
  1. Auto-save ke DB (sudah ada dari task sebelumnya) — setiap klik "Simpan" langsung tulis ke DB
  2. Manual backup via UI (tombol "Backup" di header admin) — download JSON ke komputer user
  3. Auto-backup script (scripts/auto-backup.js) — snapshot harian ke folder /backups/ (jika di-cron)
- ✅ Restore: 2 cara — klik "Restore" di admin UI → pilih file JSON, ATAU POST ke /api/admin/import dengan payload JSON
- ✅ Backup JSON berisi: version, exportedAt, photoPath, cvPath, content (semua data terstruktur)

---
Task ID: project-media-upload-005
Agent: main (orchestrator)
Task: Tambah fitur upload foto DAN video untuk setiap proyek di tab Proyek admin (sebelumnya hanya input URL text).

Work Log:
- Update `src/lib/portfolio-data-fallback.ts`:
  - Tambah field `mediaType?: "image" | "video"` ke type ProjectItem
  - Tambah mediaType: "image" ke 3 project contoh di fallback (untuk backward compat)
- Buat endpoint API baru: `src/app/api/admin/upload-project-media/route.ts`:
  - POST multipart form dengan field "file"
  - Validasi MIME type: image (PNG/JPEG/WebP/AVIF/GIF, max 5 MB) atau video (MP4/WebM/OGG, max 50 MB)
  - Save ke `/public/projects/project-<timestamp>.<ext>`
  - Return JSON: { ok, path, mediaType: "image"|"video", size, filename }
  - Auth required (cookie session)
- Buat komponen baru `src/components/portfolio/admin/project-media-uploader.tsx`:
  - Reusable uploader dengan preview yang berbeda untuk image vs video
  - Tombol "Upload File" trigger hidden file input
  - Tombol "Buka URL" untuk preview file yang sudah diupload
  - Tombol X di pojok kanan preview untuk clear media
  - Badge "Image" atau "Video" di pojok kanan atas preview
  - Text input untuk URL manual (untuk gambar/video eksternal)
  - Loading state "Mengunggah…" dengan spinner
  - Error display jika upload gagal
  - Accept attribute: image/png, image/jpeg, image/webp, image/avif, image/gif, video/mp4, video/webm, video/ogg
- Update `src/components/portfolio/admin/admin-dashboard.tsx`:
  - Import ProjectMediaUploader
  - Ganti Field "URL Thumbnail (opsional)" lama dengan komponen <ProjectMediaUploader>
  - Props: thumbnailUrl, mediaType, projectIndex, onUrlChange, onUploaded (path + mediaType), onClear
  - onUrlChange: update thumbnailUrl + reset mediaType kalau URL kosong
  - onUploaded: set thumbnailUrl + mediaType sesuai response API
  - onClear: reset thumbnailUrl + mediaType
- Update `src/components/portfolio/projects-section.tsx`:
  - Render logic untuk thumbnail jadi 3-cabang:
    1. thumbnailUrl + mediaType="video" → render <video controls muted loop playsInline>
    2. thumbnailUrl + (mediaType="image" atau undefined) → render <img>
    3. tidak ada thumbnailUrl → render gradient + icon (default)
- Verifikasi via Agent Browser:
  - GET /api/admin/upload-project-media dengan session cookie, upload PNG 3.6KB → 200 OK, file tersimpan
  - Upload video MP4 10.9KB via UI admin → path berubah, save → tersimpan ke DB
  - Reload halaman publik → <video> element terender di card pertama dengan src yang benar
  - Konfirmasi: 1 video element, 0 image element (gambar diganti video)
  - Reset → data kembali ke 3 project default (gradient + icon, tanpa thumbnail)
  - Tidak ada console error
- Lint: 0 errors, 0 warnings.

Stage Summary:
- Tab "Proyek" sekarang mendukung upload FOTO dan VIDEO langsung dari komputer (selain URL manual).
- File disimpan di /public/projects/ (bisa langsung diakses publik).
- Preview berbeda: gambar pakai <img>, video pakai <video controls muted loop>.
- 3 cara pakai: upload file (auto-detect MIME), tempel URL eksternal, atau biarkan kosong (pakai gradient + icon default).
- Limit: image max 5 MB, video max 50 MB. Format didukung: PNG/JPEG/WebP/AVIF/GIF, MP4/WebM/OGG.
- Semua perubahan tersimpan permanen ke DB + bisa di-backup via tombol Backup.

---
Task ID: simplify-profile-form-006
Agent: main (orchestrator)
Task: Hapus 3 field dari form admin Profil (Tagline, Job Title/Jabatan, Fokus Pesan) + fix typo "Domicili" → "Domisili".

Work Log:
- Update `src/components/portfolio/admin/admin-dashboard.tsx`:
  - Hapus Field "Job Title / Jabatan" (profile.title) dari grid Profil
  - Hapus Field "Tagline (singkat, di bawah nama)" (profile.tagline)
  - Hapus Field "Fokus Pesan (1 kalimat)" (profile.shortPitch)
  - Fix label "Lokasi Domicili" → "Lokasi Domisili"
  - Field-field yang dihapus tetap dipertahankan di type Profile (untuk backward compat dengan DB + dipakai di footer/metadata/nameplate foto)
- Update `src/components/portfolio/hero-section.tsx`:
  - Hapus rendering paragraph `{profile.title}` (sub-judul di bawah nama)
  - Hapus rendering paragraph `{profile.tagline}` (deskripsi singkat)
  - Hero sekarang lebih bersih: hanya badge "Tersedia" → "Halo, saya" → nama (h1) → CTA tombol → lokasi → stats
  - Catatan: floating nameplate di foto profil tetap menampilkan profile.title (untuk identitas)
- Update `src/components/portfolio/about-section.tsx`:
  - Hapus "Fokus Pesan" box (border bg-secondary dengan profile.shortPitch)
  - About section sekarang hanya: Ringkasan Profesional + Pendidikan
- Update `src/lib/portfolio-data-fallback.ts`:
  - Fix typo di contactChannels: "Lokasi Domicili" → "Lokasi Domisili"
- Buat script migration `scripts/fix-typo-domicili.js`:
  - Update DB existing data tanpa reset
  - Scan semua field string di profile + contactChannels
  - Replace "Domicili" → "Domisili" (1 perubahan ditemukan di label contact channel "Lokasi")
  - Safe to run multiple times (idempotent)
- Jalankan migration: berhasil fix 1 field di DB existing
- Verifikasi via Agent Browser:
  - Hero section: name "Hennifral" masih tampil (h1), title dan tagline sudah hilang dari main text column (nameplate foto masih tampil title)
  - About section: "Fokus Pesan" box removed, "Ringkasan Profesional" dan "Pendidikan" tetap ada
  - Admin form Profil: 3 field hilang (Tagline, Job Title, Fokus Pesan), label "Lokasi Domisili" benar
  - Halaman publik: "Domicili" typo FIXED di seluruh body
  - Contact section: label "Lokasi Domisili" tampil benar
  - 0 console errors, lint: 0 errors 0 warnings

Stage Summary:
- Form admin Profil sekarang lebih simpel: hanya Nama Lengkap, Lokasi Domisili, dan Ringkasan Profesional (3 field, sebelumnya 6).
- Hero section lebih bersih: tidak ada lagi sub-judul "Staff Administrasi..." dan tagline di bawah nama.
- About section: "Fokus Pesan" box dihapus, hanya tinggal Ringkasan Profesional + Pendidikan.
- Typo "Domicili" → "Domisili" diperbaiki di: form admin label, fallback data, DAN DB existing (via migration script).
- Field profile.title, profile.tagline, profile.shortPitch tetap di type Profile untuk backward compat (dipakai di nameplate foto, footer, dan metadata SEO).

---
Task ID: cert-photo-upload-007
Agent: main (orchestrator)
Task: Tambah fitur upload foto untuk sertifikasi & pelatihan (sebelumnya hanya project yang punya uploader media).

Work Log:
- Update `src/lib/portfolio-data-fallback.ts`:
  - Tambah field `photoUrl?: string` dan `photoType?: "image" | "video"` ke type CertificationItem
  - Field opsional supaya backward compat dengan data DB existing (yang tidak punya field ini)
- Rename `src/components/portfolio/admin/project-media-uploader.tsx` → `media-uploader.tsx`:
  - Rename komponen `ProjectMediaUploader` → `MediaUploader` (sekarang reusable, dipakai untuk project + cert)
  - Rename prop `projectIndex: number` → `itemKey: string` (lebih fleksibel, bisa "project-0" atau "cert-1")
  - Rename type `ProjectMediaUploaderProps` → `MediaUploaderProps`
  - Update docstring untuk mention konteks pemakaian (project + cert)
- Update `src/components/portfolio/admin/admin-dashboard.tsx`:
  - Update import: `ProjectMediaUploader` → `MediaUploader` (dari `./media-uploader`)
  - Update tab Proyek: ganti prop `projectIndex={i}` → `itemKey={`project-${i}`}`
  - Tambah MediaUploader di tab Sertifikasi (setelah Field Deskripsi, sebelum `</Card>`):
    - Props: thumbnailUrl=cert.photoUrl, mediaType=cert.photoType, itemKey={`cert-${i}`}
    - onUrlChange: set photoUrl, reset photoType kalau URL kosong
    - onUploaded: set photoUrl + photoType sesuai response API
    - onClear: reset photoUrl + photoType
- Update `src/components/portfolio/experience-section.tsx` (di dalam certification card):
  - Tambah block kondisional setelah paragraf deskripsi:
    - Jika cert.photoUrl + cert.photoType="video" → render <video controls muted playsInline> di dalam border card
    - Jika cert.photoUrl + (photoType="image" atau undefined) → render <a> yang wrap <img> + label "Foto Sertifikat" + hint "Buka full →" saat hover
    - Jika tidak ada photoUrl → tidak render apa-apa (card tetap seperti semula)
  - Image/video punya aspect-video, max-width 28rem (448px), klik untuk buka full di tab baru
  - Hover effect: border primary + shadow + scale 1.05
- Verifikasi via Agent Browser:
  - Tab Sertifikasi: 1 uploader muncul per cert card (untuk cert existing YEC/BNSP)
  - Upload dummy sertifikat PNG (9.6KB, 800x600) → file tersimpan ke /projects/project-<timestamp>.png
  - Admin preview: img src terupdate dengan path baru
  - Klik Simpan → "Tersimpan!" status muncul
  - Reload halaman publik → 1 image dengan alt "Foto sertifikat Pelatihan Administrasi Perkantoran" terender di section Pengalaman
  - Hover effect: border, shadow, scale, hint "Buka full →" muncul
  - Reset → foto sertifikat hilang dari halaman publik (count: 0)
  - 0 console errors, lint: 0 errors 0 warnings

Stage Summary:
- Tab "Sertifikasi" sekarang support upload FOTO (dan VIDEO opsional) untuk setiap sertifikat.
- Reuse komponen MediaUploader yang sama dengan tab Proyek — UI konsisten.
- Tampilan publik: foto tampil di bawah deskripsi sertifikat, aspect-video 16:9, max-width 448px, klik untuk buka full.
- Format didukung: PNG/JPEG/WebP/GIF (max 5MB), MP4/WebM (max 50MB).
- File tersimpan di /public/projects/ (folder yang sama dengan thumbnail proyek — bisa dipakai bareng).
- Backward compatible: sertifikat existing tanpa photoUrl tetap tampil normal (tidak ada foto block).
