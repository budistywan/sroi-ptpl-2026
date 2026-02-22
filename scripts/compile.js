(async function() {
  const mount = document.getElementById("doc");

  try {
    const res = await fetch("scripts/manifest.json?t=" + Date.now());
    const manifest = await res.json();
    
    let htmlBuffer = "";
    for (const path of manifest.parts) {
      const t = await fetch(`${path}?t=${Date.now()}`).then(r => r.text());
      htmlBuffer += t;
    }
    
    // Suntikkan konten
    mount.innerHTML = htmlBuffer;

    // Jalankan Paged.js SECARA MANUAL
    if (window.PagedPolyfill) {
      console.log("Memulai Paged.js Preview...");
      
      window.PagedPolyfill.preview(mount).then(() => {
        console.log("Paged.js Berhasil!");
      }).catch(err => {
        // Jika Paged.js Error, kita paksa konten asli tetap muncul
        console.error("Paged.js Macet:", err);
        mount.style.display = "block"; 
        alert("Paged.js gagal memproses. Menampilkan mode standar.");
      });
    }

  } catch(e) {
    console.error("Error Muat:", e);
  }
})();
