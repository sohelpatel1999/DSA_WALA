#!/usr/bin/env node
// index.html me data/ aur viz/ ki saari files sahi order me load karta hai:
// roadmap → phase content → problems → lessons/days → visualizers.js (engine) → viz/* → planner (Switch Prep) → learn/game → app.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const list = dir => (fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.js')).sort() : []);
const data = list('data');
const content = data.filter(f => !/lessons|days|problems/.test(f));
const problems = data.filter(f => /problems/.test(f));
const lessons = data.filter(f => /lessons|days/.test(f));
const viz = list('viz');
const tags = ['roadmap.js', ...content.map(f => 'data/' + f), ...problems.map(f => 'data/' + f), ...lessons.map(f => 'data/' + f),
  'visualizers.js', ...viz.map(f => 'viz/' + f),
  // Switch Prep section: planner ke lessons (content planner/lessons me — lazy load; yahan sirf kit + manifest + renderer)
  'planner/lesson-kit.js', 'planner/lessons/manifest.js', 'planner/lesson-render.js', 'planner/typing-plan.js', 'planner-section.js',
  'typing.js', 'learn.js', 'game.js', 'app.js'].map(s => `  <script src="${s}"></script>`).join('\n');
const file = path.join(ROOT, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const start = html.indexOf('  <script src="roadmap.js"></script>'), end = html.indexOf('  <script src="app.js"></script>');
if (start < 0 || end < 0) throw new Error('index.html me roadmap.js / app.js script tags nahi mile');
html = html.slice(0, start) + tags + html.slice(end + '  <script src="app.js"></script>'.length);
fs.writeFileSync(file, html);
console.log(tags.split('\n').length + ' scripts:\n' + tags);
