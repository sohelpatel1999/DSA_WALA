// Planner lessons ka manifest banao: node planner/tools/build.js
// lessons/*.js scan → lessons/manifest.js (id → file + planner items ka title/topic). Naya lesson file add karne ke baad chalao.
const fs = require('fs');
const path = require('path');
const { LESSON_DIR, plannerItems, loadLessons, manifestText } = require('./_load');

const items = plannerItems();
const { fileOf, dupes } = loadLessons();
if (dupes.length) { console.error('Duplicate lesson ids: ' + dupes.join(', ')); process.exit(1); }
const ids = new Set(items.map(i => i.id));
const unknown = Object.keys(fileOf).filter(id => !ids.has(id));
if (unknown.length) { console.error('Ye ids planner me nahi hain: ' + unknown.join(', ')); process.exit(1); }
fs.writeFileSync(path.join(LESSON_DIR, 'manifest.js'), manifestText(items, fileOf));
console.log(`manifest.js: ${Object.keys(fileOf).length} lessons ready / ${items.length} planner items`);
