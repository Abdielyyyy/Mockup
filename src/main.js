import '@fontsource-variable/dm-sans';
import '@fontsource-variable/manrope';
import './style.css';
import { healthPage, healthOutputPage, bindHealthPage, bindHealthOutputPage, resetHealthView } from './health.js';
import { dashboardPage, bindDashboard } from './dashboard.js';
import ojkLogo from './assets/ojk-logo.png';

const app = document.querySelector('#app');
const icons = {
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 11v-3a5 5 0 0 0-3-4"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12l9 3 9-3m-9 1v4"/>',
  trend: '<path d="m3 17 6-6 4 4 8-10m-6 0h6v6"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  book: '<path d="M12 5v16M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-2-10 1Z"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  logout: '<path d="M9 4H4v16h5m5-13 5 5-5 5m-6-5h13"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="m3 3 18 18M9 5a12 12 0 0 1 3 0c6 0 10 7 10 7a20 20 0 0 1-3 4M6 6a22 22 0 0 0-4 6s4 7 10 7a12 12 0 0 0 5-1"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  building: '<path d="M4 21V7l8-4 8 4v14M2 21h20M9 21v-5h6v5M8 8h1m6 0h1M8 12h1m6 0h1"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;
const brand = () => `<img class="ojk-logo" src="${ojkLogo}" alt="OJK — Otoritas Jasa Keuangan" width="1877" height="838">`;
const pages = { home: 'Beranda', know: 'Know Your PVML', health: 'Daftar Kertas Kerja Penilaian TKS', healthOutput: 'Output Kertas Kerja Penilaian TKS' };
let activePage = 'home';
let healthMenuExpanded = false;
let userName = 'Pengguna';
try { userName = sessionStorage.getItem('pvml-user') || 'Pengguna'; } catch {}
const escapeHTML = (value) => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function login() {
  document.title = 'Masuk — Sistem Pengawasan PVML';
  app.innerHTML = `<main class="login-layout">
    <section class="login-story login-supervision">
      <div class="login-decoration" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="login-identity"><div class="brand">${brand()}</div><h1>Sistem Pengawasan<br><span>PVML</span></h1></div>
    </section>
    <section class="login-form-area">
      <span class="mockup-label"><span></span> MOCKUP INTERAKTIF</span>
      <div class="login-form-wrap"><h2>Masuk</h2>
        <form id="login-form">
          <label for="email">Alamat email</label><div class="input-wrap">${icon('mail')}<input id="email" name="email" type="email" placeholder="nama@lembaga.co.id" autocomplete="username" required maxlength="120"></div>
          <div class="password-label"><label for="password">Kata sandi</label><button type="button" class="text-button" data-help="password">Bantuan masuk</button></div>
          <div class="input-wrap">${icon('lock')}<input id="password" name="password" type="password" placeholder="Masukkan kata sandi" autocomplete="current-password" required><button type="button" id="toggle-password" class="icon-button" aria-label="Tampilkan kata sandi" aria-pressed="false">${icon('eye')}</button></div>
          <p class="login-note">Gunakan email dan kata sandi apa pun untuk mencoba mockup.</p>
          <button class="button primary full" type="submit">Masuk ke sistem ${icon('arrow')}</button>
        </form>
        <div class="divider"><span>atau gunakan akun demo</span></div>
        <button class="button secondary full" id="demo-login">Coba akun demo ${icon('arrow')}</button>
        <div class="demo-notice">${icon('shield')}<span>Mode demonstrasi. Tidak terhubung ke sistem OJK<br>dan tidak menyimpan kata sandi Anda.</span></div>
      </div>
      <footer class="login-footer"><span>© ${new Date().getFullYear()} Sistem Pengawasan PVML</span><span>Mockup · Data simulasi</span></footer>
    </section>
  </main><div id="modal-root"></div>`;
  document.querySelector('#login-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.querySelector('#email').value.split('@')[0].replace(/[._-]/g, ' ');
    enter(name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Pengguna');
  });
  document.querySelector('#demo-login').addEventListener('click', () => enter('Pengguna Demo'));
  document.querySelector('#toggle-password').addEventListener('click', event => {
    const input = document.querySelector('#password');
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    event.currentTarget.innerHTML = icon(visible ? 'eyeOff' : 'eye');
    event.currentTarget.setAttribute('aria-label', visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
    event.currentTarget.setAttribute('aria-pressed', String(visible));
  });
  bindHelp();
}

function enter(name) {
  userName = name;
  activePage = 'home';
  healthMenuExpanded = false;
  resetHealthView();
  try { sessionStorage.setItem('pvml-user', name); } catch {}
  shell();
}

function shell() {
  app.innerHTML = `<div class="app-layout">
    <button class="sidebar-backdrop" aria-label="Tutup navigasi"></button>
    <aside class="sidebar" aria-label="Menu utama"><a class="brand" href="#home" data-page="home">${brand()}</a>
      <div class="nav-label">MENU UTAMA</div><nav>${['home','know'].map(key => `<button class="nav-item ${activePage === key ? 'active' : ''}" data-page="${key}">${icon(key === 'home' ? 'home' : 'book')}<span>${pages[key]}</span>${icon('chevron', 'nav-chevron')}</button>`).join('')}
        <div class="health-nav-group"><button id="health-menu-toggle" class="nav-item health-menu-toggle" aria-expanded="${healthMenuExpanded}" aria-controls="health-submenu">${icon('activity')}<span>Tingkat Kesehatan PVML</span>${icon('chevron','nav-chevron')}</button><div id="health-submenu" class="health-submenu" ${healthMenuExpanded ? '' : 'hidden'}>${['health','healthOutput'].map(key => `<button class="nav-subitem" data-page="${key}"><span class="submenu-marker" aria-hidden="true"></span><span>${pages[key]}</span></button>`).join('')}</div></div>
      </nav>
      <div class="sidebar-bottom"><button id="logout" class="logout-button">${icon('logout')} Keluar dari sistem</button><div class="sidebar-version">PENGAWASAN PVML <span>DEMO V.1.0</span></div></div>
    </aside>
    <div class="workspace"><header class="topbar"><div class="breadcrumb"><button id="mobile-menu" class="icon-button" aria-label="Buka navigasi" aria-expanded="false">${icon('menu')}</button><span>Pengawasan PVML</span>${icon('chevron')}<strong id="breadcrumb-current">${pages[activePage]}</strong></div><div class="topbar-right"><span class="demo-pill"><span></span> Mode demo</span><button class="icon-button help-button" data-help="portal" aria-label="Tentang portal">${icon('help')}</button><span class="header-separator"></span><div class="user-profile"><span class="avatar">${escapeHTML(userName.slice(0, 1).toUpperCase())}</span><span><strong>${escapeHTML(userName)}</strong><small>Akses demonstrasi</small></span></div></div></header>
      <main id="page-content" tabindex="-1"></main>
      <footer class="app-footer"><span>© ${new Date().getFullYear()} Sistem Pengawasan PVML · Mockup</span><span>Data simulasi <i></i><i></i><i></i></span></footer>
    </div>
  </div><div id="modal-root"></div>`;
  document.querySelector('#logout').addEventListener('click', () => {
    try { sessionStorage.removeItem('pvml-user'); } catch {}
    login();
  });
  document.querySelector('#mobile-menu').addEventListener('click', () => setSidebar(!document.querySelector('.app-layout').classList.contains('nav-open')));
  document.querySelector('.sidebar-backdrop').addEventListener('click', () => setSidebar(false));
  document.querySelector('#health-menu-toggle').addEventListener('click', () => setHealthMenu(!healthMenuExpanded));
  document.addEventListener('keydown', sidebarEscape);
  renderPage(false);
  bindHelp();
}

function setSidebar(open) {
  document.querySelector('.app-layout')?.classList.toggle('nav-open', open);
  document.querySelector('#mobile-menu')?.setAttribute('aria-expanded', String(open));
}
function sidebarEscape(event) { if (event.key === 'Escape') setSidebar(false); }

function setHealthMenu(expanded) {
  healthMenuExpanded = expanded;
  document.querySelector('#health-menu-toggle').setAttribute('aria-expanded', String(expanded));
  document.querySelector('#health-submenu').hidden = !expanded;
}


function knowPage() {
  const sectors = [
    ['building', '01', 'Pembiayaan', 'Mendukung kebutuhan produktif dan konsumtif.', 'Perusahaan pembiayaan menyediakan pendanaan untuk kebutuhan barang atau jasa, termasuk kegiatan usaha dan kebutuhan masyarakat.'],
    ['layers', '02', 'Modal Ventura', 'Mendampingi pertumbuhan dan pengembangan usaha.', 'Perusahaan modal ventura membantu pengembangan usaha melalui penyertaan modal dan/atau pembiayaan sesuai ketentuan yang berlaku.'],
    ['shield', '03', 'Lembaga Keuangan Mikro', 'Memperluas akses keuangan bagi masyarakat.', 'Lembaga keuangan mikro memberikan layanan keuangan untuk mendukung usaha mikro dan pemberdayaan masyarakat.'],
  ];
  return `<div class="page-heading"><div><div class="section-tag">MENGENAL LEBIH DEKAT</div><h1>Know Your PVML<span class="heading-dot">.</span></h1><p class="muted">Kenali sektor, pahami perannya, temukan perspektif yang lebih luas.</p></div><span class="outline-badge">${icon('book')} Pusat pengenalan</span></div>
    <section class="intro-card"><div class="intro-icon">${icon('layers')}</div><div><span class="section-tag">SEKILAS TENTANG PVML</span><h2>Beragam peran. Satu ekosistem.</h2><p>PVML mencakup sektor pembiayaan, modal ventura, lembaga keuangan mikro, serta lembaga jasa keuangan lainnya. Portal ini menjadi titik awal untuk mengenal ekosistem tersebut.</p></div></section>
    <div class="section-heading"><h2>Kenali beberapa sektornya</h2><span>Pilih kartu untuk membaca lebih lanjut.</span></div>
    <div class="sector-grid">${sectors.map(([name, number, title, description, detail]) => `<details class="sector-card"><summary><div class="card-top"><span class="card-icon">${icon(name)}</span><span class="card-index">${number}</span></div><h3>${title}</h3><p>${description}</p><span class="card-link"><span class="detail-closed">Baca lebih lanjut</span><span class="detail-open">Tutup penjelasan</span>${icon('chevron')}</span></summary><div class="sector-detail">${detail}</div></details>`).join('')}</div>
    <div class="next-step"><div><span class="section-tag">LANGKAH BERIKUTNYA</span><h3>Sudah mengenal? Lanjutkan eksplorasi Anda.</h3><p class="muted">Kunjungi ruang tingkat kesehatan PVML.</p></div><button class="button primary" data-page="health">Tingkat kesehatan ${icon('arrow')}</button></div><p class="content-note">Konten pengenalan pada mockup ini bersifat ilustratif, bukan informasi atau panduan resmi OJK.</p>`;
}

function renderPage(focus = true) {
  document.querySelector('#page-content').innerHTML = activePage === 'home' ? dashboardPage(icon) : activePage === 'know' ? knowPage() : activePage === 'healthOutput' ? healthOutputPage(icon) : healthPage(icon);
  document.querySelector('#breadcrumb-current').textContent = pages[activePage];
  document.title = `${pages[activePage]} — Sistem Pengawasan PVML`;
  const healthActive = activePage === 'health' || activePage === 'healthOutput';
  document.querySelector('#health-menu-toggle').classList.toggle('active', healthActive);
  if (healthActive) setHealthMenu(true);
  document.querySelectorAll('.nav-item[data-page], .nav-subitem').forEach(button => {
    const selected = button.dataset.page === activePage;
    button.classList.toggle('active', selected);
    if (selected) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-page]').forEach(button => button.onclick = event => {
    event.preventDefault();
    activePage = button.dataset.page;
    resetHealthView();
    setSidebar(false);
    renderPage();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  if (activePage === 'health') bindHealthPage(icon, renderPage);
  if (activePage === 'healthOutput') bindHealthOutputPage(icon);
  if (activePage === 'home') bindDashboard(renderPage);
  if (focus) document.querySelector('#page-content').focus({ preventScroll: true });
}

function bindHelp() {
  document.querySelectorAll('[data-help]').forEach(button => button.addEventListener('click', () => {
    const password = button.dataset.help === 'password';
    const root = document.querySelector('#modal-root');
    root.innerHTML = `<dialog class="help-dialog"><button class="icon-button dialog-close" aria-label="Tutup bantuan">${icon('close')}</button><span class="card-icon">${icon('help')}</span><h2>${password ? 'Masuk ke mode demo' : 'Tentang mockup ini'}</h2><p>${password ? 'Masukkan email yang valid dan kata sandi apa pun, atau gunakan tombol “Coba akun demo”. Tidak diperlukan akun sungguhan.' : 'Portal ini adalah mockup interaktif dengan palet merah, hitam, dan putih yang terinspirasi OJK. Ini bukan situs resmi OJK. Halaman tingkat kesehatan menyediakan daftar perusahaan dan kertas kerja penilaian dengan data simulasi berdasarkan contoh Anda.'}</p><button class="button primary dialog-done">Mengerti ${icon('arrow')}</button></dialog>`;
    const dialog = root.querySelector('dialog');
    dialog.showModal();
    root.querySelectorAll('.dialog-close, .dialog-done').forEach(close => close.onclick = () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
  }));
}

let existingSession = false;
try { existingSession = Boolean(sessionStorage.getItem('pvml-user')); } catch {}
if (existingSession) shell(); else login();
