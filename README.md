# SROI PTPL 2026 — HTML → PDF (Paged.js)

Repo ini **langsung bisa dibuka di browser** (GitHub Pages / lokal) untuk menghasilkan layout PDF memakai **Paged.js**.

## Cara pakai (paling mudah)
1. Buka `compile.html` di browser (Chrome/Edge).
2. Tunggu sampai status di kanan atas berubah menjadi **READY**.
3. `Ctrl/Cmd + P` → Destination: **Save as PDF** → Print.

## GitHub Pages
- Settings → Pages → Deploy from branch → pilih `main` dan root.
- Akses: `https://<username>.github.io/<repo>/compile.html`

## Ganti asset (logo & cover hero)
- Logo: `assets/brand/logo-ptpl.svg`
- Hero cover: `assets/img/cover/cover-hero.svg`

> Kamu boleh mengganti SVG dengan PNG/JPG. Tinggal ganti file-nya (nama sama), atau ubah path di `bab-00-pengantar/00-cover.partial.html`.

## Struktur
- `compile.html` : halaman kompilasi (load semua partial, apply Paged.js)
- `styles/master.css` : master style (modern navy clean)
- `scripts/compile.js` : loader + Paged.js init (anti blank)
- `bab-*/**/*.partial.html` : potongan halaman per bab/subbab
- `assets/` : logo & ilustrasi
