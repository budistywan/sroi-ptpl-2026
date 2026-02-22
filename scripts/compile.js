(async function(){
  const status=(msg,type="ok")=>{
    let el=document.getElementById("compile-status");
    if(!el){el=document.createElement("div");el.id="compile-status";document.body.appendChild(el);}
    el.className=type==="warn"?"warn":"ok";
    el.innerHTML=msg;
  };

  async function fetchText(url){
    const r=await fetch(url,{cache:"no-store"});
    if(!r.ok) throw new Error(`Fetch failed ${r.status}: ${url}`);
    return await r.text();
  }

  // Load manifest
  let manifest;
  try{ manifest=JSON.parse(await fetchText("scripts/manifest.json")); }
  catch(e){ status(`Manifest tidak terbaca.<br/><span class="muted">${e.message}</span>`,"warn"); return; }

  const mount=document.getElementById("doc");
  if(!mount){ status(`compile.html error: #doc tidak ditemukan.`,"warn"); return; }

  let ok=0;
  for(const p of manifest.parts){
    try{
      const html=await fetchText(p);
      const tmp=document.createElement("div");
      tmp.innerHTML=html;
      while(tmp.firstChild) mount.appendChild(tmp.firstChild);
      ok++;
    }catch(e){
      status(`Gagal load: <code>${p}</code><br/><span class="muted">${e.message}</span>`,"warn");
    }
  }
  status(`Loaded ${ok}/${manifest.parts.length} file. Menjalankan Paged.js… <span class="muted">(jika gagal, dokumen tetap tampil)</span>`);

  const run=()=>{
    try{
      if(window.PagedPolyfill && typeof window.PagedPolyfill.preview==="function"){
        window.PagedPolyfill.preview().then(()=>status(`Paged.js selesai. Print → Save as PDF.`))
        .catch(err=>status(`Paged.js error.<br/><span class="muted">${err?.message||err}</span>`,"warn"));
      }else{
        status(`Paged.js belum ter-load. Dokumen tetap terbaca (flow).<br/><span class="muted">Cek koneksi CDN.</span>`,"warn");
      }
    }catch(e){ status(`Paged.js gagal dijalankan.<br/><span class="muted">${e.message}</span>`,"warn"); }
  };

  let t=0;
  const iv=setInterval(()=>{ t++; if(window.PagedPolyfill){clearInterval(iv);run();} if(t>=20){clearInterval(iv);run();} },250);
})();