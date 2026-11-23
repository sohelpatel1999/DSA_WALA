// ⌨️ Typing practice (TypingClub jaisa) — lesson block:
//   { typing: { q: 21, items: [
//       { label: 'Warm-up: declarations', lines: [['ListNode dummy = new ListNode(0);', 'dummy = placeholder'], ...] },
//       { label: 'Brute', ap: 0, notes: ['comment line 1', '', ...] },   // code = us question ka approach[ap] (drift nahi hota)
//   ] } }
// Rules: aage ke spaces (indent) apne aap; line ke end pe Enter (↲); galat key → laal, cursor wahin (sahi key chahiye).
// Comment (// …) sirf dikhane ke liye — type nahi karna. Best WPM / accuracy localStorage 'dsa-typing-v1' me.
(function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const KEY = 'dsa-typing-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const save = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignore */ } };
  // Roz ke revision me kis question ka kaunsa level type karna hai (default Optimal) — user ki choice: { lc: 'Brute' | 'Better' | 'Optimal' }
  const LKEY = 'dsa-typing-level';
  const levelPref = () => { try { return JSON.parse(localStorage.getItem(LKEY) || '{}'); } catch (e) { return {}; } };
  const setLevelPref = (lc, lv) => { const p = levelPref(); if (lv === 'Optimal') delete p[lc]; else p[lc] = lv; try { localStorage.setItem(LKEY, JSON.stringify(p)); } catch (e) { /* ignore */ } };
  let uid = 0;

  function questionCode(q, ap) {
    const C = window.PHASE_CONTENT || {};
    for (const k in C) { const qq = C[k].questions && C[k].questions[q]; if (qq && qq.approaches[ap]) return qq.approaches[ap].code; }
    return null;
  }
  // Auto comments: saare lessons ke "har line ka purpose" ({lines: [[code, purpose]]}) se — code line (trim) → purpose (plain text)
  let noteIdx = null;
  const plain = s => String(s).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const norm = s => String(s).replace(/\s+/g, ' ').trim();
  function autoNote(line) {
    if (!noteIdx) {
      noteIdx = {};
      const C = window.PHASE_CONTENT || {};
      Object.values(C).forEach(c => Object.values(c.lessons || {}).forEach(l => (l.parts || []).forEach(p => (p.blocks || []).forEach(b => {
        (b.lines || []).forEach(([code, why]) => { const k = norm(code); if (k && !noteIdx[k]) noteIdx[k] = plain(why); });
      }))));
    }
    const n = noteIdx[norm(line)] || noteIdx[norm(stripComment(line).code)] || guessNote(line);
    return n.length > 90 ? n.slice(0, 88).replace(/\s+\S*$/, '') + ' …' : n;
  }
  // "int k = 0; // next jagah" → { code: "int k = 0;", comment: "next jagah" } (string ke andar ka // nahi chhedte)
  function stripComment(line) {
    let inStr = false;
    for (let i = 0; i < line.length - 1; i++) {
      const ch = line[i];
      if (ch === '"' && line[i - 1] !== '\\') inStr = !inStr;
      if (!inStr && ch === '/' && line[i + 1] === '/') return { code: line.slice(0, i).replace(/\s+$/, ''), comment: line.slice(i + 2).trim() };
    }
    return { code: line, comment: '' };
  }
  // purpose table me na mile toh aam lines ka chhota matlab
  function guessNote(line) {
    const s = stripComment(line).code.trim();
    if (/^(public|private|protected|static)\b.*\(.*\)\s*\{$/.test(s)) return 'method signature — input / return type yaad rakho';
    if (/^for\s*\(\s*\w+(<[^>]*>)?\s+\w+\s*:/.test(s)) return 'for-each — har element ek baar';
    if (/^for\s*\(/.test(s)) return 'loop — init; condition; update';
    if (/^while\s*\(/.test(s)) return 'loop — jab tak condition true';
    if (/^int\s+(tmp|temp|t)\s*=/.test(s)) return 'swap 1/3: purani value bachao';
    if (/^return\s+-?1\s*;$/.test(s)) return 'nahi mila → -1';
    if (/^return\b/.test(s)) return 'answer return';
    if (/^\w+(\.\w+)*\s*(\+\+|--)\s*;$/.test(s)) return 'pointer / counter aage';
    return '';
  }
  // item → [{code, note}] (blank lines hata ke). item.q (apna question) ya block ka t.q; notes na ho toh auto
  function linesOf(t, it) {
    let rows;
    if (it.lines) rows = it.lines.map(([code, note]) => ({ code, note: note || '' }));
    else if (it.prose) rows = wrapProse(it.text).map(code => ({ code, note: '' }));
    else {
      const code = it.code != null ? it.code : questionCode(it.q || t.q, it.ap);
      if (code == null) return [];
      // code ke andar ka "// …" type nahi karwate — side comment ban jaata hai
      rows = code.split('\n').map((c, i) => {
        const sc = stripComment(c), given = it.notes ? (it.notes[i] || '') : '';
        return { code: sc.code, note: given || sc.comment || (it.notes ? '' : autoNote(c)) };
      });
    }
    return rows.filter(r => r.code.trim() !== '');
  }

  // Prose (interview answer) → keyboard-friendly text, ~70 chars ki lines (word wrap)
  const ASCII = { '—': '-', '–': '-', '‘': "'", '’': "'", '“': '"', '”': '"', '→': '->', '←': '<-', '…': '...', '×': 'x', '≤': '<=', '≥': '>=', '≠': '!=', '²': '^2', '³': '^3', ' ': ' ' };
  function wrapProse(text, w) {
    w = w || 70;
    const s = plain(String(text || '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' '))
      .replace(/[^\x20-\x7e]/g, ch => ASCII[ch] != null ? ASCII[ch] : '').replace(/\s+/g, ' ').trim();
    const out = [];
    let cur = '';
    s.split(' ').filter(Boolean).forEach(word => {
      if (cur && (cur + ' ' + word).length > w) { out.push(cur); cur = word; } else cur = cur ? cur + ' ' + word : word;
    });
    if (cur) out.push(cur);
    return out;
  }

  // Pure typing engine (DOM ke bina — tools/test-typing.js isi ko test karta hai)
  const startCol = row => /^\s*/.exec(row.code)[0].length;
  function engine(rows) {
    const s = { li: 0, ci: rows.length ? startCol(rows[0]) : 0, correct: 0, errors: 0, done: !rows.length };
    s.total = rows.reduce((a, r) => a + r.code.length - startCol(r) + 1, 0);
    // press(ch) → { ok, l, c } (l, c = jis cell pe key padi)
    s.press = ch => {
      if (s.done) return { ok: false, l: s.li, c: s.ci, ignored: true };
      const row = rows[s.li], want = s.ci < row.code.length ? row.code[s.ci] : '\n', at = { l: s.li, c: s.ci };
      if (ch !== want) { s.errors++; return Object.assign({ ok: false }, at); }
      s.correct++;
      if (want === '\n') { s.li++; if (s.li >= rows.length) s.done = true; else s.ci = startCol(rows[s.li]); }
      else s.ci++;
      return Object.assign({ ok: true }, at);
    };
    return s;
  }

  function html(t) {
    const id = 'ty' + (++uid);
    const items = t.items || [];
    return `<div class="typing" id="${id}" data-typing='${esc(JSON.stringify(t))}'>
      <div class="ty-tabs">${items.map((it, i) => `<button type="button" class="btn small ${i === 0 ? 'primary' : ''}" data-tyitem="${i}">${esc(it.label)}<span class="ty-best" data-tybest="${i}"></span></button>`).join('')}</div>
      <div class="ty-stats"><span>⏱ <b data-ty="time">0s</b></span><span>⚡ <b data-ty="wpm">0</b> WPM</span><span>🎯 <b data-ty="acc">100%</b></span><span>❌ <b data-ty="err">0</b></span><span class="ty-prog"><i data-ty="bar"></i></span><button type="button" class="btn small" data-tyrestart>↻ Restart</button></div>
      <div class="ty-pick" data-ty="pick" hidden></div>
      <div class="ty-brute" data-ty="hint" hidden></div>
      <div class="ty-box" tabindex="0"><div class="ty-lines"></div><div class="ty-hint">👆 Yahan click karo aur type karna shuru karo · indent apne aap · line ke end pe <b>Enter</b></div></div>
      <textarea class="ty-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Typing input"></textarea>
      <div class="ty-result" hidden></div>
    </div>`;
  }

  function mountOne(root) {
    if (root._ty) return;
    root._ty = true;
    const t = JSON.parse(root.dataset.typing);
    const box = root.querySelector('.ty-box'), linesEl = root.querySelector('.ty-lines'), input = root.querySelector('.ty-input');
    const $s = k => root.querySelector(`[data-ty="${k}"]`);
    let item = 0, rows = [], E = engine([]), start = 0, timer = null;
    const keyOf = i => (t.items[i].key ? 'P:' + t.items[i].key : 'LC' + (t.items[i].q || t.q)) + ':' + (t.items[i].label);

    function bestHtml() {
      const b = load();
      t.items.forEach((it, i) => { const r = b[keyOf(i)]; const el = root.querySelector(`[data-tybest="${i}"]`); if (el) el.textContent = r ? ` · ${r.wpm} WPM` : ''; });
    }
    function render() {
      linesEl.innerHTML = rows.map((r, i) => {
        const s = startCol(r);
        const chars = [...r.code].map((ch, j) => j < s ? `<span class="ty-ind">${ch === '\t' ? '    ' : ' '}</span>` : `<span class="ty-c" data-l="${i}" data-c="${j}">${esc(ch)}</span>`).join('');
        return `<div class="ty-line" data-line="${i}"><span class="ty-code">${chars}<span class="ty-c ty-enter" data-l="${i}" data-c="${r.code.length}">↲</span></span>${r.note ? `<span class="ty-note">// ${esc(r.note)}</span>` : ''}</div>`;
      }).join('');
      paint();
    }
    const cell = (l, c) => linesEl.querySelector(`.ty-c[data-l="${l}"][data-c="${c}"]`);
    function paint() {
      linesEl.querySelectorAll('.ty-cur').forEach(e => e.classList.remove('ty-cur'));
      const c = cell(E.li, E.ci);
      if (c && !E.done) { c.classList.add('ty-cur'); const ln = c.closest('.ty-line'); if (ln && ln.scrollIntoView) { const r = ln.getBoundingClientRect(), br = box.getBoundingClientRect(); if (r.bottom > br.bottom || r.top < br.top) ln.scrollIntoView({ block: 'center' }); } }
      $s('bar').style.width = (E.total ? Math.round(100 * E.correct / E.total) : 0) + '%';
    }
    function stats() {
      const secs = start ? (Date.now() - start) / 1000 : 0;
      const wpm = secs > 0 ? Math.round((E.correct / 5) / (secs / 60)) : 0;
      const acc = E.correct + E.errors ? Math.round(100 * E.correct / (E.correct + E.errors)) : 100;
      $s('time').textContent = Math.round(secs) + 's'; $s('wpm').textContent = wpm; $s('acc').textContent = acc + '%'; $s('err').textContent = E.errors;
      return { secs, wpm, acc };
    }
    function reset(i) {
      item = i; rows = linesOf(t, t.items[i]); E = engine(rows); start = 0;
      const hn = $s('hint'), hv = t.items[i].ask ? '❓ ' + t.items[i].ask : t.items[i].hint ? '💭 ' + t.items[i].hint : '';
      hn.hidden = !hv; hn.textContent = hv;
      const pk = $s('pick'), it = t.items[i];
      if (it.alts && !it.pick) it.pick = it.alts.map(a => ({ ap: a.ap, lv: a.lv }));
      pk.hidden = !it.pick;
      pk.innerHTML = it.pick ? `Revision me is question ka kaunsa level type karoge? ${it.pick.map(x => `<button type="button" class="btn small ${x.ap === it.ap ? 'primary' : ''}" data-typick="${x.ap}" data-tylv="${esc(x.lv)}">${esc(x.lv)}${x.lv === 'Optimal' ? ' (default)' : ''}</button>`).join(' ')} <span class="muted small">— choice yaad rahegi, har din ke revision me yahi aayega</span>` : '';
      clearInterval(timer); timer = null;
      root.querySelectorAll('[data-tyitem]').forEach(b => b.classList.toggle('primary', Number(b.dataset.tyitem) === i));
      root.querySelector('.ty-result').hidden = true;
      render(); stats();
    }
    function finish() {
      clearInterval(timer); const s = stats(); paint();
      const b = load(), k = keyOf(item), prev = b[k];
      const better = !prev || s.wpm > prev.wpm || (s.wpm === prev.wpm && s.acc > prev.acc);
      if (better) { b[k] = { wpm: s.wpm, acc: s.acc, at: new Date().toISOString().slice(0, 10) }; save(b); }
      const res = root.querySelector('.ty-result');
      res.hidden = false;
      res.innerHTML = `✅ <b>${esc(t.items[item].label)}</b> complete — <b>${s.wpm} WPM</b>, accuracy <b>${s.acc}%</b>, ${E.errors} galti, ${Math.round(s.secs)}s.${better ? ' 🏆 Naya best!' : prev ? ` (Best: ${prev.wpm} WPM)` : ''} ${item + 1 < t.items.length ? `<button type="button" class="btn small primary" data-tyitem="${item + 1}">Agla: ${esc(t.items[item + 1].label)} →</button>` : ''}`;
      bestHtml();
    }
    function press(ch) {
      if (E.done) return;
      if (!start) { start = Date.now(); timer = setInterval(stats, 500); }
      const r = E.press(ch), c = cell(r.l, r.c);
      if (r.ok) { if (c) c.classList.add(c.classList.contains('ty-bad') ? 'ty-fixed' : 'ty-ok'); }
      else if (c) { c.classList.add('ty-bad'); c.classList.remove('ty-flash'); void c.offsetWidth; c.classList.add('ty-flash'); }
      if (E.done) { finish(); return; }
      paint(); stats();
    }

    input.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') { e.preventDefault(); press('\n'); }
      else if (e.key === 'Tab' || e.key === 'Backspace') e.preventDefault();
      else if (e.key.length === 1) { e.preventDefault(); press(e.key); }
    });
    const focus = () => { input.focus({ preventScroll: true }); box.classList.add('focus'); };
    box.addEventListener('click', focus);
    input.addEventListener('blur', () => box.classList.remove('focus'));
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-tyitem]');
      if (b) { reset(Number(b.dataset.tyitem)); focus(); return; }
      const pb = e.target.closest('[data-typick]');
      if (pb) {
        const it = t.items[item], ap = Number(pb.dataset.typick);
        if (it.alts) {
          // planner item: code saath me (alts), choice item id pe save
          const a = it.alts.find(x => x.ap === ap) || it.alts[0];
          setLevelPref(it.key, a.lv);
          Object.assign(it, { ap, code: a.code, notes: a.notes, hint: a.hint || '', label: `${it.base} (${a.lv}${a.lv !== 'Optimal' ? ' — aapki choice' : ''})` });
        } else {
          const q = findQ(it.q);
          setLevelPref(it.q, pb.dataset.tylv);
          it.ap = ap; it.label = revLabel(it.q, it.name, q, ap); it.hint = ap === optIdx(q) ? brHint(q) : '';
        }
        const tab = root.querySelector(`.ty-tabs [data-tyitem="${item}"]`);
        if (tab) tab.firstChild.textContent = it.label;
        reset(item); bestHtml(); focus(); return;
      }
      if (e.target.closest('[data-tyrestart]')) { reset(item); focus(); }
    });
    bestHtml();
    reset(0);
  }

  function mount(root) { (root || document).querySelectorAll('.typing').forEach(mountOne); }
  // ---- Auto typing rules (user ke saath tay, 2026-11-22) ----
  //  roz ka revision  → sirf Optimal (+ "important doosra version": Recursive/Iterative jaisa extra level, ya memo/recursive Better) · Brute idea 1 line hint
  //  revision day (Sat) → saare levels
  //  learn day        → main question: Brute → (Better) → Optimal (+ extra levels)
  const findQ = n => { const C = window.PHASE_CONTENT || {}; for (const k in C) { const q = C[k].questions && C[k].questions[n]; if (q) return q; } return null; };
  const isCore = lv => /^(Brute|Better|Optimal)$/.test(lv);
  const optIdx = q => Math.max(0, q.approaches.map(a => a.level).lastIndexOf('Optimal'));
  function pickAps(q, mode) {
    const all = q.approaches.map((a, i) => i);
    if (mode === 'all') return all;
    const opt = optIdx(q);
    const extra = all.filter(i => i !== opt && (!isCore(q.approaches[i].level) || (q.approaches[i].level === 'Better' && /memo|recurs/i.test(q.approaches[i].idea || ''))));
    return [opt].concat(extra);
  }
  function brHint(q) {
    const b = q.approaches.find(a => a.level === 'Brute');
    return b ? `Brute (sirf yaad karo, type nahi): ${plain(b.idea)} — ${b.time}` : '';
  }
  // roz ke revision ka main item: Optimal, ya user ne jo level chuna (levelPref)
  function prefIdx(q, n, pref) {
    const lv = (pref || levelPref())[n];
    const i = lv ? q.approaches.map(a => a.level).lastIndexOf(lv) : -1;
    return i >= 0 ? i : optIdx(q);
  }
  const revLabel = (n, name, q, ap) => `LC ${n} · ${name} (${q.approaches[ap].level}${ap !== optIdx(q) ? ' — aapki choice' : ''})`;
  function itemsFor(n, name, mode, pref) {
    const q = findQ(n);
    if (!q || !q.approaches.length) return [];
    if (mode === 'daily') {
      const main = prefIdx(q, n, pref), opt = optIdx(q);
      const pick = q.approaches.map((a, i) => ({ ap: i, lv: a.level })).filter(x => isCore(x.lv));
      const extra = pickAps(q, 'daily').filter(ap => ap !== opt && ap !== main);
      return [{ label: revLabel(n, name, q, main), q: Number(n), ap: main, name, hint: main === opt ? brHint(q) : '', pick: pick.length > 1 ? pick : null }]
        .concat(extra.map(ap => ({ label: `LC ${n} · ${name} (${q.approaches[ap].level})`, q: Number(n), ap, hint: '' })));
    }
    const aps = mode === 'learn' ? q.approaches.map((a, i) => i) : pickAps(q, mode);
    return aps.map(ap => ({ label: `LC ${n} · ${name} (${q.approaches[ap].level})`, q: Number(n), ap, hint: '' }));
  }
  // Revision typing: Part 0 ki headings ke "LC 876 — …". mode: 'daily' (default) | 'all' (Saturday revision day)
  // extra: [{n, name}] — Part 0 me chhoote questions (app.js revExtra) bhi jodo
  function revisionBlock(L, mode, extra) {
    const p0 = (L.parts || [])[0];
    const seen = new Set(), items = [];
    if (p0 && /Part 0/.test(p0.title || '')) (p0.blocks || []).forEach(b => {
      const m = b.h && /LC\s*(\d+)/.exec(b.h);
      if (!m || seen.has(m[1])) return;
      seen.add(m[1]);
      const name = plain(b.h).replace(/^LC\s*\d+\s*[—-]\s*/, '').replace(/\s*\(.*\)\s*$/, '') || 'revision';
      items.push(...itemsFor(m[1], name, mode || 'daily'));
    });
    (extra || []).forEach(({ n, name }) => { if (!seen.has(String(n))) { seen.add(String(n)); items.push(...itemsFor(n, name, mode || 'daily')); } });
    return items.length ? { q: items[0].q, items } : null;
  }
  // Learn day: din ke har question (main pehle) ka typing part — us question ke aakhri {viz: n} part ke baad,
  // na ho toh uske {problem: n} part ke baad, warna end me. mkPart(block, n, isMain) → part object
  function withLearn(parts, L, d, nameOf, mkPart) {
    const main = L.main || (d.qs && d.qs[0]);
    const qs = [main].concat((d.qs || []).filter(q => q !== main)).filter(Boolean);
    const out = parts.slice();
    const lastIdx = f => { for (let i = out.length - 1; i >= 0; i--) if (!out[i].typingPart && (out[i].blocks || []).some(f)) return i; return -1; };
    qs.forEach(n => {
      const t = learnBlock(L, n, nameOf(n));
      if (!t) return;
      let at = lastIdx(b => b.viz === n);
      if (at < 0) at = lastIdx(b => b.problem === n);
      out.splice(at < 0 ? out.length : at + 1, 0, Object.assign({ typingPart: true, typingQ: n }, mkPart(t, n, n === main)));
    });
    return out;
  }
  // 🔁 Revision gaps: G = { globalDay: { type, qs, L } }. Learn day → kal (learn) ke jo questions Part 0 me nahi.
  // Revision day (ya hafte me revision day na ho toh mock day) → hafte ke learn days ke jo questions list me nahi.
  function p0Qs(L) {
    const s = new Set(), p0 = ((L && L.parts) || [])[0];
    if (p0 && /Part 0/.test(p0.title || '')) (p0.blocks || []).forEach(b => { const m = b.h && /LC\s*(\d+)/.exec(b.h); if (m) s.add(Number(m[1])); });
    return s;
  }
  function revGaps(G, n) {
    const x = G[n];
    if (!x) return [];
    const today = new Set(x.qs || []), out = [];
    const add = q => { if (!today.has(q) && !out.includes(q) && findQ(q)) out.push(q); };
    if (x.type === 'learn') {
      const prev = G[n - 1], have = p0Qs(x.L);
      if (prev && prev.type === 'learn') (prev.qs || []).forEach(q => { if (!have.has(q)) add(q); });
      return out;
    }
    const ws = Math.floor((n - 1) / 7) * 7;
    const weekHasRev = Object.keys(G).some(g => g > ws && g <= ws + 7 && G[g].type === 'revision');
    if (x.type === 'revision' || (x.type === 'mock' && !weekHasRev)) {
      for (let g = ws + 1; g < n; g++) if (G[g] && G[g].type === 'learn') (G[g].qs || []).forEach(add);
    }
    return out;
  }
  // [{n, name}] list se block (revision day: mode 'all')
  function qsBlock(list, mode) {
    const items = list.flatMap(({ n, name }) => itemsFor(n, name, mode));
    return items.length ? { q: items[0].q, items } : null;
  }
  // Learn day: main question ke saare levels (lesson me haath se typing block ho toh woh hi — ye nahi)
  function learnBlock(L, n, name) {
    const hasManual = (L.parts || []).some(p => (p.blocks || []).some(b => b.typing && Number(b.typing.q) === Number(n)));
    if (hasManual || !n) return null;
    const items = itemsFor(n, name || ('LC ' + n), 'learn');
    return items.length ? { q: Number(n), items } : null;
  }

  window.TYPING = { html, mount, linesOf, questionCode, engine, revisionBlock, learnBlock, qsBlock, pickAps, autoNote, revGaps, withLearn, levelPref, wrapProse, stripComment, plain };
})();
