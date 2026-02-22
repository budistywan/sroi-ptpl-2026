(async function() {
  const mount = document.getElementById("doc");
  
  try {
    const res = await fetch(`scripts/manifest.json?t=${Date.now()}`);
    const manifest = await res.json();
    
    let htmlBuffer = "";
    for (const path of manifest.parts) {
      const text = await fetch(`${path}?t=${Date.now()}`).then(r => r.text());
      // Masukkan tanpa pembungkus tambahan agar tidak menambah layer CSS
      htmlBuffer += text; 
    }
    
    mount.innerHTML = htmlBuffer;

    if (window.PagedPolyfill) {
      // Tunggu gambar terload (jika ada) baru jalankan pagedjs
      window.onload = () => {
        window.PagedPolyfill.preview().then(() => {
          console.log("Paginasi selesai.");
        });
      };
    }
  } catch (err) {
    console.error("Gagal muat:", err);
  }
})();
