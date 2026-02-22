# SROI PTPL 2026 — Paged.js (Browser → PDF)

## Cara pakai cepat (GitHub Pages)
1. Upload semua file ke repo `sroi-ptpl-2026`.
2. Settings → Pages → Deploy from branch → pilih branch & root.
3. Buka `https://<user>.github.io/<repo>/compile.html`

## Paged.js
- Repo ini memuat `vendor/paged.polyfill.js` sebagai **placeholder**.
- `compile.html` akan mencoba load local dulu, jika tidak ada PagedPolyfill, akan fallback ke CDN.

Jika ingin benar-benar offline:
- overwrite `vendor/paged.polyfill.js` dengan isi `paged.polyfill.js` resmi.

## Asset yang wajib diganti
- `assets/brand/logo-ptpl.png`
- `assets/img/cover/cover-hero.png`

## Output PDF
- Buka `compile.html` → tunggu pagination selesai → Print → Save as PDF.
