/**
 * SROI PTPL 2026 - Stable Compiler
 * Dirancang untuk memuat 90+ file secara aman tanpa blank screen.
 */

(async function() {
  const DELAY_RENDER = 2000; // Jeda 2 detik agar browser tenang
  
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
    // Cache buster agar update di GitHub langsung terlihat
    const r = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`404: ${url}`);
    return await r.text();
  }

  const mount = document.getElementById("doc");

  try {
    status("Memulai sinkronisasi manifest...");
    const manifestRes = await fetch("scripts/manifest.json?t=" + Date.now());
    const manifest = await manifestRes.json();
    
    let htmlBuffer = "";
    let okCount = 0;

    status(`Mendownload ${manifest.parts.length} bagian laporan...`);

    // Proses download serial (antre) agar tidak membebani network
    for (const path of manifest.parts) {
      try {
        const content = await fetchText(path);
        // Bungkus per file untuk isolasi error
        htmlBuffer += `<div class="report-part-wrapper" data-path="${path}">${content}</div>`;
        okCount++;
        
        if (okCount % 10 === 0) status(`Proses: ${okCount}/${manifest.parts.length} file...`);
      } catch (e) {
        console.error("Gagal muat part:", path);
      }
    }

    // Suntikkan semua HTML sekaligus ke DOM
    mount.innerHTML = htmlBuffer;
    status(`Berhasil muat ${okCount} file. Menunggu stabilitas browser...`);

    // Fungsi menjalankan Paged.js
    const startPagination = () => {
      if (window.PagedPolyfill && typeof window.PagedPolyfill.preview === "function") {
        status("Menjalankan Paged.js Engine (Proses potong halaman)...");
        window.PagedPolyfill.preview()
          .then(() => {
            status(`Laporan SROI Selesai! ${okCount} bagian terpasang. Siap cetak (Ctrl+P).`);
          })
          .catch(err => {
            status("Paged.js gagal memproses. Menampilkan mode standar.", "warn");
            console.error("Paged.js Error:", err);
          });
      } else {
        status("Paged.js tidak aktif. Dokumen dalam mode flow (scroll).", "warn");
      }
    };

    // Berikan jeda waktu agar browser selesai merender 93 file sebelum dipotong-potong
    setTimeout(startPagination, DELAY_RENDER);

  } catch (err) {
    status(`Error Fatal: ${err.message}`, "warn");
    console.error(err);
  }
})();
