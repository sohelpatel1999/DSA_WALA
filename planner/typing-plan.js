// Switch Prep — typing practice (dsa-visual ka typing.js engine reuse, content planner ka apna)
//  daily DSA   → saare approaches Brute → Better → Optimal + "🎤 Aise bolo" answers
//  daily theory→ Interview ke har question ka English answer (dekh ke type) + "Aise bolo"
//  revision    → DSA: Optimal (default) — picker se Brute/Better chun sakte ho, choice item id pe yaad · theory: Q&A + Aise bolo
(function () {
  // TYPING baad me load ho sakta hai (dsa-visual index.html) — isliye lazy
  const T = new Proxy({}, { get: (o, k) => window.TYPING[k] });
  const norm = s => String(s).replace(/\s+/g, ' ').trim();
  const short = n => (n.length > 90 ? n.slice(0, 88).replace(/\s+\S*$/, '') + ' …' : n);

  // lesson ke "har line ka purpose" ({lines}) → line notes
  function noteMap(L) {
    const m = {};
    (L.parts || []).forEach(p => (p.blocks || []).forEach(b => (b.lines || []).forEach(([code, why]) => {
      const k = norm(code).replace(/\s*\{$/, '');
      if (k && !m[k]) m[k] = T.plain(why);
    })));
    return m;
  }
  function notesFor(L, code, m) {
    m = m || noteMap(L);
    return String(code).split('\n').map(c => {
      const sc = T.stripComment(c), k = norm(sc.code).replace(/\s*\{$/, '');
      return short(sc.comment || m[k] || T.autoNote(c) || '');
    });
  }
  const optIdx = L => { const lv = L.approaches.map(a => a.level); const i = lv.lastIndexOf('Optimal'); return i >= 0 ? i : lv.length - 1; };
  function bruteHint(L) {
    const b = L.approaches.find(a => a.level === 'Brute');
    return b ? `Brute (sirf yaad karo, type nahi): ${T.plain(b.idea)} — ${b.time}` : '';
  }
  const hasCode = L => L.kind === 'dsa' && (L.approaches || []).some(a => a.code);

  function sayItems(id, L) {
    const out = [];
    (L.parts || []).forEach(p => (p.blocks || []).forEach(b => (b.say || []).forEach(([t, a]) => {
      out.push({ label: '🎤 ' + T.plain(t).replace(/^Aise bolo\s*[—-]\s*/i, ''), key: id, prose: true, text: a, ask: T.plain(t) + ' — bol ke type karo' });
    })));
    return out;
  }
  function qaItems(id, L) {
    const ip = (L.parts || []).find(p => /^🎤\s*Interview/.test(p.title || ''));
    const out = [];
    if (ip) (ip.blocks || []).forEach(b => (b.qa || []).forEach(([q, a]) => {
      out.push({ label: 'Q' + (out.length + 1), key: id, prose: true, text: a, ask: T.plain(q) });
    }));
    return out;
  }
  function dsaLearn(id, L) {
    const m = noteMap(L);
    return L.approaches.map((a, i) => ({ label: a.level, key: id, ap: i, code: a.code, notes: notesFor(L, a.code, m) })).filter(x => x.code);
  }
  // revision: ek item — Optimal ya jo level chuna (levelPref[id])
  function dsaRev(id, L, pref) {
    const m = noteMap(L), opt = optIdx(L), want = (pref || T.levelPref())[id];
    const lv = L.approaches.map(a => a.level);
    let main = want ? lv.lastIndexOf(want) : -1;
    if (main < 0) main = opt;
    const alts = L.approaches.map((a, i) => ({ ap: i, lv: a.level, code: a.code, notes: notesFor(L, a.code, m), hint: i === opt ? bruteHint(L) : '' }));
    const a = alts[main];
    return { base: L.title, label: `${L.title} (${a.lv}${a.lv !== 'Optimal' ? ' — aapki choice' : ''})`, key: id, ap: main, code: a.code, notes: a.notes, hint: a.hint, alts: alts.length > 1 ? alts : null };
  }
  // mode: 'learn' | 'rev'
  function items(id, L, mode, pref) {
    if (!L) return [];
    if (hasCode(L)) return (mode === 'rev' ? [dsaRev(id, L, pref)] : dsaLearn(id, L)).concat(sayItems(id, L));
    return qaItems(id, L).concat(sayItems(id, L));
  }
  function block(id, L, mode) {
    const it = items(id, L, mode);
    return it.length ? { q: id, items: it } : null;
  }
  const HELP = 'Click karo aur type karo · galat key laal · line ke end pe <b>Enter</b> · best WPM yaad rehta hai.';

  // lesson ke parts ki copy + typing part (DSA: Visualizer ke baad, na ho toh Java code ke baad · theory: Interview ke baad)
  function withTyping(id, L) {
    const t = block(id, L, 'learn');
    if (!t) return L;
    const parts = (L.parts || []).slice();
    const find = re => { for (let i = parts.length - 1; i >= 0; i--) if (re.test(parts[i].title || '')) return i; return -1; };
    const dsa = hasCode(L);
    let at = dsa ? find(/^▶\s*Visuali/) : find(/^🎤\s*Interview/);
    if (at < 0 && dsa) at = find(/^💻/);
    const intro = dsa
      ? 'Har approach haath se type karo — samajh + muscle memory. Phir "🎤 Aise bolo" tabs: interview me jo bolna hai woh bhi type karke pakka karo.'
      : 'Answer dekh ke type karo (upar ❓ me question). Type karte waqt mann me bolo — interview me yahi bolna hai.';
    parts.splice(at < 0 ? parts.length : at + 1, 0, {
      title: dsa ? '⌨️ Typing practice — Brute → Optimal + Aise bolo' : '⌨️ Q&A typing — answer dekh ke type karo',
      blocks: [{ rawHtml: `<p class="muted small">${intro} ${HELP}</p>${T.html(t)}` }],
    });
    return Object.assign({}, L, { parts });
  }
  // revision card ke andar (collapsible)
  function revHtml(id, L) {
    const t = block(id, L, 'rev');
    if (!t) return '';
    const what = hasCode(L) ? 'Optimal code (level badal sakte ho) + Aise bolo' : 'Interview answers + Aise bolo';
    return `<details class="rev-typing"><summary>⌨️ Typing se revise karo <span class="muted small">— ${what}</span></summary>${T.html(t)}</details>`;
  }

  window.PLAN_TYPING = { items, block, withTyping, revHtml, notesFor, dsaRev };
})();
