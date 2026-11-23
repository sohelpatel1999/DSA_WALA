// Planner ki asli scheduling logic (switch-prep-planner.html se) Node me chalao — tests / tools ke liye.
// Planner ka code copy nahi kiya: HTML se "Plan content" se "State" tak ka hissa evaluate hota hai (DSA, TH, applyConfig, schedule, …).
const fs = require('fs');
const path = require('path');

function loadPlanner() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'switch-prep-planner.html'), 'utf8');
  const a = html.indexOf('const LC = s =>'), b = html.indexOf('/* ===== State');
  if (a < 0 || b < 0) throw new Error('planner logic nahi mili (markers badle?)');
  // eslint-disable-next-line no-new-func
  return new Function(html.slice(a, b) + '\nreturn { DSA, TH, ALL_ITEMS, BY_ID, applyConfig, schedule, addDays, dayDiff, nextReview, get START() { return START; }, get END() { return END; } };')();
}

// state ke saath `today` se aage ke din: { date: [ids] } (dsa + th, planner jaisa hi order)
function daysFrom(P, st, today, n) {
  P.applyConfig(st.cfg);
  const plan = P.schedule(st, today), out = {};
  for (let k = 0; k < n; k++) {
    const d = P.addDays(today, k), rec = plan.days[d] || { dsa: [], th: [] };
    out[d] = rec.dsa.concat(rec.th);
  }
  return out;
}

module.exports = { loadPlanner, daysFrom };
