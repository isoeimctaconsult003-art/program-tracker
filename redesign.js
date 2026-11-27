/* Third Eye redesign layer. Load AFTER the main <script>. It reuses every existing section, ID and function. */
(function () {
  const ORIG = window.show, q = s => document.querySelector(s);
  const adm = () => typeof ME !== "undefined" && ME && ["admin", "branch_admin"].includes(ME.role);
  const tools = re => document.querySelectorAll("#tools section").forEach(s => { const h = s.querySelector("h2"); s.classList.toggle("hx", !(h && re.test(h.textContent))); });
  const gps = k => {
    const g = $("gps");
    [...g.children].forEach(el => { const t = el.dataset.grp; if (!t) return;
      el.classList.toggle("hx", t === "map" ? !["trip", "history", "places"].includes(k) : t !== k); });
    const l = q("#gps .trl"); if (l) l.classList.toggle("hx", k !== "trip");
    setTimeout(() => { try { if (kmap) kmap.invalidateSize(); } catch (e) {} }, 120);
  };
  let grp = "trip";
  [...$("gps").children].forEach(el => {
    if (el.tagName === "H3") grp = /verification/i.test(el.textContent) ? "visits" : /Tracked/i.test(el.textContent) ? "history" : /Places visited/i.test(el.textContent) ? "places" : grp;
    if (el.tagName !== "H2" && el.id !== "g_banner") el.dataset.grp = el.classList.contains("trgrid") ? "map" : grp;
  });
  const T = {
    today: {t: "Today", segs: [{k: "home", base: "ov"}]},
    plan: {t: "Plan", segs: [
      {k: "cal", l: "Calendar", base: "cal"}, {k: "list", l: "Schedule", base: "mysch"},
      {k: "targets", l: "Target dates", base: "sl", after: () => setTab("t")}]},
    travel: {t: "Travel", segs: [
      {k: "trip", l: "Trip", base: "gps", after: () => gps("trip")}, {k: "history", l: "History", base: "gps", after: () => gps("history")},
      {k: "places", l: "Places", base: "gps", after: () => gps("places")}, {k: "visits", l: "Visits", base: "gps", after: () => gps("visits")},
      {k: "claims", l: "Claims", base: "tools", after: () => tools(/Travel cost claims/)}]},
    progress: {t: "Progress", segs: [
      {k: "prog", l: "Programs", base: "pr"}, {k: "status", l: "Status", base: "pi"},
      {k: "detail", l: "Detail", base: "dt"}, {k: "schools", l: "Schools", base: "sl", after: () => setTab("p")}]},
    hub: {t: "Hub", segs: [
      {k: "inbox", l: "Inbox", base: "tools", after: () => tools(/Notifications/)},
      {k: "insights", l: "Insights", base: "tools", after: () => tools(/Global search|Needs attention|Workload|Branch comparison|Planned vs actual/)},
      {k: "reports", l: "Reports", base: "tools", after: () => tools(/Monthly reports/)},
      {k: "admin", l: "Admin", base: "usr", only: adm, extra: ["tools"], after: () => { tools(/Audit log|Backup/); loadToolsData(); }}]}
  };
  const MAP = {ov: ["today"], cal: ["plan", "cal"], mysch: ["plan", "list"], pr: ["progress", "prog"], pi: ["progress", "status"],
    dt: ["progress", "detail"], sl: ["progress", "schools"], gps: ["travel", "trip"], tools: ["hub", "inbox"], usr: ["hub", "admin"]};
  let cur = {tab: "today", seg: "home"};
  function title() {
    const h = q(".top h1"), n = (typeof ME !== "undefined" && ME && (ME.name || ME.email) || "").split(" ")[0];
    h.textContent = cur.tab === "today" ? "Hello" + (n ? ", " + n : "") + " 👋" : T[cur.tab].t;
  }
  function go(tab, seg) {
    const tb = T[tab] || T.today, S = tb.segs.find(s => s.k === seg) || tb.segs[0];
    ORIG(S.base);
    (S.extra || []).forEach(id => { $(id).style.display = ""; });
    if (S.after) S.after();
    cur = {tab, seg: S.k}; title();
    $("hubAcct").style.display = tab === "hub" ? "" : "none";
    $("fab").style.display = tab === "today" || tab === "plan" ? "" : "none";
    const sb = $("segbar"), list = tb.segs.filter(s => s.l && (!s.only || s.only()));
    sb.style.display = list.length > 1 ? "" : "none";
    sb.innerHTML = list.map(s => `<button data-seg="${s.k}" class="${s.k === S.k ? "on" : ""}">${s.l}</button>`).join("");
    document.querySelectorAll("#bnav button").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
    try { history.replaceState(null, "", "#" + tab); } catch (e) {}
    window.scrollTo(0, 0);
  }
  window.show = id => { const m = MAP[id] || ["today"]; go(m[0], m[1]); };
  // elements
  const ic = {
    today: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    plan: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    travel: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    progress: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
    hub: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'};
  const bn = document.createElement("div"); bn.id = "bnav";
  bn.innerHTML = Object.keys(T).map(k => `<button data-tab="${k}" class="${k === "travel" ? "mid" : ""}" aria-label="${T[k].t}"><svg viewBox="0 0 24 24">${ic[k]}</svg><span>${T[k].t}</span></button>`).join("");
  document.body.appendChild(bn);
  bn.onclick = e => { const b = e.target.closest("[data-tab]"); if (b) go(b.dataset.tab); };
  const sb = document.createElement("div"); sb.id = "segbar"; q(".top").after(sb);
  sb.onclick = e => { const b = e.target.closest("[data-seg]"); if (b) go(cur.tab, b.dataset.seg); };
  const fab = document.createElement("button"); fab.id = "fab"; fab.textContent = "+"; fab.setAttribute("aria-label", "Book a schedule");
  fab.onclick = () => $("newbk").click(); document.body.appendChild(fab);
  const hdr = document.createElement("div"); hdr.className = "hdr";
  hdr.innerHTML = '<button class="iconbtn" id="rfBtn" aria-label="Refresh"><svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg></button><button class="iconbtn" id="bellBtn" aria-label="Notifications"><svg viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4"/></svg><span id="bellN" style="display:none"></span></button>';
  q(".topbar").appendChild(hdr);
  $("rfBtn").onclick = () => $("rf").click(); $("bellBtn").onclick = () => go("hub", "inbox");
  const acct = document.createElement("section"); acct.id = "hubAcct"; acct.style.display = "none";
  acct.innerHTML = "<h2>Account</h2>"; acct.appendChild($("me")); q("main").appendChild(acct);
  // tables to cards
  let raf; const card = () => document.querySelectorAll("table:not(.tt)").forEach(t => {
    const rows = [...t.rows], hr = rows.find(r => r.querySelector("th")); if (!hr) return;
    const hs = [...hr.cells].map(c => c.textContent.trim()); t.classList.add("cardify");
    rows.forEach(r => { if (r !== hr) [...r.cells].forEach((c, i) => { if (!c.dataset.l && hs[i]) c.dataset.l = hs[i]; }); });
  });
  new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(card); }).observe(document.body, {childList: true, subtree: true});
  card();
  setInterval(() => {
    const n = (typeof TOOL_NOTIFICATIONS !== "undefined" ? TOOL_NOTIFICATIONS : []).filter(x => !x.readAt).length, b = $("bellN");
    b.textContent = n > 9 ? "9+" : n; b.style.display = n ? "" : "none"; title();
  }, 3000);
  const h = location.hash.slice(1); go(T[h] ? h : "today");
})();