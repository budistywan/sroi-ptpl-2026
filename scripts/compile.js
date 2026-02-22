(async function(){
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
    // Tambahkan timestamp agar tidak terkena cache lama dari GitHub
    const r = await fetch(`${url}?t=${new Date().getTime()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`Fetch failed ${r.status}: ${url}`);
    return await r.text();
  }

  try {
    // 1. Load Manifest
    const manifestRaw = await fetchText("scripts/manifest.json");
    const manifest = JSON.parse(manifestRaw);

    const mount = document.getElementById("doc");
    if (!mount) throw new Error("#doc tidak ditemukan di html");

    // 2. Kumpulkan semua konten dalam satu variabel String
    let allContent = "";
    let ok = 0;

    status(`Memuat ${manifest.parts.length} bagian...`);

    for (const p of manifest.parts) {
      try {
        const html = await fetchText(p);
        // Bungkus dengan div agar struktur antar bab tidak berantakan
        allContent += `<div class="report-part" data-source="${p}">${html}</div>`;
        ok++;
      } catch (e) {
        console.error(`Gagal load: ${p}`, e);
        status(`Gagal load: ${p}`, "warn");
      }
    }

    // 3. Masukkan ke DOM SEKALIGUS (Nuclear Fix)
    // Ini jauh lebih stabil daripada memindahkan node satu per satu
    mount.innerHTML = allContent;
    
    status(`Berhasil muat ${ok}/${manifest.parts.length} file.`);

    // 4. Jalankan Paged.js (Opsional, jika ingin coba render lagi)
    const runPaged = () => {
      if (window.PagedPolyfill && typeof window.PagedPolyfill.preview === "function") {
        window.PagedPolyfill.preview().then(() => status("Selesai! Siap cetak."));
      }
    };

    // Uncomment baris di bawah ini jika ingin mengaktifkan Paged.js kembali
    // setTimeout(runPaged, 1000);

  } catch (e) {
    status(`Error Fatal: ${e.message}`, "warn");
  }
})();
