/* 행성우주과학2 Ⅱ-2 은하와 우주 — '실제 자료' 탭 (2026-11-27)
   o1 함께 움직이는 별 찾기 — 가이아 DR3 고유 운동으로 플레이아데스 성단 구성원을 골라 평균 시차로 거리
   o2 보이는 물질만으로는 모자란 은하 — SPARC 회전 곡선(NGC 3198)으로 은하 질량과 보이는 질량 비교
   o3 은하가 만든 거대한 벽 — SDSS 적도 띠 은하 4,982개의 적색 편이 지도에서 거대 구조 찾기
   자료: data/obs-pleiades.js (ESA Gaia DR3, CDS VizieR), data/obs-rotation.js (SPARC, Lelli 외 2016), data/obs-sdss.js (SDSS DR18) — 받은 날 2026-11-27
   이야기 탭 안의 '📊 실제 자료'(real-cases.js, Pantheon+ 초신성 허블 상수·우주 나이)와 겹치지 않는 자료만 쓴다. */
(function () {
"use strict";
var K = window.sthKit, LT = K.LT;
var PL = (window.OBS_PLEI || { rows: [] }).rows;
var RO = window.OBS_ROT || { rows: [], L36: 38.3, MHI: 10.9, dist: 13.8, name: "NGC 3198" };
var SD = window.OBS_SDSS || { g: [], n: 0 };

function card(ctx, x, W, CH, title, rows, tip, good) {
  K.card(ctx, x, 8, W - x - 8, CH - 16, null);
  K.t(ctx, title, x + 16, 50, { s: 12, w: "800", c: LT.mute });
  rows.forEach(function (r, i) { K.row(ctx, r[0], r[1], x + 16, W - 24, 80 + i * 27, r[2]); });
  if (tip) K.tip(ctx, tip, x + 12, CH - 56, W - x - 32, good);
}
function vline(ctx, g, x, col, dash) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash(dash || [5, 4]);
  ctx.beginPath(); ctx.moveTo(g.X(x), g.T); ctx.lineTo(g.X(x), g.B); ctx.stroke(); ctx.restore();
}
function src(s) { return "<small>출처: " + s + " · 받은 날 2026-11-27 · 사본은 이 단원의 data/ 폴더.</small>"; }

/* ---- o1 계산값: 고유 운동 덩어리의 중심을 자료에서 찾는다(반지름 6 mas/yr 안 별이 가장 많은 곳) ---- */
var RAD = 6;
function sel(cx, cy) { return PL.filter(function (r) { return Math.hypot(r[1] - cx, r[2] - cy) < RAD; }); }
var CEN = (function () { var b = [20, -45], bn = -1; for (var x = -30; x <= 50; x += 1) for (var y = -70; y <= 20; y += 1) { var n = sel(x, y).length; if (n > bn) { bn = n; b = [x, y]; } } return b; })();
var MEM = sel(CEN[0], CEN[1]);
var PLX = MEM.length ? MEM.reduce(function (s, r) { return s + r[0]; }, 0) / MEM.length : 7.4, DIST = 1000 / PLX;

/* ---- o2 계산값 ---- */
var G = 4.30091e-6;                                            /* kpc (km/s)² / M☉ */
var RR = RO.rows, LAST = RR.length ? RR[RR.length - 1] : [44, 149, 3, 0, 0];
function vbar(r) { return Math.sqrt(Math.max(0, r[3] * Math.abs(r[3]) + 0.5 * r[4] * r[4])); }
var MDYN = LAST[1] * LAST[1] * LAST[0] / G / 1e10;             /* 10¹⁰ M☉ */
var MVIS = (0.5 * RO.L36 + 1.33 * RO.MHI) / 10;                /* 10¹⁰ M☉ */
var RATIO = MDYN / MVIS;

/* ---- o3 계산값 ---- */
var GL = []; for (var i = 0; i + 1 < SD.g.length; i += 2) GL.push([SD.g[i] / 10, SD.g[i + 1] / 1e4]);
function band(z, w) { return GL.filter(function (q) { return q[0] >= 150 && q[0] <= 220 && Math.abs(q[1] - z) <= w; }).length; }
var ZW = (function () { var b = 0.08, bn = -1; for (var z = 0.07; z <= 0.09 + 1e-9; z += 0.001) { var n = band(z, 0.0025); if (n > bn) { bn = n; b = z; } } return Math.round(b * 1000) / 1000; })();
var H0 = 70, C = 299792.458, DW = C * ZW / H0;

window.sthLab({
  mount: "obs", key: "obs", result: "rObs", label: "실제 자료",
  doneNote: "정리하기 탭에서, 실제 관측값이 이야기 속 생각(성단까지의 거리, 암흑 물질, 우주의 거대 구조)과 어디까지 맞았는지 한 문장으로 적어 보세요.",
  cases: [
  {
    id: "o1", tag: "실제 자료 · 성단", title: "함께 움직이는 별 찾기", short: "플레이아데스 거리",
    kind: "obs calc", kindPos: "tr",
    who: "✨", name: "성단 탐사팀",
    say: "“가을밤의 좀생이별, <b>플레이아데스 성단</b> 둘레 반지름 1.5° 안에서 가이아 위성이 잰 별 <b>" + PL.length + "개</b>입니다. 이 가운데에는 성단 별도 있고, 우연히 같은 방향에 보이는 앞뒤의 별도 섞여 있어요. 성단 별은 함께 태어나 <b>함께 움직이므로</b> 고유 운동이 거의 같습니다. 왼쪽 그림에서 별들이 뭉친 곳을 골라 성단 별만 모으고, 평균 연주 시차로 거리를 구해 주세요.”",
    predict: {
      q: "같은 성단에 속한 별들은 하늘에서 어떻게 움직일까요?",
      options: ["㉠ 저마다 다른 방향으로 움직인다", "㉡ 거의 같은 방향·같은 빠르기로 함께 움직인다", "㉢ 성단 별은 움직이지 않는다"],
      answer: 1
    },
    task: "① 두 슬라이더로 빨간 원을 <b>별이 뭉친 곳</b>에 옮기세요(원 안 별이 가장 많아지게). ② 원 안 별들의 <b>평균 연주 시차</b>로 성단까지의 거리를 구하세요(± 5 pc, d(pc) = 1000 ÷ 시차(mas)).",
    build: function (stage, api) {
      var cv = api.canvas(320), ctx = cv.ctx, W = cv.W, cx = 0, cy = -20, d = 100;
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var g = K.chart(ctx, { x: 4, y: 52, w: 390, h: cv.H - 56, pl: 48, x0: -40, x1: 60, y0: -80, y1: 20, xt: 5, yt: 5, light: true, xl: "적경 방향 고유 운동",
          xf: function (x) { return x.toFixed(0); }, yf: function (y) { return y.toFixed(0); } });
        var S = sel(cx, cy);
        ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip();
        PL.forEach(function (r) { var inn = Math.hypot(r[1] - cx, r[2] - cy) < RAD; ctx.fillStyle = inn ? "rgba(224,49,49,.85)" : "rgba(28,126,214,.4)"; ctx.beginPath(); ctx.arc(g.X(r[1]), g.Y(r[2]), inn ? 2.6 : 2, 0, 6.2832); ctx.fill(); });
        ctx.strokeStyle = LT.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(g.X(cx), g.Y(cy), RAD * (g.R - g.L) / 100, RAD * (g.B - g.T) / 100, 0, 0, 6.2832); ctx.stroke();
        ctx.restore();
        K.t(ctx, "단위 mas/년", g.L + 6, g.T + 14, { s: 10.5, w: "800", c: LT.mute });
        /* 가운데: 고른 별의 색-등급도 */
        var h = K.chart(ctx, { x: 400, y: 52, w: 282, h: cv.H - 56, pl: 40, x0: -0.2, x1: 2.6, y0: 13.2, y1: 2.5, xt: 4, yt: 5, light: true, xl: "BP−RP 색",
          xf: function (x) { return x.toFixed(1); }, yf: function (y) { return y.toFixed(0); } });
        ctx.fillStyle = "rgba(160,170,190,.35)"; PL.forEach(function (r) { ctx.beginPath(); ctx.arc(h.X(r[4]), h.Y(r[3]), 1.6, 0, 6.2832); ctx.fill(); });
        ctx.fillStyle = LT.red; S.forEach(function (r) { ctx.beginPath(); ctx.arc(h.X(r[4]), h.Y(r[3]), 2.4, 0, 6.2832); ctx.fill(); });
        K.t(ctx, "고른 별의 색-등급도(G 등급)", h.L + 6, h.T + 14, { s: 10.5, w: "800", c: LT.mute });
        var px = S.length ? S.reduce(function (s, r) { return s + r[0]; }, 0) / S.length : 0;
        K.bigText(ctx, "고른 별 " + S.length + "개 · 거리 " + d + " pc?", 16, 38, 22, "#ffffff");
        card(ctx, 690, W, cv.H, "가이아 DR3 · 플레이아데스", [
          ["원 중심 · 적경", cx + " mas/년"], ["원 중심 · 적위", cy + " mas/년"], ["원 안 별", S.length + " 개", LT.red],
          ["평균 연주 시차", S.length ? px.toFixed(2) + " mas" : "–", LT.blue], ["내 답: 거리", d + " pc", LT.blue]
        ], "d(pc) = 1000 ÷ 시차(mas)", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "① 원 중심 — 적경 방향 고유 운동", min: -30, max: 50, step: 1, value: 0, fmt: function (x) { return x + " mas/년"; }, onInput: function (x) { cx = x; api.changed(); draw(); } });
      api.slider({ label: "① 원 중심 — 적위 방향 고유 운동", min: -70, max: 20, step: 1, value: -20, fmt: function (x) { return x + " mas/년"; }, onInput: function (x) { cy = x; api.changed(); draw(); } });
      api.slider({ label: "② 성단까지의 거리", min: 50, max: 300, step: 1, value: 100, fmt: function (x) { return x + " pc"; }, onInput: function (x) { d = x; api.changed(); draw(); } });
      api.info("빨간 원의 반지름은 6 mas/년입니다. 성단 별을 잘 골랐다면 오른쪽 색-등급도에서 빨간 점들이 깔끔한 한 줄(주계열)로 늘어섭니다. 섞여 있던 다른 별들은 거리가 제각각이라 색-등급도에서 흩어집니다. "
        + src("유럽 우주국(ESA) 가이아 3차 자료(Gaia DR3), CDS VizieR I/355/gaiadr3 — 플레이아데스 중심 1.5° 안, G < 13 등급, 시차 > 2 mas"));
      draw();
      return {
        judge: function () {
          var S = sel(cx, cy), okC = Math.hypot(cx - CEN[0], cy - CEN[1]) <= 3, okD = Math.abs(d - DIST) <= 5;
          if (okC && okD) return { ok: true, msg: "별이 뭉친 곳은 고유 운동 (" + CEN[0] + ", " + CEN[1] + ") mas/년 근처, 원 안 " + MEM.length + "개의 평균 시차 " + PLX.toFixed(2) + " mas → 거리 약 " + DIST.toFixed(0) + " pc(약 " + (DIST * 3.26).toFixed(0) + "광년)." };
          if (!okC) return { ok: false, msg: "원 안 별이 " + S.length + "개입니다. 왼쪽 그림에서 점들이 빽빽하게 뭉친 작은 덩어리를 찾아 원을 옮기세요(오른쪽 아래쪽입니다)." };
          return { ok: false, msg: "성단 별은 잘 골랐습니다. 거리 " + d + " pc는 " + (d < DIST ? "가깝습니다" : "멉니다") + ". 카드의 평균 시차(mas)로 1000을 나누세요." };
        }
      };
    },
    hints: ["덩어리는 적경 방향 +20, 적위 방향 −45 mas/년 근처에 있습니다.", "평균 시차가 7.4 mas라면 1000 ÷ 7.4 ≈ 135 pc."],
    solution: "성단 별은 고유 운동 약 (" + CEN[0] + ", " + CEN[1] + ") mas/년에 모여 있고, 평균 시차 " + PLX.toFixed(2) + " mas → 거리 약 <b>" + DIST.toFixed(0) + " pc</b>.",
    why: "성단의 별들은 같은 가스 구름에서 함께 태어나 지금도 거의 같은 속도로 함께 움직입니다. 그래서 고유 운동 그림에서 한곳에 뭉치고, 이 덩어리만 골라내면 우연히 같은 방향에 보이는 앞뒤 별을 걸러 낼 수 있습니다. 골라낸 별들은 거리가 같아 색-등급도에서 또렷한 주계열을 이룹니다.<br>"
      + "별 하나의 시차에는 오차가 있지만, 같은 거리에 있는 별 " + MEM.length + "개를 평균하면 거리를 훨씬 정확하게 정할 수 있습니다. 가이아로 얻은 약 " + DIST.toFixed(0) + " pc는 다른 방법으로 잰 값과도 잘 맞습니다. 이렇게 거리를 아는 성단의 주계열은 더 먼 성단의 거리를 재는 잣대(주계열 맞추기)가 됩니다."
  },
  {
    id: "o2", tag: "실제 자료 · 암흑 물질", title: "보이는 물질만으로는 모자란 은하", short: "은하 회전 곡선",
    kind: "obs calc", kindPos: "tr",
    who: "🌀", name: "전파 천문대 연구원",
    say: "“약 " + RO.dist.toFixed(1) + " Mpc 떨어진 나선 은하 <b>" + RO.name + "</b>의 회전 곡선입니다. 점은 중성 수소 기체의 전파(21 cm선)와 빛의 도플러 이동으로 잰 <b>실제 회전 속도</b>, 회색 선은 사진에 보이는 별과 기체만으로 계산한 <b>보이는 물질의 회전 속도</b>예요. 가장 바깥 관측점의 속도로 그 안에 든 <b>전체 질량</b>을 구해, 보이는 질량과 견주어 주세요.”",
    predict: {
      q: "나선 은하의 바깥쪽으로 갈수록 회전 속도는 어떻게 될까요?",
      options: ["㉠ 태양계 행성처럼 바깥으로 갈수록 느려진다", "㉡ 바깥까지 거의 일정하게 유지된다", "㉢ 바깥으로 갈수록 계속 빨라진다"],
      answer: 1
    },
    task: "① 반지름 슬라이더를 가장 바깥 점에 놓고, M = v²r ÷ G 로 그 안의 <b>전체 질량</b>을 구해 맞추세요(10¹⁰ M☉ 단위, ± 2.5, G = 4.30 × 10⁻⁶ kpc·(km/s)²/M☉). ② 전체 질량이 <b>보이는 질량</b>의 약 몇 배인지 고르세요.",
    build: function (stage, api) {
      var cv = api.canvas(310), ctx = cv.ctx, W = cv.W, k = 10, m = 5, pick = "";
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        var g = K.chart(ctx, { x: 4, y: 52, w: 676, h: cv.H - 56, pl: 56, x0: 0, x1: 45, y0: 0, y1: 180, xt: 9, yt: 6, light: true,
          xf: function (x) { return x.toFixed(0) + " kpc"; }, yf: function (y) { return y.toFixed(0) + " km/s"; } });
        K.plot(ctx, g, RR.map(function (r) { return [r[0], vbar(r)]; }), LT.mute, { light: true, w: 2.4, dash: [6, 4], glow: false });
        /* 보이는 질량이 모두 안쪽에 있다면(케플러 감소) */
        var r0 = 10, v0 = vbar(RR.filter(function (r) { return r[0] >= r0; })[0] || [10, 0, 0, 0, 130]);
        K.plot(ctx, g, [10, 15, 20, 25, 30, 35, 40, 45].map(function (r) { return [r, v0 * Math.sqrt(r0 / r)]; }), "rgba(92,112,134,.45)", { light: true, w: 1.4, dash: [2, 4], glow: false });
        RR.forEach(function (r) {
          ctx.strokeStyle = "rgba(28,126,214,.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(g.X(r[0]), g.Y(r[1] - r[2])); ctx.lineTo(g.X(r[0]), g.Y(r[1] + r[2])); ctx.stroke();
          ctx.fillStyle = LT.blue; ctx.beginPath(); ctx.arc(g.X(r[0]), g.Y(r[1]), 3.2, 0, 6.2832); ctx.fill();
        });
        var r = RR[k];
        vline(ctx, g, r[0], LT.red);
        K.t(ctx, "● 관측  - - 보이는 별·기체  ··· 질량이 안쪽에만 있다면", g.R - 4, g.B - 10, { s: 10.5, w: "800", a: "right", c: LT.mute });
        var mr = r[1] * r[1] * r[0] / G / 1e10;
        K.bigText(ctx, "r " + r[0].toFixed(1) + " kpc · v " + r[1].toFixed(0) + " km/s", 16, 38, 22, "#ffffff");
        card(ctx, 690, W, cv.H, RO.name + " · SPARC", [
          ["반지름 r", r[0].toFixed(1) + " kpc"], ["관측 속도 v", r[1].toFixed(0) + " km/s", LT.blue], ["보이는 물질 속도", vbar(r).toFixed(0) + " km/s", LT.mute],
          ["보이는 질량", MVIS.toFixed(1) + "×10¹⁰ M☉", LT.mute], ["내 답: 질량", m.toFixed(1) + "×10¹⁰ M☉", LT.blue], ["내 답: 몇 배", pick || "–", LT.blue]
        ], "M = v²r ÷ G", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "반지름(관측점 고르기)", min: 0, max: RR.length - 1, step: 1, value: 10, fmt: function (x) { return RR[x] ? RR[x][0].toFixed(1) + " kpc" : ""; }, onInput: function (x) { k = x; draw(); } });
      api.slider({ label: "① 가장 바깥 반지름 안의 전체 질량", min: 1, max: 60, step: 0.5, value: 5, fmt: function (x) { return x.toFixed(1) + " ×10¹⁰ M☉"; }, onInput: function (x) { m = x; api.changed(); draw(); } });
      api.seg({ label: "② 전체 질량 ÷ 보이는 질량", value: "", options: [{ v: "약 1배", t: "약 1배" }, { v: "약 2배", t: "약 2배" }, { v: "약 7배", t: "약 7배" }], onPick: function (x) { pick = x; api.changed(); draw(); } });
      api.info("보이는 질량은 별(3.6 μm 적외선 광도 " + RO.L36.toFixed(1) + " × 10⁹ L☉ × 질량-광도비 0.5)과 기체(중성 수소 " + RO.MHI.toFixed(1) + " × 10⁹ M☉ × 1.33, 헬륨 포함)를 더한 약 " + MVIS.toFixed(1) + " × 10¹⁰ M☉입니다. 질량-광도비 0.5는 이 자료를 만든 연구진이 흔히 쓰는 값입니다. M = v²r/G 는 질량이 공 모양으로 퍼져 있다고 본 어림입니다. "
        + src("SPARC 은하 회전 곡선 자료(Lelli, McGaugh & Schombert 2016, AJ 152, 157), CDS VizieR J/AJ/152/157 — NGC 3198"));
      draw();
      return {
        judge: function () {
          var okM = Math.abs(m - MDYN) <= 2.5 + 1e-9, okP = pick === "약 7배";
          if (okM && okP) return { ok: true, msg: "r = " + LAST[0].toFixed(1) + " kpc, v = " + LAST[1] + " km/s → M = " + LAST[1] + "² × " + LAST[0].toFixed(1) + " ÷ (4.30 × 10⁻⁶) ≈ " + MDYN.toFixed(1) + " × 10¹⁰ M☉. 보이는 질량 " + MVIS.toFixed(1) + " × 10¹⁰ M☉의 약 " + RATIO.toFixed(1) + "배." };
          if (!okM) return { ok: false, msg: "전체 질량 " + m.toFixed(1) + "은 " + (m < MDYN ? "작습니다" : "큽니다") + ". 슬라이더를 가장 바깥 점(" + LAST[0].toFixed(1) + " kpc)에 놓고 v × v × r ÷ 0.0000043을 계산한 뒤 10¹⁰으로 나누세요." };
          return { ok: false, msg: "전체 질량은 맞았습니다. 그것을 카드의 ‘보이는 질량’으로 나누면 몇 배인가요?" };
        }
      };
    },
    hints: ["가장 바깥 점은 약 44 kpc, 149 km/s입니다.", "149² × 44 ≈ 977,000 → ÷ 0.0000043 ≈ 2.3 × 10¹¹ = 23 × 10¹⁰ M☉."],
    solution: "가장 바깥(" + LAST[0].toFixed(1) + " kpc) 안의 전체 질량 약 <b>" + MDYN.toFixed(0) + " × 10¹⁰ M☉</b>, 보이는 질량의 약 <b>" + RATIO.toFixed(0) + "배</b>.",
    why: "질량이 대부분 은하 중심 쪽에 모여 있다면, 태양계 행성처럼 바깥으로 갈수록 회전 속도가 줄어야 합니다(점선). 그런데 NGC 3198의 회전 속도는 별빛이 거의 사라진 40 kpc 바깥까지 약 150 km/s로 평평하게 유지됩니다. 회전 속도가 일정하면 M = v²r/G 에서 질량이 반지름에 비례해 계속 늘어난다는 뜻이에요.<br>"
      + "보이는 별과 기체로는 전체의 약 1/" + RATIO.toFixed(0) + "만 설명되므로, 나머지는 빛을 내지 않고 중력으로만 존재를 드러내는 <b>암흑 물질</b>이 은하를 둥글게 감싸고 있다고 봅니다(암흑 물질 헤일로). 1970년대 루빈 등의 관측과, NGC 3198 같은 은하의 21 cm 전파 관측이 이 생각을 굳혔습니다. 질량-광도비를 조금 바꿔도 바깥쪽의 모자람은 없어지지 않습니다."
  },
  {
    id: "o3", tag: "실제 자료 · 우주 거대 구조", title: "은하가 만든 거대한 벽", short: "적색 편이 지도",
    kind: "obs calc", kindPos: "tr",
    who: "🗺️", name: "적색 편이 탐사단",
    say: "“슬론 디지털 전천 탐사(SDSS)가 스펙트럼을 찍은 은하 가운데, 하늘의 적도를 따라 폭 0.8°의 가느다란 띠에 있는 <b>" + GL.length.toLocaleString() + "개</b>입니다. 부채꼴의 꼭짓점이 우리은하, 방향은 하늘의 위치(적경), 꼭짓점에서의 거리는 <b>적색 편이 z</b>예요. 은하들이 고르게 퍼져 있나요? 가장 빽빽한 <b>벽</b>을 찾아 그 거리를 구해 주세요.”",
    predict: {
      q: "수억 광년 규모로 보면, 은하들은 우주 공간에 어떻게 퍼져 있을까요?",
      options: ["㉠ 어디나 고르게 퍼져 있다", "㉡ 벽·실처럼 모인 곳과 텅 빈 거품(보이드)이 얽혀 있다", "㉢ 우리은하를 중심으로 동심원을 이룬다"],
      answer: 1
    },
    task: "① 적색 편이 슬라이더로 빨간 호를 움직여, 적경 150°~220°·적색 편이 0.07~0.09 사이에서 은하가 <b>가장 빽빽하게 이어진 벽</b>에 맞추세요(± 0.006). ② 허블 법칙 d = cz ÷ H₀ (c = 300,000 km/s, H₀ = 70 km/s/Mpc)로 그 벽까지의 <b>거리</b>를 구하세요(± 25 Mpc).",
    build: function (stage, api) {
      var cv = api.canvas(330), ctx = cv.ctx, W = cv.W, z = 0.03, d = 100;
      var OX = 342, OY = cv.H - 10, RMAX = 250, ZMAX = 0.12;
      function P(ra, zz) { var th = (ra - 185) * Math.PI / 180, r = zz / ZMAX * RMAX; return [OX - r * Math.sin(th), OY - r * Math.cos(th)]; }
      function arc(zz, col, w, a0, a1) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (var ra = a0; ra <= a1 + 1e-9; ra += 1) { var p = P(ra, zz); if (ra === a0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); } ctx.stroke(); }
      function draw() {
        ctx.clearRect(0, 0, W, cv.H); K.studio(ctx, 0, 0, W, cv.H);
        ctx.fillStyle = "#0f1730"; ctx.beginPath(); ctx.moveTo(OX, OY);
        for (var ra = 120; ra <= 250; ra += 1) { var p = P(ra, ZMAX); ctx.lineTo(p[0], p[1]); } ctx.closePath(); ctx.fill();
        [0.03, 0.06, 0.09, 0.12].forEach(function (zz) { arc(zz, "rgba(160,175,255,.18)", 1, 120, 250); var p = P(250, zz); K.t(ctx, "z " + zz.toFixed(2), p[0] - 4, p[1] + 14, { s: 10, w: "700", c: LT.mute }); });
        [120, 150, 185, 220, 250].forEach(function (ra) { var p = P(ra, ZMAX); K.t(ctx, ra + "°", p[0], p[1] - 4, { s: 10, w: "700", a: "center", c: LT.mute }); });
        ctx.fillStyle = "rgba(255,236,170,.75)";
        GL.forEach(function (q) { var p = P(q[0], q[1]); ctx.fillRect(p[0] - 0.7, p[1] - 0.7, 1.4, 1.4); });
        arc(z, "rgba(255,90,90,.9)", 2.2, 150, 220);
        K.t(ctx, "방향: 적경(도)  꼭짓점에서 거리: 적색 편이 z", 18, cv.H - 14, { s: 10.5, w: "700", c: LT.mute });
        var n = band(z, 0.0025);
        K.bigText(ctx, "z " + z.toFixed(3) + " · 거리 " + d + " Mpc?", 16, 38, 22, "#ffffff");
        card(ctx, 690, W, cv.H, "SDSS 적도 띠 · 은하 " + GL.length.toLocaleString() + "개", [
          ["고른 적색 편이 z", z.toFixed(3), LT.red], ["그 근처(±0.0025) 은하", n + " 개", LT.blue], ["후퇴 속도 cz", Math.round(C * z).toLocaleString() + " km/s"],
          ["H₀", H0 + " km/s/Mpc", LT.mute], ["내 답: 거리", d + " Mpc", LT.blue]
        ], "d = cz ÷ H₀", null);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "① 빨간 호의 적색 편이", min: 0.01, max: 0.12, step: 0.001, value: 0.03, fmt: function (x) { return "z = " + x.toFixed(3); }, onInput: function (x) { z = x; api.changed(); draw(); } });
      api.slider({ label: "② 벽까지의 거리", min: 50, max: 600, step: 5, value: 100, fmt: function (x) { return x + " Mpc"; }, onInput: function (x) { d = x; api.changed(); draw(); } });
      api.info("이 띠는 두께가 0.8°뿐이어서 부채꼴은 우주를 얇게 썬 한 조각입니다. z가 0.1에 가까워지면 너무 어두운 은하는 빠지므로(밝기 r < 17.77등급만) 바깥쪽 점이 점점 성기게 보입니다. 벽의 빽빽함은 같은 거리끼리 비교하세요. "
        + src("슬론 디지털 전천 탐사(SDSS) 18차 자료, SkyServer — 적위 −0.4°~+0.4°, 적경 120°~250°, z 0.005~0.12 본 표본 분광 은하 " + GL.length.toLocaleString() + "개"));
      draw();
      return {
        judge: function () {
          var okZ = Math.abs(z - ZW) <= 0.006 + 1e-9, okD = Math.abs(d - DW) <= 25;
          if (okZ && okD) return { ok: true, msg: "적경 150°~220°에서 은하가 가장 빽빽한 곳은 z ≈ " + ZW.toFixed(3) + "(±0.0025 안에 " + band(ZW, 0.0025) + "개). d = 300,000 × " + ZW.toFixed(3) + " ÷ 70 ≈ " + Math.round(DW) + " Mpc(약 " + (DW * 3.26 / 100).toFixed(0) + "억 광년)." };
          if (!okZ) return { ok: false, msg: "z " + z.toFixed(3) + " 근처에는 은하가 " + band(z, 0.0025) + "개입니다. 호를 움직이며 카드의 개수가 가장 커지는 곳(점들이 띠처럼 이어진 곳)을 찾으세요." };
          return { ok: false, msg: "벽은 잘 찾았습니다. 거리 " + d + " Mpc는 " + (d < DW ? "가깝습니다" : "멉니다") + ". 300,000 × z ÷ 70을 계산하세요." };
        }
      };
    },
    hints: ["z 0.08 안팎, 부채꼴을 거의 가로질러 점들이 띠처럼 길게 이어진 곳을 보세요. 호를 움직이며 카드의 개수가 가장 커지는 곳을 찾으면 됩니다.", "z = 0.08이라면 300,000 × 0.08 ÷ 70 ≈ 343 Mpc."],
    solution: "가장 빽빽한 벽 z ≈ <b>" + ZW.toFixed(3) + "</b>, 거리 약 <b>" + Math.round(DW) + " Mpc</b>.",
    why: "적색 편이 지도를 그리면 은하들은 고르게 퍼져 있지 않고, 벽과 실 모양으로 이어진 곳과 은하가 거의 없는 거대한 빈 공간(보이드)이 거품처럼 얽혀 있습니다. 여기서 찾은 z ≈ " + ZW.toFixed(2) + "의 벽은 SDSS가 발견한 <b>슬론 장성</b>(Sloan Great Wall)의 일부로, 길이가 10억 광년에 이르는 알려진 가장 큰 구조 가운데 하나입니다. 그 조금 바깥(z ≈ 0.095)에도 또 하나의 빽빽한 띠가 보이고, 그 사이사이에는 은하가 드문 빈터가 있습니다. 바깥으로 갈수록 껍질의 부피가 커져 점이 많아 보이는 효과도 있으니, 같은 z 끼리 견주어 보세요.<br>"
      + "이런 거대 구조는 초기 우주의 아주 작은 밀도 차이가 중력으로 수십억 년 동안 자라 생긴 것으로 봅니다. 다만 거리는 적색 편이로 구했으므로, 은하단 안 은하들의 제멋대로 움직임 때문에 지도가 시선 방향으로 조금 늘어나 보이는 효과(‘신의 손가락’)도 함께 들어 있습니다. H₀를 70 대신 73으로 쓰면 거리는 약 4% 짧아집니다."
  }
  ]
});
})();
