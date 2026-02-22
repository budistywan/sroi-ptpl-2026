(async function() {
  const mount = document.getElementById("doc");
  const status = document.getElementById("compile-status");

  const updateStatus = (msg) => {
    if(status) status.innerHTML = msg;
    console.log(msg);
  };

  try {
    updateStatus("Sinkronisasi manifest...");
    const res = await fetch(`scripts/manifest.json?t=${Date.now()}`);
    const manifest = await res.json();
    
    let htmlBuffer = "";
    for (const path of manifest.parts) {
      try {
        const t = await fetch(`${path}?t=${Date.now()}`).then(r => r.text());
        // Masukkan tanpa pembungkus ekstra agar DOM tetap 'flat'
        htmlBuffer += t;
      } catch(e) { console.error("Gagal:", path); }
    }
    
    mount.innerHTML = htmlBuffer;
    updateStatus("Konten terpasang. Menyiapkan halaman...");

    // Berikan jeda 1 detik agar browser selesai render CSS dasar
    setTimeout(() => {
      if (window.PagedPolyfill) {
        window.PagedPolyfill.preview(mount).then(() => {
          updateStatus("Laporan SROI Selesai. Siap Cetak.");
        });
      }
    }, 1000);

  } catch (err) {
    updateStatus("Error memuat dokumen.");
  }
})();
