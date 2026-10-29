(function(){
  try {
    const s = JSON.parse(localStorage.getItem("techill_mode"));
    if (s === "light" || s === "dark") document.documentElement.dataset.mode = s;
  } catch(e){}
  const b = document.getElementById("themeBtn");
  if (b) b.addEventListener("click", () => {
    const n = (document.documentElement.dataset.mode || "light") === "dark" ? "light" : "dark";
    document.documentElement.dataset.mode = n;
    try { localStorage.setItem("techill_mode", JSON.stringify(n)); } catch(e){}
  });
})();

function paintCompany(c){
  document.querySelectorAll("[data-co]").forEach(el => {
    const k = el.dataset.co;
    const v = (c[k] || "").trim();
    if (k === "email"){
      el.hidden = false;
      if (el.tagName === "A"){ el.href = "mailto:" + (v || "hello@techill.top"); el.textContent = v || "hello@techill.top"; }
      else el.textContent = v || "hello@techill.top";
      return;
    }
    if (k === "phone"){
      el.hidden = !v;
      const a = el.querySelector("a");
      if (v && a){ a.href = "tel:+" + v.replace(/^\+/, ""); a.textContent = v; }
      else if (v) el.textContent = v;
      return;
    }
    if (k === "address"){
      el.hidden = !v;
      const t = el.querySelector("[data-co-text]");
      if (v && t) t.textContent = v;
      else if (v) el.textContent = v;
      return;
    }
    if (k === "trade_license"){
      const t = el.querySelector("[data-co-text]") || el;
      const n = v || "00205600";
      t.textContent = el.dataset.format === "raw" ? n : "ট্রেড লাইসেন্স: " + n;
      return;
    }
    if (!v){ el.hidden = true; return; }
    el.hidden = false;
    el.textContent = v;
  });
}

api.init().then(() => api.company()).then(async r => {
  const c = r.company || {};
  paintCompany(c);
  const wa = document.getElementById("coWa");
  if (!wa) return;
  let num = String(c.phone || "").replace(/\D/g, "");
  if (!num){
    try { const cat = await api.catalog(); num = String((cat.catalog || {}).whatsapp || "").replace(/\D/g, ""); } catch(e){}
  }
  if (/^01[3-9]\d{8}$/.test(num)) num = "88" + num;
  if (num){ wa.href = "https://wa.me/" + num; wa.hidden = false; }
}).catch(() => {});
