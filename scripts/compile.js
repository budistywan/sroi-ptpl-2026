(async function() {
  const mount = document.getElementById("doc");
  const statusEl = document.getElementById("compile-status");

  const setStatus = (msg, isWarn = false) => {
    statusEl.innerHTML = msg;
    statusEl.className = isWarn ? "warn" : "";
    console.log(`[Status] ${msg}`);
  };

  try {
    setStatus("Mengambil manifest...");
    const res = await fetch(`scripts/manifest.json?t=${Date.now()}`);
    if (!res.ok) throw new Error("Gagal mengambil manifest.json");
    const manifest = await res.json();
    
    let htmlBuffer = "";
    let count = 0;

    setStatus(`Memuat ${manifest.parts.length} file...`);

    for (const path of manifest.parts) {
      try {
        const response = await fetch(`${path}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`Skip: ${path}`);
        const text = await response.text();
        
        // Bungkus per file untuk menjaga integritas struktur
        htmlBuffer += `<div class="report-part-wrapper" data-path="${path}">${text}</div>`;
        count++;
        
        if (count % 10 === 0) setStatus(`Mendownload: ${count}/${manifest.parts.length}`);
      } catch (e) {
        console.warn(e.message);
      }
    }

    // 1. Suntikkan ke DOM
    mount.innerHTML = htmlBuffer;
    setStatus(`${count} file terpasang. Menyiapkan layout...`);

    // 2. Jalankan Paged.js secara manual dengan jeda
    // Jeda 2 detik sangat krusial untuk perangkat mobile (HP) agar tidak crash
    setTimeout(() => {
      if (window.PagedPolyfill) {
        setStatus("Paged.js: Memproses halaman...");
        
        // Manual trigger: kita spesifikasikan targetnya adalah elemen #doc
        window.PagedPolyfill.preview(mount).then(() => {
          setStatus(`Selesai! ${count} bagian terpaginasi. Siap Cetak.`);
        }).catch(err => {
          setStatus("Gagal paginasi. Menampilkan mode scroll.", true);
          console.error("Paged.js Error:", err);
          // Jika gagal, pastikan konten asli tetap tampil
          mount.style.display = "block";
        });
      } else {
        setStatus("Paged.js tidak ditemukan.", true);
      }
    }, 2000);

  } catch (err) {
    setStatus(`Error Fatal: ${err.message}`, true);
    console.error(err);
  }
})();
