/* 행성우주과학2 Ⅱ-1 태양과 별의 관측 — '실제 자료' 탭 (2026-11-27)
   o1 흑점이 원반을 건너는 데 걸린 날 — NOAA SWPC 가 매일 발표한 흑점 영역 위치로 태양의 자전 주기
   o2 하늘에서 가장 빨리 움직이는 별 — 가이아 DR3 의 버너드별 시차·고유 운동·시선 속도로 접선·공간 속도
   o3 세페이드로 잰 소마젤란은하까지의 거리 — OGLE-III 대·소마젤란은하 세페이드 4천여 개의 주기-광도 관계
   자료: data/obs-regions.js (NOAA SWPC), data/obs-barnard.js (ESA Gaia DR3, CDS VizieR), data/obs-cepheids.js (OGLE-III) — 받은 날 2026-11-27
   이야기 탭 안의 '📊 실제 자료'(real-cases.js, 히파르코스 H-R도·아크투루스·창원 강수일)와 겹치지 않는 자료만 쓴다. */
(function () {
"use strict";
var K = window.sthKit, LT = K.LT;
var RG = (window.OBS_REG || { regions: {} }).regions;
var BN = window.OBS_BARN || { star: { plx: 547, pmra: -802, pmde: 10362, rv: -110, g: 8.2 }, bg: [] };
var CP = window.OBS_CEP || { lmc: [], smc: [] };

function card(ctx, x, W, CH, title, rows, tip, good) {
  K.card(ctx, x, 8, W - x - 8, CH - 16, null);
  K.t(ctx, title, x + 16, 50, { s: 12, w: "800", c: LT.mute });
  rows.forEach(function (r, i) { K.row(ctx, r[0], r[1], x + 16, W - 24, 80 + i * 27, r[2]); });
  if (tip) K.tip(ctx, tip, x + 12, CH - 56, W - x - 32, good);
}
function src(s) { return "<small>출처: " + s + " · 받은 날 2026-11-27 · 사본은 이 단원의 data/ 폴더.</small>"; }
function fit(xs, ys) { var n = xs.length, sx = 0, sy = 0, sxx = 0, sxy = 0; for (var i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; } var b = (n * sxy - sx * sy) / (n * sxx - sx * sx); return [b, (sy - b * sx) / n]; }

/* ---- o1 계산값 ---- */
var RKEYS = Object.keys(RG).filter(function (k) { return RG[k].length >= 10; }).slice(0, 3);
function day(md) { return Date.UTC(2026, +md.slice(0, 2) - 1, +md.slice(3, 5)) / 864e5; }
var RFIT = {}; RKEYS.forEach(function (k) { var a = RG[k], f = fit(a.map(function (r) { return day(r[0]); }), a.map(function (r) { return r[2]; })); RFIT[k] = { rate: -f[0], P: 360 / -f[0] }; });
var R0 = RKEYS[0] || "4565";
var P_ALL = RKEYS.length ? RKEYS.reduce(function (s, k) { return s + RFIT[k].P; }, 0) / RKEYS.length : 27;
function kmd(md) { return (+md.slice(0, 2)) + "월 " + (+md.slice(3, 5)) + "일"; }
function loc(r) { return (r[1] >= 0 ? "N" : "S") + Math.abs(r[1]) + (r[2] >= 0 ? "E" : "W") + Math.abs(r[2]); }

/* ---- o2 계산값 ---- */
var ST = BN.star, MU = Math.sqrt(ST.pmra * ST.pmra + ST.pmde * ST.pmde) / 1000;   /* 초/년 */
var DPC = 1000 / ST.plx, VT = 4.74 * MU * DPC, VS = Math.sqrt(VT * VT + ST.rv * ST.rv);

/* ---- o3 계산값 ---- */
function unpack(a) { var o = []; for (var i = 0; i + 2 < a.length; i += 3) o.push([a[i] / 1000, a[i + 1] / 100, a[i + 2] / 100]); return o; }
var LM = unpack(CP.lmc), SM = unpack(CP.smc);
var FI = fit(LM.map(function (r) { return r[0]; }), LM.map(function (r) { return r[1]; }));
var FW = fit(LM.map(function (r) { return r[0]; }), LM.map(function (r) { return r[2]; }));
function off(F, j) { var s = 0; SM.forEach(function (r) { s += r[j] - (F[0] * r[0] + F[1]); }); return SM.length ? s / SM.length : 0; }
var DI = off(FI, 1), DW = off(FW, 2), D_LMC = 49.6, D_SMC = D_LMC * Math.pow(10, DW / 5), D_SMC_I = D_LMC * Math.pow(10, DI / 5);

window.sthLab({
  mount: "obs", key: "obs", result: "rObs", label: "실제 자료",
  doneNote: "정리하기 탭에서, 실제 관측값이 이야기 속 생각(태양의 자전, 별의 운동, 변광성으로 거리 재기)과 어디까지 맞았는지 한 문장으로 적어 보세요.",
  cases: [
  {
    id: "o1", tag: "실제 자료 · 태양 관측", title: "흑점이 원반을 건너는 데 걸린 날", short: "태양의 자전",
    kind: "obs calc", kindPos: "tr",
    who: "☀️", name: "태양 관측소",
    say: "“미국 해양대기청 우주기상예보센터(SWPC)는 날마다 태양 원반 위 <b>흑점 영역의 위치</b>를 발표합니다. N12E75는 ‘북위 12°, 원반 중심에서 동쪽(왼쪽)으로 75°’라는 뜻이에요. 2026년 10~11월에 12일 넘게 보인 영역을 골라 날짜를 넘기며 따라가 보세요. 흑점이 하루에 몇 도씩 움직이는지 알면 태양이 한 바퀴 도는 데 며칠 걸리는지 알 수 있습니다.”",
    predict: {
      q: "흑점 하나가 태양 원반의 동쪽 끝(왼쪽)에서 서쪽 끝(오른쪽)까지 건너가는 데 걸리는 시간은?",
      options: ["㉠ 하루쯤", "㉡ 2주쯤", "㉢ 1년쯤"],
      answer: 1
    },
    task: "영역을 고르고 날짜를 넘기며 경도를 읽으세요. 그다음 <b>하루에 움직이는 각도</b>로 지구에서 본 태양의 <b>자전 주기</b>(360° ÷ 하루 이동 각도)를 구해 맞추세요(± 1.2일, 세 영역 어느 것으로 구해도 됩니다).",
    build: function (stage, api) {
      var cv = api.canvas(310), ctx = cv.ctx, W = cv.W, rk = R0, k = 0, P = 15;
      function draw() {
        var A = RG[rk] || [], r = A[Math.min(k, A.length - 1)] || ["01-01", 0, 0, 0];
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var cx = 200, cy = 178, R = 118;
        var gr = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, R); gr.addColorStop(0, "#fff3c4"); gr.addColorStop(0.8, "#ffc94d"); gr.addColorStop(1, "#f08c00");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(120,60,0,.25)"; ctx.lineWidth = 1;
        [-60, -30, 0, 30, 60].forEach(function (lo) { ctx.beginPath(); for (var la = -90; la <= 90; la += 5) { var x = cx - R * Math.cos(la * Math.PI / 180) * Math.sin(lo * Math.PI / 180), y = cy - R * Math.sin(la * Math.PI / 180); if (la === -90) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); });
        [-30, 0, 30].forEach(function (la) { var y = cy - R * Math.sin(la * Math.PI / 180), hw = R * Math.cos(la * Math.PI / 180); ctx.beginPath(); ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y); ctx.stroke(); });
        function P2(q) { return [cx - R * Math.cos(q[1] * Math.PI / 180) * Math.sin(q[2] * Math.PI / 180), cy - R * Math.sin(q[1] * Math.PI / 180)]; }
        A.forEach(function (q, i) { if (i > k) return; var p = P2(q); ctx.fillStyle = i === k ? "#2b1600" : "rgba(43,22,0,.35)"; ctx.beginPath(); ctx.arc(p[0], p[1], i === k ? 6 : 3.5, 0, 6.2832); ctx.fill(); });
        K.t(ctx, "동", cx - R - 22, cy + 4, { s: 13, w: "900", c: LT.mute }); K.t(ctx, "서", cx + R + 8, cy + 4, { s: 13, w: "900", c: LT.mute });
        K.t(ctx, "북", cx - 6, cy - R - 8, { s: 13, w: "900", c: LT.mute });
        /* 오른쪽: 경도-날짜 */
        var g = K.chart(ctx, { x: 360, y: 52, w: 322, h: cv.H - 56, pl: 46, x0: 0, x1: Math.max(1, A.length - 1), y0: -90, y1: 90, xt: 4, yt: 6, light: true,
          xf: function (x) { var q = A[Math.round(x)]; return q ? (+q[0].slice(0, 2)) + "/" + (+q[0].slice(3)) : ""; }, yf: function (y) { return (y > 0 ? "E" : y < 0 ? "W" : "") + Math.abs(y).toFixed(0) + "°"; } });
        K.plot(ctx, g, A.slice(0, k + 1).map(function (q, i) { return [i, q[2]]; }), LT.orange, { light: true, w: 2.4, dots: 3 });
        K.bigText(ctx, kmd(r[0]) + " · " + loc(r), 16, 38, 22, "#ffffff");
        var d = k > 0 ? (A[0][2] - r[2]) / (day(r[0]) - day(A[0][0])) : null;
        card(ctx, 690, W, cv.H, "영역 " + rk + " · 2026년", [
          ["날짜", kmd(r[0])], ["위치", loc(r), LT.orange], ["처음 본 날", kmd(A[0][0]) + " " + loc(A[0])],
          ["그동안 움직인 각", (A[0][2] - r[2]) + "°"], ["하루에", d == null ? "–" : d.toFixed(1) + "°", LT.blue], ["내 답: 자전 주기", P.toFixed(1) + " 일", LT.blue]
        ], "주기 = 360° ÷ 하루 이동 각", null);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "흑점 영역", value: R0, options: RKEYS.map(function (q) { return { v: q, t: q + "번 (" + (RG[q][0][1] >= 0 ? "북위 " : "남위 ") + Math.abs(RG[q][0][1]) + "°)" }; }), onPick: function (x) { rk = x; k = 0; draw(); } });
      api.slider({ label: "날짜 넘기기", min: 0, max: 12, step: 1, value: 0, fmt: function (x) { var A = RG[rk] || []; var q = A[Math.min(x, A.length - 1)]; return q ? kmd(q[0]) : ""; }, onInput: function (x) { k = Math.min(x, (RG[rk] || [0]).length - 1); draw(); } });
      api.slider({ label: "지구에서 본 자전 주기", min: 5, max: 40, step: 0.1, value: 15, fmt: function (x) { return x.toFixed(1) + " 일"; }, onInput: function (x) { P = x; api.changed(); draw(); } });
      api.info("경도는 원반 중심 자오선에서 잰 각도이고 1° 단위로 반올림되어 있습니다. 하루하루의 이동 각은 조금씩 들쭉날쭉하므로, 처음 날과 마지막 날을 이용해 평균을 내면 더 정확합니다. 태양의 자전축 기울기는 무시하고 그렸습니다. "
        + src("미국 해양대기청(NOAA) 우주기상예보센터(SWPC) 태양 활동 영역 목록(solar_regions.json), 2026년 10월 28일 ~ 11월 27일"));
      draw();
      return {
        judge: function () {
          var ok = Math.abs(P - P_ALL) <= 1.2 + 1e-9;
          var txt = RKEYS.map(function (q) { return q + "번 하루 " + RFIT[q].rate.toFixed(1) + "° → " + RFIT[q].P.toFixed(1) + "일"; }).join(", ");
          if (ok) return { ok: true, msg: txt + ". 평균 약 " + P_ALL.toFixed(1) + "일. 원반 앞면(180°)을 건너는 데는 그 절반인 약 2주가 걸립니다." };
          return { ok: false, msg: P.toFixed(1) + "일은 " + (P < P_ALL ? "짧습니다" : "깁니다") + ". 마지막 날로 넘겨 카드의 ‘하루에 □°’를 읽고, 360을 그 값으로 나누세요." };
        }
      };
    },
    hints: ["마지막 날짜까지 넘기면 11~12일 동안 150~160° 움직였다는 것을 알 수 있습니다.", "하루 13.4°라면 360 ÷ 13.4 ≈ 26.9일."],
    solution: (function () {
      if (!RKEYS.length) return "지구에서 본 자전 주기는 약 <b>" + P_ALL.toFixed(1) + "일</b>.";
      var rs = RKEYS.map(function (k) { return RFIT[k].rate; }), ps = RKEYS.map(function (k) { return RFIT[k].P; });
      var nm = ["", "한", "두", "세", "네", "다섯"][RKEYS.length] || String(RKEYS.length);
      return nm + " 영역의 흑점은 하루에 약 " + Math.min.apply(null, rs).toFixed(1) + "~" + Math.max.apply(null, rs).toFixed(1) + "° 움직이고, 이로 구한 지구에서 본 자전 주기는 영역마다 " + Math.min.apply(null, ps).toFixed(1) + "~" + Math.max.apply(null, ps).toFixed(1) + "일, 평균 약 <b>" + P_ALL.toFixed(1) + "일</b>입니다.";
    })(),
    why: "흑점이 날마다 동쪽에서 서쪽으로 같은 방향, 거의 같은 빠르기로 움직이는 것은 태양이 자전하기 때문입니다(갈릴레이도 흑점 관측으로 이를 알아냈습니다). 원반 가장자리 가까이에서는 흑점이 비스듬히 보여 모양이 납작해지고, 앞면을 다 건너면 2주쯤 뒤 뒷면으로 사라집니다.<br>"
      + "자료로 구한 약 " + P_ALL.toFixed(0) + "일은 <b>지구에서 본</b>(회합) 주기입니다. 그동안 지구도 태양 둘레를 같은 방향으로 돌아가므로, 별에 대한 실제 자전 주기는 1/P = 1/" + P_ALL.toFixed(1) + " + 1/365 에서 약 " + (1 / (1 / P_ALL + 1 / 365.25)).toFixed(1) + "일로 조금 더 짧습니다. 태양은 기체 공이라 적도는 약 25일, 위도가 높을수록 더 천천히(극 근처 30일 넘게) 도는 차등 자전을 합니다. 여기의 흑점들은 모두 적도 가까이(위도 20° 안쪽)에 있습니다."
  },
  {
    id: "o2", tag: "실제 자료 · 별의 운동", title: "하늘에서 가장 빨리 움직이는 별", short: "버너드별의 공간 운동",
    kind: "obs calc", kindPos: "tr",
    who: "⭐", name: "가이아 자료 분석팀",
    say: "“유럽 우주국의 가이아 위성이 잰 <b>버너드별</b>입니다. 맨눈으로는 안 보이는 9등급 별이지만, 별들 가운데 하늘에서 가장 빨리 자리를 옮깁니다. 배경 별 사이에서 해마다 얼마나 움직이는지 보고, 연주 시차·고유 운동·시선 속도로 이 별이 실제로 <b>우주 공간에서 얼마나 빨리</b> 움직이는지 구해 주세요.”",
    predict: {
      q: "버너드별이 하늘에서 가장 빨리 움직여 보이는 까닭은 무엇일까요?",
      options: ["㉠ 실제 속력이 아주 빠르기 때문만이다", "㉡ 아주 가깝기 때문만이다", "㉢ 가까운 데다 속력도 빠른 편이기 때문이다"],
      answer: 2
    },
    task: "① <b>접선 속도</b> v<sub>t</sub> = 4.74 × μ(″/년) × d(pc)를 구해 맞추세요(± 5 km/s). ② 시선 속도와 합쳐 <b>공간 속도</b> v = √(v<sub>t</sub>² + v<sub>r</sub>²)를 맞추세요(± 6 km/s).",
    build: function (stage, api) {
      var cv = api.canvas(310), ctx = cv.ctx, W = cv.W, yr = 0, vt = 40, vs = 80;
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var cx = 340, cy = 176, S = 2.0;                         /* 1″ = 2 px, 동쪽이 왼쪽 */
        ctx.fillStyle = "#101a33"; ctx.beginPath(); ctx.roundRect(cx - 130, cy - 124, 260, 248, 12); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.roundRect(cx - 130, cy - 124, 260, 248, 12); ctx.clip();
        BN.bg.forEach(function (b) { var x = cx - b[0] * S, y = cy - b[1] * S, r = Math.max(1, 4.5 - (b[2] - 15) * 0.6); ctx.fillStyle = "rgba(220,230,255,.9)"; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); });
        var dx = ST.pmra / 1000, dy = ST.pmde / 1000;
        ctx.strokeStyle = "rgba(255,160,90,.6)"; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(cx - dx * -6 * S, cy - dy * -6 * S); ctx.lineTo(cx - dx * 6 * S, cy - dy * 6 * S); ctx.stroke(); ctx.setLineDash([]);
        for (var t = -5; t <= 5; t++) { ctx.fillStyle = "rgba(255,160,90,.55)"; ctx.beginPath(); ctx.arc(cx - dx * t * S, cy - dy * t * S, 2, 0, 6.2832); ctx.fill(); }
        var bx = cx - dx * yr * S, by = cy - dy * yr * S;
        ctx.fillStyle = "#ffb366"; ctx.shadowColor = "#ffb366"; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(bx, by, 6, 0, 6.2832); ctx.fill(); ctx.shadowBlur = 0;
        ctx.restore();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + 70, cy + 112); ctx.lineTo(cx + 110, cy + 112); ctx.stroke();
        K.t(ctx, "20″", cx + 90, cy + 106, { s: 11, w: "800", a: "center", c: "#fff" });
        K.t(ctx, "북 ↑  동 ←", cx - 122, cy - 106, { s: 11, w: "800", c: "#dfe6ff" });
        K.t(ctx, "점: 1년 간격", cx - 122, cy + 116, { s: 10.5, w: "700", c: "#ffcf9e" });
        K.bigText(ctx, (2016 + yr) + "년 · v_t " + vt.toFixed(0) + " · v " + vs.toFixed(0) + " km/s", 16, 38, 21, "#ffffff");
        card(ctx, 690, W, cv.H, "버너드별 · 가이아 DR3", [
          ["연주 시차", ST.plx.toFixed(1) + " mas", LT.blue], ["고유 운동 μ", MU.toFixed(2) + " ″/년", LT.orange], ["시선 속도", ST.rv.toFixed(1) + " km/s", LT.violet],
          ["겉보기 등급(G)", ST.g.toFixed(1)], ["내 답: 접선 속도", vt.toFixed(0) + " km/s", LT.blue], ["내 답: 공간 속도", vs.toFixed(0) + " km/s", LT.blue]
        ], "d(pc) = 1 ÷ 시차(″)", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "연도(가이아 기준 시각 2016년부터)", min: -5, max: 5, step: 1, value: 0, fmt: function (x) { return (2016 + x) + "년"; }, onInput: function (x) { yr = x; draw(); } });
      api.slider({ label: "① 접선 속도", min: 0, max: 200, step: 1, value: 40, fmt: function (x) { return x + " km/s"; }, onInput: function (x) { vt = x; api.changed(); draw(); } });
      api.slider({ label: "② 공간 속도", min: 0, max: 250, step: 1, value: 80, fmt: function (x) { return x + " km/s"; }, onInput: function (x) { vs = x; api.changed(); draw(); } });
      api.info("1 mas(밀리초)는 1/1000″입니다. 고유 운동 μ는 적경 방향 " + (ST.pmra / 1000).toFixed(2) + "″/년과 적위 방향 " + (ST.pmde / 1000).toFixed(2) + "″/년을 합친 값입니다. 시선 속도가 음수이면 우리에게 다가오는 중입니다. 배경 별은 둘레 60″ 안에서 가이아가 잰 실제 별들입니다. "
        + src("유럽 우주국(ESA) 가이아 3차 자료(Gaia DR3), CDS VizieR I/355/gaiadr3 — 버너드별과 둘레 60″ 안 별들, 위치 기준 시각 2016.0"));
      draw();
      return {
        judge: function () {
          var okT = Math.abs(vt - VT) <= 5, okS = Math.abs(vs - VS) <= 6;
          if (okT && okS) return { ok: true, msg: "d = 1 ÷ " + (ST.plx / 1000).toFixed(4) + "″ ≈ " + DPC.toFixed(2) + " pc, v_t = 4.74 × " + MU.toFixed(2) + " × " + DPC.toFixed(2) + " ≈ " + VT.toFixed(0) + " km/s, v = √(" + VT.toFixed(0) + "² + " + Math.abs(ST.rv).toFixed(0) + "²) ≈ " + VS.toFixed(0) + " km/s." };
          if (!okT) return { ok: false, msg: "접선 속도 " + vt + " km/s는 " + (vt < VT ? "작습니다" : "큽니다") + ". 먼저 시차 " + ST.plx.toFixed(1) + " mas = " + (ST.plx / 1000).toFixed(4) + "″ 로 거리(pc)를 구하고, 4.74 × μ × d 를 계산하세요." };
          return { ok: false, msg: "접선 속도는 맞았습니다. 공간 속도 " + vs + " km/s는 " + (vs < VS ? "작습니다" : "큽니다") + ". 접선 속도와 시선 속도(부호는 빼고)를 직각삼각형의 두 변으로 놓으세요." };
        }
      };
    },
    hints: ["시차 0.547″ → 거리 약 1.83 pc. 4.74 × 10.39 × 1.83 ≈ 90 km/s.", "√(90² + 110²) ≈ 142 km/s."],
    solution: "거리 약 " + DPC.toFixed(2) + " pc, 접선 속도 약 <b>" + VT.toFixed(0) + " km/s</b>, 공간 속도 약 <b>" + VS.toFixed(0) + " km/s</b>.",
    why: "고유 운동은 ‘하늘에서 보이는 각속도’여서, 같은 속력이라도 가까운 별일수록 크게 보입니다. 버너드별은 태양에서 두 번째로 가까운 별 무리(알파 센타우리 다음, 약 6광년)일 뿐 아니라, 공간 속도도 약 " + VS.toFixed(0) + " km/s로 태양 둘레 별들의 보통 빠르기(수십 km/s)보다 빠릅니다. 그래서 1년에 " + MU.toFixed(1) + "″, 180년이면 보름달 지름(약 30′)만큼 하늘을 가로지릅니다.<br>"
      + "고유 운동과 시차만으로는 하늘면을 따라가는 접선 속도만 알 수 있고, 우리 쪽으로 다가오거나 멀어지는 시선 속도는 스펙트럼선의 도플러 이동으로 따로 잽니다. 버너드별은 지금 다가오고 있어, 약 1만 년 뒤에는 거리가 약 1.2 pc까지 가까워졌다가 다시 멀어질 것으로 계산됩니다."
  },
  {
    id: "o3", tag: "실제 자료 · 변광성", title: "세페이드로 잰 소마젤란은하까지의 거리", short: "세페이드 거리",
    kind: "obs calc", kindPos: "tr",
    who: "🌌", name: "OGLE 변광성 탐사팀",
    say: "“폴란드 바르샤바 대학의 OGLE 탐사가 찾은 <b>대마젤란은하(파랑) 세페이드 " + LM.length.toLocaleString() + "개</b>와 <b>소마젤란은하(주황) " + SM.length.toLocaleString() + "개</b>입니다. 주기가 길수록 밝은 주기-광도 관계가 보이지요? 한 은하의 별들은 거의 같은 거리에 있으니, 두 무리의 <b>밝기 차</b>가 곧 거리 차입니다. 대마젤란은하까지 49.6 kpc(식쌍성으로 잰 값)를 잣대로, 소마젤란은하까지의 거리를 구해 주세요.”",
    predict: {
      q: "주기가 같은 세페이드라면, 더 멀리 있는 은하의 것은 어떻게 보일까요?",
      options: ["㉠ 더 밝게 보인다", "㉡ 더 어둡게 보인다", "㉢ 거리와 관계없이 같은 밝기로 보인다"],
      answer: 1
    },
    task: "밝기를 <b>티끌 보정 밝기 W</b>로 바꾼 뒤, ① 슬라이더로 주황 점들을 위로 옮겨 파란 띠와 <b>겹치게</b> 하세요(옮긴 양 = 등급 차 Δm, ± 0.06). ② 거리 비 10^(Δm/5)로 <b>소마젤란은하까지 거리</b>를 구하세요(± 2.5 kpc).",
    build: function (stage, api) {
      var cv = api.canvas(320), ctx = cv.ctx, W = cv.W, mode = "I", dm = 0, d = 50;
      function draw() {
        var j = mode === "I" ? 1 : 2, F = mode === "I" ? FI : FW;
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var y0 = mode === "I" ? 18 : 17, y1 = mode === "I" ? 11 : 9;
        var g = K.chart(ctx, { x: 4, y: 52, w: 676, h: cv.H - 56, pl: 48, x0: 0.4, x1: 2.0, y0: y0, y1: y1, xt: 8, yt: y0 - y1, light: true,
          xf: function (x) { return Math.pow(10, x).toFixed(x < 1 ? 1 : 0) + "일"; }, yf: function (y) { return y.toFixed(0) + "등급"; } });
        ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
        ctx.fillStyle = "rgba(232,89,12,.38)"; SM.forEach(function (r) { ctx.fillRect(g.X(r[0]) - 1.2, g.Y(r[j] - dm) - 1.2, 2.4, 2.4); });
        ctx.fillStyle = "rgba(28,126,214,.38)"; LM.forEach(function (r) { ctx.fillRect(g.X(r[0]) - 1.2, g.Y(r[j]) - 1.2, 2.4, 2.4); });
        ctx.restore();
        K.plot(ctx, g, [[0.4, F[0] * 0.4 + F[1]], [2.0, F[0] * 2.0 + F[1]]], LT.blue, { light: true, w: 2 });
        K.t(ctx, "가로: 변광 주기(로그 눈금)  세로: 평균 " + (mode === "I" ? "I 등급" : "W 등급(티끌 보정)") + "(위가 밝음)", g.L + 6, g.T + 14, { s: 11, w: "800", c: LT.mute });
        K.bigText(ctx, "Δm " + dm.toFixed(2) + " · 소마젤란 " + d.toFixed(1) + " kpc", 16, 38, 22, "#ffffff");
        card(ctx, 690, W, cv.H, "OGLE-III 세페이드", [
          ["밝기", mode === "I" ? "I 등급" : "W(티끌 보정)", LT.mute], ["대마젤란 직선 기울기", F[0].toFixed(2), LT.blue], ["옮긴 양 Δm", dm.toFixed(2) + " 등급", LT.orange],
          ["거리 비 10^(Δm/5)", Math.pow(10, dm / 5).toFixed(3)], ["대마젤란은하", D_LMC + " kpc"], ["내 답: 소마젤란", d.toFixed(1) + " kpc", LT.blue]
        ], "5등급 차 = 거리 10배", null);
      }
      cv.canvas._redraw = draw;
      api.seg({ label: "밝기 종류", value: "I", options: [{ v: "I", t: "I 등급(관측 그대로)" }, { v: "W", t: "W(티끌 보정 밝기)" }], onPick: function (x) { mode = x; api.changed(); draw(); } });
      api.slider({ label: "① 주황 점 위로 옮기기(등급 차 Δm)", min: 0, max: 1.2, step: 0.01, value: 0, fmt: function (x) { return x.toFixed(2) + " 등급"; }, onInput: function (x) { dm = x; api.changed(); draw(); } });
      api.slider({ label: "② 소마젤란은하까지 거리", min: 30, max: 90, step: 0.5, value: 50, fmt: function (x) { return x.toFixed(1) + " kpc"; }, onInput: function (x) { d = x; api.changed(); draw(); } });
      api.info("W = I − 1.55 × (V − I). 성간 티끌은 별빛을 어둡게 하면서 붉게도 만드는데, 그 붉어진 정도(V − I 색)로 어두워진 양을 거꾸로 빼 준 밝기입니다. 두 은하는 앞뒤 두께가 있고 티끌의 양도 달라, I 등급만 쓰면 거리 비가 어긋납니다. 대마젤란은하 거리 49.6 kpc는 식쌍성 20개로 잰 값(Pietrzyński 외 2019)입니다. "
        + src("폴란드 바르샤바 대학 천문대 OGLE-III 변광성 목록(Soszyński 외 2008·2010), 대·소마젤란은하 기본 모드 고전 세페이드(주기 2.5일 이상)의 평균 I·V 등급과 주기"));
      draw();
      return {
        judge: function () {
          var okM = mode === "W" && Math.abs(dm - DW) <= 0.06 + 1e-9, okD = Math.abs(d - D_SMC) <= 2.5 + 1e-9;
          if (okM && okD) return { ok: true, msg: "W로 맞춘 등급 차 약 " + DW.toFixed(2) + " → 거리 비 10^(" + DW.toFixed(2) + "/5) ≈ " + Math.pow(10, DW / 5).toFixed(2) + " → " + D_LMC + " × " + Math.pow(10, DW / 5).toFixed(2) + " ≈ " + D_SMC.toFixed(1) + " kpc. (I 등급만 쓰면 Δm ≈ " + DI.toFixed(2) + ", " + D_SMC_I.toFixed(1) + " kpc로 짧게 나옵니다.)" };
          if (mode !== "W") return { ok: false, msg: "지금은 관측 그대로의 I 등급입니다. 두 은하의 티끌 양이 달라 거리 비가 어긋나므로 ‘W(티끌 보정 밝기)’로 바꾸어 맞추세요." };
          if (!okM) return { ok: false, msg: "Δm " + dm.toFixed(2) + "는 " + (dm < DW ? "모자랍니다. 주황 띠가 아직 파란 띠보다 아래(어둡게)에 있어요." : "지나칩니다. 주황 띠가 파란 띠보다 위로 올라갔어요.") };
          return { ok: false, msg: "등급 차는 맞았습니다. 거리 " + d.toFixed(1) + " kpc는 " + (d < D_SMC ? "가깝습니다" : "멉니다") + ". 49.6 × 10^(Δm/5)를 계산하세요(카드의 거리 비를 곱하면 됩니다)." };
        }
      };
    },
    hints: ["W로 바꾸면 주황 띠가 파란 띠보다 0.5등급쯤 아래에 있습니다. 두 띠의 한가운데 선이 겹치게 옮기세요.", "Δm = 0.5라면 10^0.1 ≈ 1.26 → 49.6 × 1.26 ≈ 62 kpc."],
    solution: "등급 차 약 <b>" + DW.toFixed(2) + "</b>(W), 소마젤란은하까지 약 <b>" + D_SMC.toFixed(0) + " kpc</b>(약 20만 광년).",
    why: "세페이드 변광성은 주기가 길수록 실제로 더 밝습니다(주기-광도 관계). 그래서 주기만 재면 진짜 밝기를 알 수 있고, 겉보기 밝기와 견주어 거리를 구합니다. 1912년 리비트가 바로 이 소마젤란은하의 세페이드에서 이 관계를 처음 찾아냈습니다. 두 은하의 띠는 기울기가 같고 위아래로만 어긋나 있는데, 그 차이 " + DW.toFixed(2) + "등급이 거리 차입니다. 겉보기 밝기는 거리의 제곱에 반비례하므로 m₁ − m₂ = 5 log(d₁/d₂)입니다.<br>"
      + "이렇게 구한 약 " + D_SMC.toFixed(0) + " kpc는 다른 방법으로 잰 값(약 62 kpc)과 잘 맞습니다. 다만 성간 티끌을 보정하지 않은 I 등급으로는 " + D_SMC_I.toFixed(0) + " kpc쯤으로 짧게 나와, 거리 측정에서 티끌 보정이 얼마나 중요한지 보여 줍니다. 세페이드는 이렇게 가까운 은하의 거리를 정해, 더 먼 은하의 거리를 재는 Ia형 초신성의 밝기를 보정하는 ‘거리 사다리’의 디딤돌이 됩니다."
  }
  ]
});
})();
