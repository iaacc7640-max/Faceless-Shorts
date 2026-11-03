// WHAT IF YOUR AI AGENT HAD A DOZEN HELPERS? : the shot list (Stick Story).
// Source: Claude, "Building agents: When to fold subagents into your main agent loop" (Oct 2026).
// One picture per clause. A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }. cut(i) = just before line i,
// Wd('word', i) = when the word is said. Sound: cue(t, type, { gain, dur }).
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P, GROUND, FLOOR } = K;
const CAPC = [P.red, P.green, P.sofa, P.rug, P.plant, P.wood, P.red, P.sofa, P.green, P.rug, P.wood, P.plant];

// ───────── set pieces for this story ─────────
function office(night) {
  const n = !!night;
  ctx.fillStyle = n ? P.nWall : P.wall; ctx.fillRect(-300, -300, W + 600, FLOOR + 300);
  ctx.fillStyle = n ? P.nWallShade : P.wallShade; ctx.fillRect(-300, FLOOR - 70, W + 600, 70);
  ctx.fillStyle = n ? '#4A4254' : P.base; ctx.fillRect(-300, FLOOR - 20, W + 600, 20);
  ctx.fillStyle = n ? P.nFloor : P.floor; ctx.fillRect(-300, FLOOR, W + 600, H - FLOOR + 300);
  ctx.strokeStyle = n ? P.nFloorDark : P.floorDark; ctx.lineWidth = 6; for (let y = FLOOR + 90; y < H + 300; y += 110) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(W + 300, y); ctx.stroke(); }
  K.windowPane(660, 380, 300, 360, n);
  // whiteboard with a little org chart (boxes = agents)
  rr(90, 400, 420, 300, 14); ctx.fillStyle = n ? '#4A4254' : '#B8AE9C'; ctx.fill(); rr(104, 414, 392, 272, 8); ctx.fillStyle = n ? '#3A4058' : P.white; ctx.fill();
  const ink = n ? '#6E7590' : '#9AA6B2';
  rr(265, 440, 70, 44, 6); ctx.fillStyle = ink; ctx.fill();
  for (let i = 0; i < 4; i++) { line([[300, 484], [300, 520], [150 + i * 100, 520], [150 + i * 100, 560]], ink, 5); rr(125 + i * 100, 560, 50, 34, 5); ctx.fill(); for (let j = 0; j < 2; j++) { line([[150 + i * 100, 594], [130 + i * 100 + j * 40, 630]], ink, 4); rr(118 + i * 100 + j * 40, 630, 24, 22, 4); ctx.fill(); } }
}
function desk(x, y, w = 560) { rr(x - w / 2, y, w, 34, 8); ctx.fillStyle = P.wood; ctx.fill(); ctx.fillStyle = '#7E5A41'; ctx.fillRect(x - w / 2 + 30, y + 34, 24, GROUND - y - 34); ctx.fillRect(x + w / 2 - 54, y + 34, 24, GROUND - y - 34); }
/** laptop on a desk top y. state: 'off' | 'load' | 'ok' ; t for the spinner */
function laptop(x, y, state, t, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-150, -14, 300, 16, 6); ctx.fillStyle = '#596075'; ctx.fill();
  rr(-130, -200, 260, 186, 12); ctx.fillStyle = P.ink; ctx.fill();
  rr(-116, -188, 232, 160, 6); ctx.fillStyle = state === 'off' ? '#2E3445' : '#DDEBF7'; ctx.fill();
  if (state === 'load') { for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + Math.floor(t * 10) / 10 * TAU; ctx.globalAlpha = 0.25 + 0.75 * ((k + 1) / 8); circle(Math.cos(a) * 44, -108 + Math.sin(a) * 44, 10, P.navy); } ctx.globalAlpha = 1; }
  if (state === 'ok') { ctx.beginPath(); ctx.moveTo(-36, -108); ctx.lineTo(-10, -82); ctx.lineTo(40, -136); ctx.strokeStyle = P.green; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
  ctx.restore();
}
function note(x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); rr(-34, -42, 68, 84, 6); ctx.fillStyle = '#FFF6D8'; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 4; ctx.stroke(); for (let i = 0; i < 3; i++) line([[-20, -20 + i * 18], [20, -20 + i * 18]], '#9AA6B2', 4); ctx.restore(); }
/** speech bubble with ink text, tail pointing down to (tx, ty) */
function speech(x, y, text, sc, tx, ty, col = P.navy) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = '900 56px Inter'; const w = ctx.measureText(text).width + 70;
  ctx.beginPath(); ctx.moveTo(-24, 40); ctx.lineTo((tx - x) / sc * 0.5, (ty - y) / sc * 0.6); ctx.lineTo(24, 40); ctx.closePath(); ctx.fillStyle = P.white; ctx.fill();
  rr(-w / 2, -50, w, 100, 30); ctx.fill();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 3);
  ctx.restore();
}
function qmark(x, y, s) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.font = '900 110px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = P.ink; ctx.strokeText('?', 0, 0); ctx.fillStyle = P.red; ctx.fillText('?', 0, 0); ctx.restore(); }
function clipboard(x, y, w, h, rows, ticked, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-w / 2 + 8, -h / 2 + 10, w, h, 24); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
  rr(-w / 2, -h / 2, w, h, 24); ctx.fillStyle = '#A8754E'; ctx.fill();
  rr(-w / 2 + 26, -h / 2 + 50, w - 52, h - 76, 10); ctx.fillStyle = P.white; ctx.fill();
  rr(-70, -h / 2 - 20, 140, 60, 12); ctx.fillStyle = '#9AA6B2'; ctx.fill();
  const rh = (h - 120) / rows;
  for (let i = 0; i < rows; i++) {
    const ry = -h / 2 + 90 + i * rh;
    rr(-w / 2 + 56, ry, 44, 44, 8); ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.stroke();
    line([[-w / 2 + 130, ry + 22], [w / 2 - 70 - rnd(i) * 80, ry + 22]], '#C9D2DA', 12);
    const p = clamp(ticked - i);
    if (p > 0) { ctx.beginPath(); ctx.moveTo(-w / 2 + 62, ry + 22); ctx.lineTo(-w / 2 + 76, ry + 38); ctx.lineTo(lerp(-w / 2 + 76, -w / 2 + 102, p), lerp(ry + 38, ry + 2, p)); ctx.strokeStyle = P.green; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
  }
  ctx.restore();
}
function binder(x, y, w, h, col, label, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  rr(-w / 2, -h, w, h, 10); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.stroke();
  rr(-w / 2 + 16, -h + 40, w - 32, 40, 6); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  ctx.save(); ctx.translate(0, -h / 2 + 30); ctx.rotate(-Math.PI / 2); ctx.font = '900 40px Inter'; ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2); ctx.restore();
  ctx.restore();
}
function openBook(x, y, s) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-300, -170, 600, 340, 20); ctx.fillStyle = P.gold; ctx.fill();
  for (const sx of [-1, 1]) { rr(sx > 0 ? 8 : -284, -150, 276, 300, 10); ctx.fillStyle = P.white; ctx.fill(); for (let i = 0; i < 6; i++) line([[sx > 0 ? 40 : -252, -110 + i * 44], [sx > 0 ? 250 - rnd(i + sx) * 60 : -40 - rnd(i) * 60, -110 + i * 44]], '#C9D2DA', 12); }
  line([[0, -160], [0, 160]], P.goldDark, 8);
  ctx.restore();
}
function sparkles(x, y, r, p) { if (p <= 0 || p >= 1) return; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + 0.3, d = r * eo(p); ctx.globalAlpha = 1 - p; circle(x + Math.cos(a) * d, y + Math.sin(a) * d, 16 * (1 - p) + 4, P.gold); } ctx.globalAlpha = 1; }
function iconDisc(x, y, s, kind) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(6, 10, 120, 'rgba(0,0,0,0.2)'); circle(0, 0, 120, P.navy);
  if (kind === 'bulb') { circle(0, -20, 54, P.gold); rr(-30, 26, 60, 26, 6); ctx.fillStyle = P.gold; ctx.fill(); rr(-24, 56, 48, 22, 6); ctx.fillStyle = '#C9BFA9'; ctx.fill(); line([[-14, -20], [0, 0], [14, -20]], P.goldDark, 6); }
  if (kind === 'folder') { rr(-70, -50, 60, 30, 8); ctx.fillStyle = P.goldDark; ctx.fill(); rr(-70, -36, 140, 100, 12); ctx.fillStyle = P.gold; ctx.fill(); line([[-40, 0], [40, 0]], P.goldDark, 8); line([[-40, 26], [20, 26]], P.goldDark, 8); }
  if (kind === 'wrench') { ctx.rotate(-0.8); rr(-14, -20, 28, 110, 12); ctx.fillStyle = P.gold; ctx.fill(); circle(0, -44, 42, P.gold); rr(-13, -100, 26, 50, 4); ctx.fillStyle = P.navy; ctx.fill(); }
  ctx.restore();
}
function bar(x, base, w, h, col, label) { rr(x - w / 2, base - h, w, h, [16, 16, 0, 0]); ctx.fillStyle = col; ctx.fill(); ctx.font = '900 50px Inter'; ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; rr(x - 150, base + 20, 300, 76, 20); ctx.fillStyle = P.navy; ctx.fill(); ctx.fillStyle = P.gold; ctx.fillText(label, x, base + 60); }
const dim = (a) => { ctx.fillStyle = `rgba(5,8,18,${a})`; ctx.fillRect(-300, -300, W + 600, H + 600); };

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const blink = (t) => ((t % 3.1) < 0.12 ? 1 : 0);
  // the 12 helpers around the desk: 4 on the desk top, 8 on the floor in front
  const crowd = [...[0, 1, 2, 3].map((i) => ({ x: 600 + i * 100, y: 1150, h: 270 })), ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ x: 450 + i * 84, y: GROUND, h: 380 }))];
  const drawCrowd = (lt, popAt, mood, looks) => crowd.forEach((c, i) => {
    const p = popAt == null ? 1 : eob(seg(lt, popAt + i * 0.05, popAt + i * 0.05 + 0.22)); if (p <= 0) return;
    ctx.save(); ctx.translate(c.x, c.y); ctx.scale(p, p); ctx.translate(-c.x, -c.y);
    K.person({ glow: true, x: c.x, y: c.y, h: c.h, cap: CAPC[i], dir: i % 2 ? -1 : 1, mood: mood || 'calm', look: looks ? looks(i) : [-0.8, -0.3] });
    ctx.restore();
  });

  // 1 · hero at the laptop; a dozen helpers pop in on "dozen"
  { const dz = Wd('dozen', 0);
    add({ id: 'S01', at: 0, cam: [540, 1150], zoom: 0.05, note: 'night office, hero at laptop, 12 helpers pop in on "dozen"', draw(lt, d, t) {
      office(true); dim(0.15); desk(640, 1150); laptop(470, 1150, 'off', t);
      K.person({ glow: true, x: 240, y: GROUND, h: 840, mood: lt > dz ? 'worried' : 'calm', look: lt > dz ? [1, 0.3] : [1, 0.6], blink: blink(t), arms: { L: [-6, 14], R: [70, 30] } });
      drawCrowd(lt, dz);
      K.counterPill('12 HELPERS', 540, 300, lt > dz ? eob(seg(lt, dz + 0.4, dz + 0.65)) * 1.3 : 0);
    } });
    cue(0.2, 'pop', { gain: 0.4 }); for (let i = 0; i < 12; i += 2) cue(dz + i * 0.05, 'plop', { gain: 0.35 }); cue(dz + 0.4, 'pop'); }

  // 2 · still slow (spinner) and confused (red ?s)
  { const st = cut(1), sl = Wd('slow', 1) - st, cf = Wd('confused', 1) - st;
    add({ id: 'S02', at: st, cam: [600, 1100], zoom: 0.12, note: 'spinner on "slow", red ?s over helpers on "confused"', draw(lt, d, t) {
      office(true); dim(0.15); desk(640, 1150); laptop(470, 1150, lt > sl ? 'load' : 'off', t);
      const conf = lt > cf;
      K.person({ glow: true, x: 240, y: GROUND, h: 840, mood: conf ? 'worried' : 'calm', look: [1, 0.6], blink: blink(t), arms: { L: [-6, 14], R: [70, 30] } });
      drawCrowd(lt, null, conf ? 'worried' : 'calm', conf ? (i) => [Math.sin(i * 2.3 + lt * 3), -0.5] : null);
      if (lt > sl) K.counterPill('LOADING...', 540, 300, eob(seg(lt, sl, sl + 0.25)) * 1.3);
      if (conf) [[640, 820], [860, 860], [560, 1120], [790, 1150], [990, 1150]].forEach(([x, y], k) => qmark(x, y, eob(seg(lt, cf + k * 0.08, cf + k * 0.08 + 0.25))));
    } });
    cue(st, 'whoosh'); cue(st + sl, 'tock'); cue(st + sl + 0.3, 'tock', { gain: 0.5 }); cue(st + cf, 'boing', { gain: 0.5 }); }

  // 3 · every handoff is a game of telephone: a note passes down a row of helpers
  const row = [130, 330, 530, 730, 930];
  const hand = (x) => [x + 175, 1170];
  { const st = cut(2), ho = Wd('handoff', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 1150], zoom: 0.06, note: 'note passes hand to hand along 5 helpers', draw(lt, d, t) {
      office(true); dim(0.2);
      const p = seg(lt, 0.25, d - 0.1) * 4, k = Math.min(3, Math.floor(p)), f = eio(p - k);
      row.forEach((x, i) => K.person({ glow: true, x, y: GROUND, h: 560, cap: CAPC[i], mood: 'calm', look: [i === k + 1 ? -0.6 : 0.6, 0.6], blink: blink(t + i), arms: { L: [-6, 14], R: [i === k || i === k + 1 ? 75 : 10, i === k + 1 ? 30 : 10] } }));
      const a = hand(row[k]), b = hand(row[k + 1]);
      const nx = lerp(a[0], b[0], f), ny = lerp(a[1], b[1], f) - Math.sin(f * Math.PI) * 60;
      note(nx, ny - 20, 1.1, Math.sin(lt * 5) * 0.15);
      K.counterPill('HANDOFF', 540, 300, lt > ho ? eob(seg(lt, ho, ho + 0.25)) * 1.3 : 0);
    } });
    cue(st, 'whoosh'); cue(st + ho, 'pop'); }

  // 4 · details get lost: first says SHIP FRIDAY, last hears FISH FRY?
  { const st = cut(3), de = Wd('details', 3) - st, lo = Wd('lost', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 1050], zoom: 0.08, note: '"SHIP FRIDAY" → "FISH FRY?", red X on "lost"', draw(lt, d, t) {
      office(true); dim(0.2);
      row.forEach((x, i) => K.person({ glow: true, x, y: GROUND, h: 560, cap: CAPC[i], mood: i === 4 && lt > lo ? 'worried' : 'calm', look: i === 4 ? [-0.8, -0.4] : [0.6, 0], blink: blink(t + i) }));
      note(row[4] + 60, 1200, 0.95, 0.3);
      speech(330, 760, 'SHIP FRIDAY', eob(seg(lt, 0.05, 0.3)) * 1.3, row[0] + 20, 960);
      speech(770, 560, 'FISH FRY?', lt > de ? eob(seg(lt, de, de + 0.3)) * 1.3 : 0, row[4], 960, P.red);
      if (lt > lo) K.cross(540, 330, eob(seg(lt, lo, lo + 0.25)) * 1.2);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.5 }); cue(st + de, 'pop'); cue(st + lo, 'boing', { gain: 0.5 }); }

  // 5 · step one: a small test set, ten real examples
  { const st = cut(4), ts = Wd('test', 4) - st, ex = Wd('examples', 4, 'e') - st, tn = Wd('ten', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.06, note: 'step card 1, clipboard ticks 10 boxes', draw(lt, d, t) {
      office(true); dim(0.3);
      K.person({ glow: true, x: 200, y: GROUND, h: 840, mood: 'determined', look: [1, -0.2], blink: blink(t), arms: { L: [-6, 14], R: [60, 40] } });
      clipboard(680, 930, 480, 640, 10, lt > ts ? seg(lt, ts, ex) * 10 : 0, eob(seg(lt, 0.15, 0.45)));
      K.stepCard(1, 'TEST SET', 540, 300, eob(seg(lt, 0.05, 0.3)));
      K.counterPill('10 EXAMPLES', 680, 1380, lt > tn ? eob(seg(lt, tn, tn + 0.25)) : 0);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); for (let i = 0; i < 10; i++) cue(st + ts + (ex - ts) * (i + 0.5) / 10, 'tock', { gain: 0.25 }); cue(st + tn, 'pop'); }

  // 6 · step two: fold one helper into the main agent
  { const st = cut(5), fo = Wd('fold', 5) - st, ma = Wd('main', 5) - st;
    add({ id: 'S06', at: st, cam: [480, 1150], zoom: 0.06, note: 'step card 2, one helper walks into the hero, sparkle', draw(lt, d, t) {
      office(true); dim(0.3);
      const w = eio(seg(lt, fo, ma)), merged = lt > ma;
      [720, 840, 960].forEach((x, i) => K.person({ glow: true, x, y: GROUND, h: 360, cap: CAPC[i + 1], dir: -1, mood: 'calm', look: [-1, 0], blink: blink(t + i) }));
      if (!merged) { ctx.save(); ctx.globalAlpha = 1 - seg(lt, ma - 0.25, ma); K.person({ glow: true, x: lerp(600, 340, w), y: GROUND, h: 360, cap: CAPC[0], dir: -1, walk: w > 0 && w < 1 ? lt * 12 : null, mood: 'happy', look: [-1, 0] }); ctx.restore(); }
      K.person({ glow: true, x: 260, y: GROUND, h: 840, mood: merged ? 'happy' : 'calm', look: [1, 0.4], blink: blink(t), arms: merged ? { L: [150, 10], R: [150, 10] } : undefined });
      sparkles(280, 1000, 260, seg(lt, ma, ma + 0.7));
      K.stepCard(2, 'FOLD ONE IN', 540, 300, eob(seg(lt, 0.05, 0.3)));
      if (merged) K.counterPill('11 LEFT', 760, 1000, eob(seg(lt, ma + 0.2, ma + 0.45)));
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + ma, 'sparkle', { dur: 0.7 }); cue(st + ma + 0.2, 'pop', { gain: 0.5 }); }

  // 7 · its prompt becomes a skill that loads only when needed
  { const st = cut(6), sk = Wd('skill', 6) - st, ne = Wd('needed', 6) - st;
    const labels = ['BILLING', 'SHIPPING', 'REFUNDS', 'RETURNS', 'ORDERS'], cols = [P.sofa, P.red, P.green, P.rug, P.wood];
    add({ id: 'S07', at: st, cam: [600, 1000], zoom: 0.06, note: 'shelf of skill binders; SHIPPING glows on "skill", opens on "needed"', draw(lt, d, t) {
      office(true); dim(0.3);
      ctx.fillStyle = '#6B4A34'; ctx.fillRect(260, 980, 760, 30);
      const out = eio(seg(lt, ne, ne + 0.45));
      labels.forEach((lb, i) => { if (i === 1 && out > 0) return; const x = 340 + i * 150; if (i === 1 && lt > sk) { ctx.save(); ctx.filter = 'drop-shadow(0px 0px 22px rgba(242,178,62,1))'; binder(x, 980, 120, 400, cols[i], lb); ctx.restore(); } else binder(x, 980, 120, 400, cols[i], lb); });
      openBook(640, 1240, eob(out));
      K.person({ glow: true, x: 150, y: GROUND, h: 720, mood: out > 0 ? 'happy' : 'calm', look: [1, out > 0 ? 0.5 : -0.5], blink: blink(t) });
      K.counterPill('SKILL', 640, 300, lt > sk ? eob(seg(lt, sk, sk + 0.25)) : 0);
      if (out > 0) K.counterPill('LOADS WHEN NEEDED', 640, 440, eob(seg(lt, ne, ne + 0.3)) * 0.9);
    } });
    cue(st, 'whoosh'); cue(st + sk, 'sparkle', { dur: 0.5 }); cue(st + ne, 'whoosh', { gain: 0.5 }); cue(st + ne + 0.3, 'pop'); }

  // 8 · step three: run your tests again, more than once
  { const st = cut(7), te = Wd('tests', 7) - st, on = Wd('once', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.06, note: 'step card 3, RUN 1 ✓ on "tests", RUN 2 ✓ on "once"', draw(lt, d, t) {
      office(true); dim(0.3);
      K.person({ glow: true, x: 880, y: GROUND, h: 840, dir: -1, mood: 'determined', look: [-1, -0.2], blink: blink(t) });
      clipboard(380, 960, 440, 560, 6, 6, eob(seg(lt, 0.1, 0.4)));
      K.stepCard(3, 'TEST AGAIN', 540, 300, eob(seg(lt, 0.05, 0.3)));
      if (lt > te) { K.counterPill('RUN 1', 700, 620, eob(seg(lt, te, te + 0.25))); K.check(900, 620, eob(seg(lt, te + 0.15, te + 0.4)) * 0.7); }
      if (lt > on) { K.counterPill('RUN 2', 700, 790, eob(seg(lt, on, on + 0.25))); K.check(900, 790, eob(seg(lt, on + 0.15, on + 0.4)) * 0.7); }
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop'); cue(st + te, 'pop'); cue(st + te + 0.15, 'tock', { gain: 0.5 }); cue(st + on, 'pop'); cue(st + on + 0.15, 'tock', { gain: 0.5 }); }

  // 9 · keep the helper only if the folded version scores worse
  { const st = cut(8), he = Wd('helper', 8) - st, fv = Wd('folded', 8) - st, wo = Wd('worse', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.06, note: 'score bars HELPER vs FOLDED; rule pill on "worse"', draw(lt, d, t) {
      office(true); dim(0.35);
      const g1 = eo(seg(lt, 0.1, he + 0.4)), g2 = eo(seg(lt, fv, fv + 0.7));
      bar(330, 1260, 220, 300 * g1 + 4, P.sofa, 'HELPER'); bar(750, 1260, 220, 420 * g2 + 4, P.green, 'FOLDED');
      K.person({ glow: true, x: 330, y: 1260 - 300 * g1, h: 300, cap: CAPC[0], mood: 'calm', look: [1, 0] });
      K.person({ glow: true, x: 750, y: 1260 - 420 * g2, h: 300, mood: lt > wo ? 'happy' : 'calm', look: [-1, 0] });
      if (lt > wo) { K.counterPill('KEEP IT ONLY IF WORSE', 540, 300, eob(seg(lt, wo, wo + 0.25)) * 1.15); K.check(750, 1460, eob(seg(lt, wo + 0.2, wo + 0.45)) * 0.8); }
    } });
    cue(st, 'whoosh'); cue(st + he, 'zip', { gain: 0.5 }); cue(st + fv, 'zip', { gain: 0.5 }); cue(st + wo, 'pop'); cue(st + wo + 0.2, 'sparkle', { dur: 0.6 }); }

  // 10 · one team got about two times faster (daylight from here on)
  { const st = cut(9), tw = Wd('two', 9) - st, fa = Wd('faster', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 1100], zoom: 0.05, note: 'daylight, hero sprints with speed lines, 2X FASTER pill', draw(lt, d, t) {
      office(false);
      const x = lerp(140, 720, eio(seg(lt, 0.1, d)));
      for (let i = 0; i < 4; i++) line([[x - 160 - i * 30, 1000 + i * 90], [x - 420 - i * 40, 1000 + i * 90]], P.wallShade, 14);
      K.person({ x, y: GROUND, h: 800, walk: lt * 16, lean: 14, mood: 'happy', look: [1, 0] });
      K.counterPill('2X', 540, 330, lt > tw ? eob(seg(lt, tw, tw + 0.3)) * 1.8 : 0);
      if (lt > fa) K.counterPill('FASTER', 540, 520, eob(seg(lt, fa, fa + 0.25)) * 1.2);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'whoosh', { gain: 0.6 }); cue(st + tw, 'pop'); cue(st + fa, 'pop'); }

  // 11 · one brain, one memory, the right tools
  { const st = cut(10), br = Wd('brain', 10) - st, me = Wd('memory', 10) - st, to = Wd('tools', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 1000], zoom: 0.06, note: 'bulb / folder / wrench pop on their words', draw(lt, d, t) {
      office(false);
      K.person({ x: 540, y: GROUND, h: 860, mood: 'happy', look: [0, -0.8], blink: blink(t), arms: lt > to ? { L: [150, 10], R: [150, 10] } : undefined });
      iconDisc(220, 560, lt > br ? eob(seg(lt, br, br + 0.25)) : 0, 'bulb');
      iconDisc(540, 380, lt > me ? eob(seg(lt, me, me + 0.25)) : 0, 'folder');
      iconDisc(860, 560, lt > to ? eob(seg(lt, to, to + 0.25)) : 0, 'wrench');
    } });
    cue(st, 'whoosh'); cue(st + br, 'pop'); cue(st + me, 'pop'); cue(st + to, 'pop'); }

  // 12 · maybe your agent never needed all those helpers
  { const st = cut(11), ne = Wd('needed', 11) - st, hp = Wd('helpers', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 1100], zoom: 0.06, note: 'daylight: hero at a done laptop, helpers wave bye, big check', draw(lt, d, t) {
      office(false); desk(470, 1150, 520); laptop(470, 1150, 'ok', t);
      K.person({ x: 150, y: GROUND, h: 840, mood: 'happy', look: [1, 0], blink: blink(t), arms: { L: [-6, 14], R: [70, 30] } });
      [700, 820, 940].forEach((x, i) => { const wave = lt > hp ? Math.sin(lt * 10 + i) * 20 : 0; K.person({ x, y: GROUND, h: 420, cap: CAPC[i * 3], dir: -1, mood: 'happy', arms: { L: [-6, 14], R: [150 + wave, 10] } }); });
      if (lt > ne - 0.3) K.check(540, 520, eob(seg(lt, ne - 0.3, ne)) * 1.4);
    } });
    cue(st, 'whoosh'); cue(st + ne - 0.3, 'sparkle', { dur: 1 }); }

  return { shots: S, cues: CUES };
}
