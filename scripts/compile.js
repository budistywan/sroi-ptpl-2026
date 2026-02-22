(async function() {
  const status = (msg, type = "ok") => {
    let el = document.getElementById("compile-status") || document.createElement("div");
    el.id = "compile-status";
    el.className = type === "warn" ? "warn" : "ok";
    el.innerHTML = msg;
    document.body.appendChild(el);
  };

  async function fetchText(url) {
    // Gunakan path absolut dari root agar tidak bingung dengan folder scripts/
    const r = await fetch(url + '?t=' + Date.now(), { cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  }

  const mount = document.getElementById("doc");

  try {
    status("Sedang mengambil daftar file...");
    // Pastikan path ke manifest.json benar dari lokasi compile.html
    const manifestRes = await fetch("scripts/manifest.json");
    const manifest = await manifestRes.json();
    
    let combinedHTML = "";
    let ok = 0;

    for (const path of manifest.parts) {
      try {
        // PENTING: Path di manifest adalah 'bab-xx/file.html'
        // Karena compile.html ada di root, kita panggil langsung
        const text = await fetchText(path);
        
        if (text.trim().length === 0) {
          console.warn(`File kosong: ${path}`);
          combinedHTML += `<div style="color:red">[KOSONG: ${path}]</div>`;
        } else {
          // Masukkan teks mentah ke dalam pembungkus
          combinedHTML += `<section class="report-part" style="border:1px solid blue; margin:10px; padding:10px;">
            <small style="color:blue">${path}</small><br>
            ${text}
          </section>`;
          ok++;
        }
      } catch (e) {
        combinedHTML += `<div style="color:red">[GAGAL LOAD: ${path} - ${e.message}]</div>`;
      }
    }

    // Suntikkan langsung ke DOM
    mount.innerHTML = combinedHTML;
    status(`Berhasil render ${ok} bagian. Jika kotak tetap kosong, cek file .html Anda.`);

  } catch (e) {
    status("Gagal total: " + e.message, "warn");
  }
})();
