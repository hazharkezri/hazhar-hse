const fs = require('fs');
const path = 'C:/Users/laptopMad/Documents/hazhar-hse/';
const html = fs.readFileSync(path + 'index.html', 'utf8');

function attr(re, s) {
  const out = [];
  let m;
  const rx = new RegExp(re, 'g');
  while ((m = rx.exec(s))) out.push(m[1]);
  return out;
}

const envs = attr('data-en="([^"]*)"', html);
const uniq = [...new Set(envs)];

const dicts = ['ar', 'ckb', 'kmr'];
let anyMissing = false;
for (const lang of dicts) {
  let s = fs.readFileSync(path + 'translations-' + lang + '.js', 'utf8').trim();
  s = s.replace(/^window\.T_\w+\s*=\s*/, '').replace(/;\s*$/, '');
  const d = eval('(' + s + ')');
  const missing = uniq.filter((k) => d[k] === undefined);
  console.log(lang + ': ' + uniq.length + ' unique data-en; missing in dict: ' + missing.length);
  if (missing.length) {
    anyMissing = true;
    console.log('   ' + missing.join(' | '));
  }
}
console.log('RESULT: ' + (anyMissing ? 'MISSING KEYS' : 'ALL OK'));
process.exit(anyMissing ? 1 : 0);
