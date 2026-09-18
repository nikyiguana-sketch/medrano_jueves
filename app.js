"use strict";

/* ---------- calculadora ---------- */
const UNITS = {
  v: [["µV",1e-6],["mV",1e-3],["V",1],["kV",1e3]],
  i: [["µA",1e-6],["mA",1e-3],["A",1]],
  r: [["Ω",1],["kΩ",1e3],["MΩ",1e6]]
};
const DEF = { v:2, i:1, r:0 };

function fillSelect(id, key){
  const s = document.getElementById(id);
  UNITS[key].forEach(([name],idx) => {
    const o = document.createElement("option");
    o.value = idx; o.textContent = name;
    s.appendChild(o);
  });
  s.value = DEF[key];
}
fillSelect("uv","v"); fillSelect("ui","i"); fillSelect("ur","r");

function num(str){
  if (str === null || str === undefined) return NaN;
  const t = String(str).replace(/\s/g,"").replace(",",".");
  if (t === "") return NaN;
  return Number(t);
}
function fmt(x){
  if (!isFinite(x)) return "—";
  let s;
  const a = Math.abs(x);
  if (a !== 0 && (a < 1e-4 || a >= 1e7)) s = x.toExponential(4);
  else s = String(Math.round(x * 1e9) / 1e9);
  return s.replace(".", ",");
}

const readout = document.getElementById("readout");
function say(text, off){
  readout.textContent = text;
  readout.classList.toggle("off", !!off);
}

document.getElementById("calcBtn").addEventListener("click", () => {
  const raw = { v: document.getElementById("cv").value, i: document.getElementById("ci").value, r: document.getElementById("cr").value };
  const mul = {
    v: UNITS.v[document.getElementById("uv").value][1],
    i: UNITS.i[document.getElementById("ui").value][1],
    r: UNITS.r[document.getElementById("ur").value][1]
  };
  const lab = {
    v: UNITS.v[document.getElementById("uv").value][0],
    i: UNITS.i[document.getElementById("ui").value][0],
    r: UNITS.r[document.getElementById("ur").value][0]
  };
  const val = { v:num(raw.v), i:num(raw.i), r:num(raw.r) };
  const have = ["v","i","r"].filter(k => !isNaN(val[k]));

  if (have.length < 2) { say("Cargá dos de los tres valores.", true); return; }
  if (have.length === 3) { say("Dejá vacío el campo que querés calcular.", true); return; }

  const base = {};
  have.forEach(k => base[k] = val[k] * mul[k]);
  const missing = ["v","i","r"].find(k => isNaN(val[k]));

  let out;
  if (missing === "v") out = base.i * base.r;
  else if (missing === "i") { if (base.r === 0) { say("La resistencia no puede ser cero.", true); return; } out = base.v / base.r; }
  else { if (base.i === 0) { say("La corriente no puede ser cero.", true); return; } out = base.v / base.i; }

  const shown = out / mul[missing];
  document.getElementById("c" + missing).value = fmt(shown);
  say(missing.toUpperCase() + " = " + fmt(shown) + " " + lab[missing]);
});

document.getElementById("clearBtn").addEventListener("click", () => {
  ["cv","ci","cr"].forEach(id => document.getElementById(id).value = "");
  say("Esperando dos valores", true);
});

/* ---------- ejercicios ---------- */
const GROUPS = [
  { id:"A", title:"Grupo A — calcular la tensión (V = I × R)", bands:["#7B3F00","#C0392B","#D35400"], color:"#7B3F00" },
  { id:"B", title:"Grupo B — calcular la corriente (I = V ÷ R)", bands:["#C0392B","#D35400","#C9A227"], color:"#C0392B" },
  { id:"C", title:"Grupo C — calcular la resistencia (R = V ÷ I)", bands:["#D35400","#C9A227","#2E7D4F"], color:"#D35400" },
  { id:"D", title:"Grupo D — aplicados", bands:["#C9A227","#2E7D4F","#1F5F8B"], color:"#C9A227" }
];

const EX = [
{g:"A",n:1,q:"Por una resistencia de 48 Ω circulan 250 mA. ¿Qué tensión hay sobre ella?",u:"V",a:12,
 s:"250 mA a A es correr la coma tres lugares a la izquierda: 0,25 A.<br>V = 0,25 × 48 = <span class='res'>12 V</span>"},
{g:"A",n:2,q:"Circulan 15 mA por una resistencia de 2,2 kΩ. ¿Tensión?",u:"V",a:33,
 s:"15 mA = 0,015 A y 2,2 kΩ = 2 200 Ω.<br>V = 0,015 × 2 200 = <span class='res'>33 V</span>"},
{g:"A",n:3,q:"Una resistencia de 10 kΩ es atravesada por 500 µA. ¿Tensión?",u:"V",a:5,
 s:"500 µA = 0,0005 A y 10 kΩ = 10 000 Ω.<br>V = 0,0005 × 10 000 = <span class='res'>5 V</span>"},
{g:"A",n:4,q:"Por un resistor de 470 Ω pasan 20 mA. ¿Tensión?",u:"V",a:9.4,
 s:"20 mA = 0,02 A.<br>V = 0,02 × 470 = <span class='res'>9,4 V</span>"},
{g:"A",n:5,q:"Una resistencia de 1,5 MΩ conduce 120 µA. ¿Tensión?",u:"V",a:180,
 s:"120 µA = 0,00012 A y 1,5 MΩ = 1 500 000 Ω.<br>V = 0,00012 × 1 500 000 = <span class='res'>180 V</span>"},
{g:"A",n:6,q:"Circulan 3,5 A por una resistencia de 4 Ω. ¿Tensión?",u:"V",a:14,
 s:"Ya está todo en unidades base, no hay conversión.<br>V = 3,5 × 4 = <span class='res'>14 V</span>"},
{g:"A",n:7,q:"Un resistor de 15 Ω conduce 800 mA. ¿Tensión?",u:"V",a:12,
 s:"800 mA = 0,8 A.<br>V = 0,8 × 15 = <span class='res'>12 V</span>"},
{g:"A",n:8,q:"Por una resistencia de 220 kΩ circulan 50 µA. ¿Tensión?",u:"V",a:11,
 s:"50 µA = 0,00005 A y 220 kΩ = 220 000 Ω.<br>V = 0,00005 × 220 000 = <span class='res'>11 V</span>"},
{g:"A",n:9,q:"Una resistencia de 3,3 kΩ conduce 1,2 mA. ¿Tensión?",u:"V",a:3.96,
 s:"1,2 mA = 0,0012 A y 3,3 kΩ = 3 300 Ω.<br>V = 0,0012 × 3 300 = <span class='res'>3,96 V</span>"},
{g:"A",n:10,q:"Por un resistor de 1,6 kΩ pasan 75 mA. ¿Tensión, en kV?",u:"kV",a:0.12,
 s:"75 mA = 0,075 A y 1,6 kΩ = 1 600 Ω.<br>V = 0,075 × 1 600 = 120 V.<br>Piden kV, divido por 1 000: <span class='res'>0,12 kV</span>"},

{g:"B",n:11,q:"Se aplican 12 V sobre una resistencia de 2,4 kΩ. ¿Corriente, en mA?",u:"mA",a:5,
 s:"2,4 kΩ = 2 400 Ω.<br>I = 12 ÷ 2 400 = 0,005 A = <span class='res'>5 mA</span>"},
{g:"B",n:12,q:"Una resistencia de 180 Ω se conecta a 9 V. ¿Corriente, en mA?",u:"mA",a:50,
 s:"I = 9 ÷ 180 = 0,05 A.<br>A mA: coma tres lugares a la derecha → <span class='res'>50 mA</span>"},
{g:"B",n:13,q:"Se aplican 1,5 V a una resistencia de 3 MΩ. ¿Corriente, en µA?",u:"µA",a:0.5,
 s:"3 MΩ = 3 000 000 Ω.<br>I = 1,5 ÷ 3 000 000 = 0,0000005 A = <span class='res'>0,5 µA</span>"},
{g:"B",n:14,q:"Una resistencia de 46 Ω se conecta a 230 V. ¿Corriente, en A?",u:"A",a:5,
 s:"Todo en unidades base.<br>I = 230 ÷ 46 = <span class='res'>5 A</span>"},
{g:"B",n:15,q:"Se aplican 100 mV sobre una resistencia de 50 Ω. ¿Corriente, en mA?",u:"mA",a:2,
 s:"100 mV = 0,1 V.<br>I = 0,1 ÷ 50 = 0,002 A = <span class='res'>2 mA</span>"},
{g:"B",n:16,q:"Una resistencia de 1 MΩ se conecta a 5 V. ¿Corriente, en µA?",u:"µA",a:5,
 s:"1 MΩ = 1 000 000 Ω.<br>I = 5 ÷ 1 000 000 = 0,000005 A = <span class='res'>5 µA</span>"},
{g:"B",n:17,q:"Se aplican 24 V a una resistencia de 3 kΩ. ¿Corriente, en mA?",u:"mA",a:8,
 s:"3 kΩ = 3 000 Ω.<br>I = 24 ÷ 3 000 = 0,008 A = <span class='res'>8 mA</span>"},
{g:"B",n:18,q:"Una resistencia de 12 kΩ se conecta a 6 kV. ¿Corriente, en mA?",u:"mA",a:500,
 s:"Acá el prefijo se cancela: kV ÷ kΩ = 1 000 V ÷ 1 000 Ω = V ÷ Ω = A.<br>Así que divido directo: 6 ÷ 12 = 0,5 A = <span class='res'>500 mA</span><br>Por el camino largo da igual: 6 000 V ÷ 12 000 Ω = 0,5 A."},
{g:"B",n:19,q:"Se aplican 250 mV sobre una resistencia de 500 kΩ. ¿Corriente, en µA?",u:"µA",a:0.5,
 s:"250 mV = 0,25 V y 500 kΩ = 500 000 Ω.<br>I = 0,25 ÷ 500 000 = 0,0000005 A = <span class='res'>0,5 µA</span>"},
{g:"B",n:20,q:"Una resistencia de 0,8 Ω se conecta a 400 mV. ¿Corriente, en mA?",u:"mA",a:500,
 s:"400 mV = 0,4 V.<br>I = 0,4 ÷ 0,8 = 0,5 A = <span class='res'>500 mA</span>"},

{g:"C",n:21,q:"Con 12 V circulan 400 mA. ¿Qué resistencia hay, en Ω?",u:"Ω",a:30,
 s:"400 mA = 0,4 A.<br>R = 12 ÷ 0,4 = <span class='res'>30 Ω</span>"},
{g:"C",n:22,q:"Con 9 V circulan 3 mA. ¿Resistencia, en kΩ?",u:"kΩ",a:3,
 s:"3 mA = 0,003 A.<br>R = 9 ÷ 0,003 = 3 000 Ω = <span class='res'>3 kΩ</span>"},
{g:"C",n:23,q:"Con 220 V circulan 2,2 A. ¿Resistencia, en Ω?",u:"Ω",a:100,
 s:"Todo en unidades base.<br>R = 220 ÷ 2,2 = <span class='res'>100 Ω</span>"},
{g:"C",n:24,q:"Con 5 V circulan 250 µA. ¿Resistencia, en kΩ?",u:"kΩ",a:20,
 s:"250 µA = 0,00025 A.<br>R = 5 ÷ 0,00025 = 20 000 Ω = <span class='res'>20 kΩ</span>"},
{g:"C",n:25,q:"Con 1,5 kV circulan 30 mA. ¿Resistencia, en kΩ?",u:"kΩ",a:50,
 s:"1,5 kV = 1 500 V y 30 mA = 0,03 A.<br>R = 1 500 ÷ 0,03 = 50 000 Ω = <span class='res'>50 kΩ</span>"},
{g:"C",n:26,q:"Con 60 mV circulan 12 µA. ¿Resistencia, en kΩ?",u:"kΩ",a:5,
 s:"60 mV = 0,06 V y 12 µA = 0,000012 A.<br>R = 0,06 ÷ 0,000012 = 5 000 Ω = <span class='res'>5 kΩ</span>"},
{g:"C",n:27,q:"Con 3,3 V circulan 110 µA. ¿Resistencia, en kΩ?",u:"kΩ",a:30,
 s:"110 µA = 0,00011 A.<br>R = 3,3 ÷ 0,00011 = 30 000 Ω = <span class='res'>30 kΩ</span>"},
{g:"C",n:28,q:"Con 400 V circulan 0,5 mA. ¿Resistencia, en MΩ?",u:"MΩ",a:0.8,
 s:"0,5 mA = 0,0005 A.<br>R = 400 ÷ 0,0005 = 800 000 Ω = <span class='res'>0,8 MΩ</span>"},

{g:"D",n:29,q:"Un LED necesita 20 mA y sobre él caen 2 V. Lo alimentás desde una fuente de 9 V con una resistencia en serie. ¿De cuánto tiene que ser, en Ω?",u:"Ω",a:350,
 s:"Primero, cuánta tensión tiene que comerse la resistencia: 9 V − 2 V = 7 V.<br>La corriente es la misma que la del LED porque están en serie: 20 mA = 0,02 A.<br>R = 7 ÷ 0,02 = <span class='res'>350 Ω</span> (0,35 kΩ)<br>En la práctica pondrías la comercial más cercana por arriba, 390 Ω, para no pasarte de corriente."},
{g:"D",n:30,q:"Un termistor de 8 kΩ está conectado a 400 mV. ¿Qué corriente circula, en µA?",u:"µA",a:50,
 s:"400 mV = 0,4 V y 8 kΩ = 8 000 Ω.<br>I = 0,4 ÷ 8 000 = 0,00005 A = <span class='res'>50 µA</span>"}
];

const KEY = "ohm-practica-v1";
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
      verdict.textContent = ok ? "Correcto" : "Revisá las unidades";
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
  document.getElementById("score").textContent = n + " / 30";
  document.getElementById("count").textContent = n + " correctos de 30";
  document.getElementById("bar").style.width = (n / 30 * 100) + "%";
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
