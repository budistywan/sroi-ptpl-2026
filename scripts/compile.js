/**
 * SROI PTPL 2026 - Revised Compiler Script
 * Berfungsi untuk menggabungkan semua partial HTML sebelum dirender oleh Paged.js
 */

(async function() {
  const status = (msg, type = "ok") => {
    let el = document.getElementById("compile-status");
    if (!el) {
      el = document.createElement("div");
      el.id = "compile-status";
      document.body.appendChild(el);
    }
    el.className = type === "warn" ? "warn" : "ok";
    el.innerHTML = msg;
  };

  async function fetchText(url) {
    // Tambahkan cache breaker untuk menghindari file lama tersangkut di browser saat update di GitHub
    const r = await fetch(`${url}?t=${new Date().getTime()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`Status ${r.status}: ${url}`);
    return await r.text();
  }

  const mount = document.getElementById("doc");
  if (!mount) {
    status("Error: Elemen #doc tidak ditemukan di compile.html", "warn");
    return;
  }

  try {
    // 1. Ambil Manifest
    status("Membaca manifest...");
    const manifestResponse = await fetch("scripts/manifest.json");
    if (!manifestResponse.ok) throw new Error("File manifest.json tidak ditemukan.");
    const manifest = await manifestResponse.json();

    // 2. Kumpulkan semua konten ke dalam Buffer (Variabel)
    let fullHTML = "";
    let okCount = 0;
    
    status(`Memuat ${manifest.parts.length} bagian laporan...`);

    for (const path of manifest.parts) {
      try {
        const content = await fetchText(path);
        // Membungkus setiap bagian dengan tag section untuk menjaga struktur
        fullHTML += `<section class="report-part" data-source="${path}">${content}</section>`;
        okCount++;
      } catch (e) {
        console.error(`Gagal memuat bagian: ${path}`, e);
        status(`Gagal memuat: ${path}. Pastikan nama file/folder benar.`, "warn");
      }
    }

    // 3. Masukkan semua konten SEKALIGUS ke DOM
    // Ini krusial agar Paged.js tidak memproses dokumen yang setengah jadi
    mount.innerHTML = fullHTML;
    status(`Berhasil memuat ${okCount}/${manifest.parts.length} bagian. Menyiapkan layout buku...`);

    // 4. Jalankan Paged.js
    const runPagedJs = () => {
      if (window.PagedPolyfill && typeof window.PagedPolyfill.preview === "function") {
        window.PagedPolyfill.preview()
          .then(() => {
            status(`Laporan SROI siap! ${okCount} bagian terload. Gunakan Ctrl+P untuk cetak.`);
          })
          .catch(err => {
            status(`Paged.js bermasalah: ${err.message}`, "warn");
          });
      } else {
        status("Paged.js (Polyfill) belum siap. Menunggu...", "warn");
        // Coba lagi dalam 1 detik jika polyfill belum siap
        setTimeout(runPagedJs, 1000);
      }
    };

    // Berikan sedikit jeda agar DOM benar-benar stabil
    setTimeout(runPagedJs, 500);

  } catch (err) {
    status(`Error Fatal: ${err.message}`, "warn");
    console.error(err);
  }
})();
