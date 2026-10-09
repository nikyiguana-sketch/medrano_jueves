"use strict";

/* Motor de ejercicios autocorregidos, el mismo formato que app.js.
   Cada página define antes window.PRACTICA = { key, groups, ex }. */

(function(){
  const { key: KEY, groups: GROUPS, ex: EX } = window.PRACTICA;
  const TOTAL = EX.length;

  function num(str){
    if (str === null || str === undefined) return NaN;
    const t = String(str).replace(/\s/g,"").replace(",",".");
    if (t === "") return NaN;
    return Number(t);
  }

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { saved = {}; }
  function persist(){ try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} }

  const list = document.getElementById("exList");
  GROUPS.forEach(g => {
    const h = document.createElement("div");
    h.className = "grp";
    const bands = g.bands.map(c => '<i style="background:' + c + '"></i>').join("");
    h.innerHTML = '<span class="bands">' + bands + "</span>" + g.title;
    list.appendChild(h);

    EX.filter(e => e.g === g.id).forEach(e => {
      const d = document.createElement("div");
      d.className = "ex";
      d.id = "ex" + e.n;
      d.style.setProperty("--band", g.color);
      d.innerHTML =
        '<span class="n">' + e.n + "</span>" +
        '<p class="q">' + e.q + "</p>" +
        '<div class="row">' +
          '<input type="text" inputmode="decimal" aria-label="Respuesta del ejercicio ' + e.n + '" placeholder="resultado">' +
          '<span class="unit">' + e.u + "</span>" +
          '<button class="btn">Comprobar</button>' +
          '<span class="led" aria-hidden="true"></span>' +
          '<span class="verdict" role="status"></span>' +
          '<button class="link-btn">Ver resolución</button>' +
        "</div>" +
        '<div class="sol">' + e.s + "</div>";
      list.appendChild(d);

      const input = d.querySelector("input");
      const verdict = d.querySelector(".verdict");
      const sol = d.querySelector(".sol");

      function check(silent){
        const v = num(input.value);
        if (isNaN(v)) {
          if (!silent) { d.className = "ex"; verdict.textContent = "Escribí un número."; }
          return false;
        }
        const ok = Math.abs(v - e.a) <= Math.max(Math.abs(e.a) * 0.005, 1e-9);
        d.className = "ex " + (ok ? "ok" : "no");
        verdict.textContent = ok ? "Correcto" : "Revisá el planteo y las unidades";
        if (!ok && !silent) sol.classList.add("open");
        saved[e.n] = { v: input.value, ok: ok };
        persist();
        score();
        return ok;
      }

      d.querySelector(".btn").addEventListener("click", () => check(false));
      input.addEventListener("keydown", ev => { if (ev.key === "Enter") check(false); });
      input.addEventListener("input", () => {
        if (d.className !== "ex") { d.className = "ex"; verdict.textContent = ""; }
      });
      d.querySelector(".link-btn").addEventListener("click", ev => {
        const open = sol.classList.toggle("open");
        ev.target.textContent = open ? "Ocultar resolución" : "Ver resolución";
      });

      d.checkFn = check;
      if (saved[e.n] && saved[e.n].v) { input.value = saved[e.n].v; check(true); }
    });
  });

  function score(){
    const n = EX.filter(e => saved[e.n] && saved[e.n].ok).length;
    document.getElementById("score").textContent = n + " / " + TOTAL;
    document.getElementById("count").textContent = n + " correctos de " + TOTAL;
    document.getElementById("bar").style.width = (n / TOTAL * 100) + "%";
  }
  score();

  document.getElementById("checkAll").addEventListener("click", () => {
    document.querySelectorAll(".ex").forEach(d => {
      if (d.checkFn && d.querySelector("input").value.trim() !== "") d.checkFn(false);
    });
  });
  document.getElementById("resetAll").addEventListener("click", () => {
    saved = {}; persist();
    document.querySelectorAll(".ex").forEach(d => {
      d.className = "ex";
      d.querySelector("input").value = "";
      d.querySelector(".verdict").textContent = "";
      d.querySelector(".sol").classList.remove("open");
      d.querySelector(".link-btn").textContent = "Ver resolución";
    });
    score();
  });
})();
