// Theme, embedding in the Apps section, and the sidebar filter.
const root = document.documentElement;
const embedded = window.parent !== window;
let light = matchMedia("(prefers-color-scheme: light)").matches;
if (embedded) {
  root.classList.add("embed");
  try { light = !window.parent.document.documentElement.classList.contains("dark"); } catch { /* other origin */ }
  // ask the Apps section to bring this frame into view after a navigation (the frame keeps a fixed height)
  window.parent.postMessage({ trmnlDocs: true, top: true }, "*");
}
root.classList.toggle("light", light);

// Device for the example screenshots, remembered across pages.
const KEY = "trmnlDocsDevice";
let device = "x";
try { device = localStorage.getItem(KEY) || "x"; } catch { /* storage blocked: default */ }
root.dataset.device = device;
document.querySelectorAll(".device-pill [data-dev]").forEach((b) => b.addEventListener("click", () => {
  root.dataset.device = b.dataset.dev;
  try { localStorage.setItem(KEY, b.dataset.dev); } catch { /* not remembered */ }
}));

const input = document.getElementById("filter");
input.addEventListener("input", () => {
  const q = input.value.trim().toLowerCase();
  let group = null, visible = 0;
  const close = () => { if (group) group.style.display = visible || !q ? "" : "none"; };
  for (const el of document.querySelectorAll(".side .nav-group, .side .nav-item")) {
    if (el.classList.contains("nav-group")) { close(); group = el; visible = 0; continue; }
    const show = !q || el.dataset.title.includes(q);
    el.style.display = show ? "" : "none";
    if (show) visible++;
  }
  close();
});

// Language tabs: one choice for every example on the page, remembered across pages.
const LANG = "trmnlDocsLang";
function showLang(name) {
  for (const box of document.querySelectorAll(".langs")) {
    const has = box.querySelector(`[data-lang="${CSS.escape(name)}"]`);
    const pick = has ? name : box.querySelector(".lang-tabs button").dataset.lang;
    box.querySelectorAll("[data-lang]").forEach((el) => el.classList.toggle("on", el.dataset.lang === pick));
  }
}
let lang = "AssemblyScript";
try { lang = localStorage.getItem(LANG) || lang; } catch { /* default */ }
showLang(lang);
document.querySelectorAll(".lang-tabs button").forEach((b) => b.addEventListener("click", () => {
  showLang(b.dataset.lang);
  try { localStorage.setItem(LANG, b.dataset.lang); } catch { /* not remembered */ }
}));
