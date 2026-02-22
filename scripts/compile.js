/* =========================================================
   compile.js — robust loader + Paged.js init
   Goals:
   1) Never blank: content is visible even if Paged.js fails
   2) Load partials in order, then trigger pagination
========================================================= */

const STATUS = {
  el: null,
  set(text, kind="info"){
    if(!this.el) return;
    this.el.querySelector("[data-status-text]").textContent = text;
    const dot = this.el.querySelector(".dot");
    dot.style.opacity = (kind === "ok") ? "1" : (kind === "warn" ? "0.8" : "0.65");
  }
};

async function fetchText(url){
  const res = await fetch(url, { cache: "no-store" });
  if(!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
  return await res.text();
}

function injectHTML(target, html){
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  target.appendChild(tpl.content);
}

async function loadPartials(list, mount){
  for(const item of list){
    const html = await fetchText(item);
    injectHTML(mount, html);
  }
}

function ensurePagedPolyfill(){
  // Already available?
  if(window.PagedPolyfill) return Promise.resolve(true);

  // Load from CDN
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/pagedjs/dist/paged.polyfill.js";
    s.onload = () => resolve(!!window.PagedPolyfill);
    s.onerror = () => reject(new Error("Failed to load paged.polyfill.js from CDN"));
    document.head.appendChild(s);
  });
}

async function runPaged(){
  await ensurePagedPolyfill();
  // Paged.js will paginate the entire document; use preview() for browser
  // This does NOT hide content; it enhances with paged pages.
  await window.PagedPolyfill.preview();
}

function showError(err){
  console.error(err);
  const box = document.getElementById("errorbox");
  if(!box) return;
  box.hidden = false;
  box.textContent = String(err?.stack || err?.message || err);
}

document.addEventListener("DOMContentLoaded", async () => {
  STATUS.el = document.getElementById("status");
  STATUS.set("Loading sections…");

  const mount = document.getElementById("doc");
  const manifestUrl = "scripts/manifest.json";

  try{
    const manifest = JSON.parse(await fetchText(manifestUrl));
    await loadPartials(manifest.partials, mount);

    STATUS.set("Paginating (Paged.js)…", "info");
    try{
      await runPaged();
      STATUS.set("READY — Print to PDF", "ok");
    }catch(pagedErr){
      // Still OK: content already visible (flowing).
      STATUS.set("Paged.js failed — showing flowing document", "warn");
      showError(pagedErr);
    }
  }catch(err){
    STATUS.set("ERROR — check console", "warn");
    showError(err);
  }
});