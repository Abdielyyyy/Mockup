import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(project, 'dist');
let html = await readFile(path.join(dist, 'index.html'), 'utf8');
const script = html.match(/<script\b[^>]*src="(\/assets\/[^\"]+\.js)"[^>]*><\/script>/);
const stylesheet = html.match(/<link\b[^>]*href="(\/assets\/[^\"]+\.css)"[^>]*>/);
if (!script || !stylesheet) throw new Error('Expected Vite JavaScript and stylesheet assets in dist/index.html');
let css = await readFile(path.join(dist, stylesheet[1]), 'utf8');
for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
  const url = match[1].replace(/^["']|["']$/g, '');
  if (!url.startsWith('/assets/')) continue;
  if (!url.endsWith('.woff2')) throw new Error(`Unsupported bundled asset: ${url}`);
  const data = await readFile(path.join(dist, url));
  css = css.replace(match[0], `url("data:font/woff2;base64,${data.toString('base64')}")`);
}
let js = await readFile(path.join(dist, script[1]), 'utf8');
for (const match of [...js.matchAll(/"(\/assets\/[^"\s]+\.(png|svg|webp|jpg))"/g)]) {
  const data = await readFile(path.join(dist, match[1]));
  const mime = { png:'image/png', svg:'image/svg+xml', webp:'image/webp', jpg:'image/jpeg' }[match[2]];
  js = js.replaceAll(match[1], `data:${mime};base64,${data.toString('base64')}`);
}
html = html.replace(script[0], () => `<script type="module">${js.replaceAll('</script', '<\\/script')}</script>`);
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);
const favicon = await readFile(path.join(project, 'public/favicon.svg'));
html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml;base64,${favicon.toString('base64')}"`);
await writeFile(path.join(dist, 'mockup-preview.html'), html);
console.log('Standalone preview generated: dist/mockup-preview.html');
