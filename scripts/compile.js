/**
 * SROI PTPL 2026 - Stable Compiler Script
 * Memastikan semua partial HTML dimuat sempurna sebelum diproses oleh Paged.js
 */

(async function() {
  // Fungsi untuk menampilkan status di layar
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

  // Fungsi fetch dengan cache-breaker untuk menghindari file lama di GitHub
  async function fetchText(url) {
    const r = await fetch(`${url}?t=${new Date().getTime()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`Gagal muat ${r.status}: ${url}`);
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
    const manifestRaw = await fetchText("scripts/manifest.json");
    const manifest = JSON.parse(manifestRaw);

    // 2. Kumpulkan semua konten dalam variabel String (Buffer)
    // Ini mencegah Paged.js memproses dokumen yang belum lengkap
    let allContent = "";
    let okCount = 0;
    
    status(`Memuat ${manifest.parts.length} bagian laporan...`);

    for (const path of manifest.parts) {
      try {
        const content = await fetchText(path);
        // Membungkus setiap bagian dengan class report-part untuk menjaga struktur CSS
        allContent += `<div class="report-part" data-source="${path}">${content}</div>`;
        okCount++;
      } catch (e) {
        console.error(`Gagal muat: ${path}`, e);
        status(`Gagal muat: ${path}`, "warn");
      }
    }

    // 3. Masukkan semua konten SEKALIGUS ke DOM
    mount.innerHTML = allContent;
    status(`Berhasil muat ${okCount}/${manifest.parts.length} bagian. Menyiapkan layout buku...`);

    // 4. Jalankan Paged.js secara aman
    const runPagedJs = () => {
      if (window.PagedPolyfill && typeof window.PagedPolyfill.preview === "function") {
        window.PagedPolyfill.preview()
          .then(() => {
            status(`Laporan SROI siap! ${okCount} bagian terload. Gunakan Ctrl+P untuk PDF.`);
          })
          .catch(err => {
            console.error("Paged.js Error:", err);
            status("Paged.js gagal memproses halaman. Cek struktur HTML.", "warn");
          });
      } else {
        // Jika polyfill belum siap, tunggu sebentar lalu coba lagi
        setTimeout(runPagedJs, 500);
      }
    };

    // Berikan jeda agar browser selesai merender HTML mentah sebelum diproses Paged.js
    setTimeout(runPagedJs, 1000);

  } catch (err) {
    status(`Error Fatal: ${err.message}`, "warn");
    console.error(err);
  }
})();
