// Renders the live experiment progress from log/data.json.
// Numbers are updated by hand from the Gumroad dashboard — never estimated.
(function () {
  var root = document.querySelector("[data-progress]");
  if (!root) return;
  var src = root.getAttribute("data-progress");
  var fmt = function (n) { return "$" + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 }); };
  function render(d) {
    var goal = d.goal_usd || 500;
    var pct = Math.min(100, (d.revenue_usd / goal) * 100);
    var start = new Date(d.start_date + "T00:00:00Z");
    var day = Math.max(0, Math.min(30, Math.floor((Date.now() - start) / 864e5)));
    var set = function (k, v) { var el = root.querySelector('[data-k="' + k + '"]'); if (el) el.textContent = v; };
    set("revenue", fmt(d.revenue_usd));
    set("goal", fmt(goal));
    set("day", "Day " + day + " of 30");
    set("orders", d.orders);
    set("visitors", Number(d.visitors).toLocaleString("en-US"));
    set("stars", d.github_stars);
    set("spend", fmt(d.spend_usd));
    set("updated", d.updated);
    var bar = root.querySelector(".bar > i");
    if (bar) bar.style.width = pct + "%";
    root.querySelector(".bar").setAttribute("aria-valuenow", Math.round(pct));
  }
  fetch(src, { cache: "no-store" }).then(function (r) { return r.json(); }).then(render).catch(function () {
    /* offline / file:// — keep the server-rendered defaults */
  });
})();
