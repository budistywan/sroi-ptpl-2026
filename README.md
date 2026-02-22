# SROI PTPL 2026 — HTML → PDF (Paged.js)

**Tujuan:** menyusun dokumen panjang dalam HTML (per bab/subbab) lalu dipaginasi otomatis dengan **Paged.js**.

## Cara pakai (paling gampang)
1. Buka `compile.html` di browser.
2. Tunggu status “Paged.js selesai”.
3. Print → Save as PDF.

## Polyfill (Paged.js)
`compile.html` sudah menyertakan:
- `https://unpkg.com/pagedjs/dist/paged.polyfill.js`

Jadi **tidak perlu kamu upload polyfill manual**.

## Struktur
- `compile.html` : entry
- `scripts/manifest.json` : urutan partial yang di-load
- `scripts/compile.js` : loader + trigger Paged
- `styles/master.css` : style PDF-first
- `bab-xx-*/*.partial.html` : konten per bab/subbab
- `assets/` : logo + hero cover
