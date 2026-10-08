import './health.css';
import { worksheetPage, bindWorksheetPage, getTksWorksheetStatus } from './worksheets.js';
import { outputPage, bindOutputPage } from './health-output.js';

const company = {
  name: 'PT Sarana Kalteng Ventura',
  code: 'SKV-001',
  sector: 'Modal Ventura',
  province: 'Kalimantan Tengah',
  office: 'Kantor OJK Provinsi Kalimantan Tengah',
  period: 'Juni 2026',
  capital: 303376303352,
  assets: 2023620826771,
};

let selected = false;
let showingOutput = false;
let outputOrigin = null;
let search = '';

export function resetHealthView() {
  selected = false;
  showingOutput = false;
  outputOrigin = null;
  search = '';
}

const simulationNote = icon => `<div class="simulation-note">${icon('help')}<span><strong>Data simulasi.</strong> Nama perusahaan digunakan untuk contoh tampilan. Identitas, informasi keuangan, bobot, dan hasil penilaian pada mockup ini bukan data resmi perusahaan.</span></div>`;

function companyRow(icon) {
  return `<button class="company-row" data-company="skv" aria-label="Lihat tingkat kesehatan PT Sarana Kalteng Ventura"><span class="company-main"><span class="company-logo">SKV</span><span><strong>${company.name}</strong><small>${company.code} <span>·</span> ${company.province}</small></span></span><span class="company-sector">${company.sector}</span><span class="company-period">${company.period}</span><span class="assessment-status"><i></i> Dalam proses</span><span class="company-action">Lihat penilaian ${icon('arrow')}</span></button>`;
}

function listPage(icon) {
  return `<div class="page-heading"><div><div class="section-tag">PENILAIAN TKS</div><h1>Tingkat Kesehatan PVML<span class="heading-dot">.</span></h1><p class="muted">Pilih perusahaan untuk melihat detail dan kertas kerja penilaian tingkat kesehatan.</p></div><span class="outline-badge">${icon('building')} Direktori perusahaan</span></div>
    <section class="directory-intro"><div class="directory-symbol">${icon('activity')}</div><div><span class="section-tag">MULAI DARI PERUSAHAAN</span><h2>Kenali kondisi. Pahami penilaiannya.</h2><p>Daftar kertas kerja dan status penyusunan penilaian dalam satu ruang.</p></div><span class="directory-count"><strong>01</strong><span>PERUSAHAAN CONTOH</span></span></section>
    <section class="company-directory" aria-labelledby="company-list-title"><div class="directory-toolbar"><div><h2 id="company-list-title">Daftar perusahaan PVML</h2><p>Klik perusahaan untuk membuka detail penilaian.</p></div><div class="company-search"><label class="sr-only" for="company-search">Cari perusahaan PVML</label><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" id="company-search" placeholder="Cari nama perusahaan…" autocomplete="off"></div></div>
    <div class="company-columns" aria-hidden="true"><span>Nama perusahaan</span><span>Jenis lembaga</span><span>Periode data</span><span>Status penilaian</span><span></span></div><div id="company-results">${companyRow(icon)}</div><div class="directory-footer"><span id="company-result-count" role="status" aria-live="polite">Menampilkan 1 dari 1 perusahaan</span><span>Data contoh <i></i> Juni 2026</span></div></section>
    ${simulationNote(icon)}`;
}

export function healthPage(icon) {
  if (selected && showingOutput) return outputPage(icon, company, getTksWorksheetStatus(), simulationNote);
  return selected ? worksheetPage(icon, company) : listPage(icon);
}

export function healthPageTitle() {
  return !selected ? 'Tingkat Kesehatan PVML' : showingOutput ? 'Output Kertas Kerja Penilaian TKS' : 'Daftar Kertas Kerja Penilaian TKS';
}

export function bindHealthPage(icon, rerender) {
  if (selected && showingOutput) {
    bindOutputPage(icon);
    document.querySelectorAll('[data-back-to-worksheets]').forEach(button => button.addEventListener('click', () => {
      showingOutput = false;
      rerender();
      document.querySelector(`[data-work-edit="${outputOrigin}"]`)?.focus();
    }));
    return;
  }
  const openCompany = () => {
    selected = true;
    rerender();
    window.scrollTo({top: 0, behavior: 'instant'});
  };
  document.querySelector('[data-company]')?.addEventListener('click', openCompany);
  const back = () => {
    selected = false;
    rerender();
    document.querySelector('[data-company]')?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  };
  document.querySelector('#back-to-companies')?.addEventListener('click', back);
  const openOutput = record => {
    outputOrigin = record.id;
    showingOutput = true;
    rerender();
    window.scrollTo({top: 0, behavior: 'instant'});
  };
  if (selected) bindWorksheetPage(icon, company, rerender, back, openOutput);
  const input = document.querySelector('#company-search');
  if (!input) return;
  input.value = search;
  const updateResults = () => {
    search = input.value;
    const matches = `${company.name} ${company.code} ${company.sector} ${company.province}`.toLocaleLowerCase('id-ID').includes(search.trim().toLocaleLowerCase('id-ID'));
    document.querySelector('#company-results').innerHTML = matches ? companyRow(icon) : `<div class="company-empty">${icon('building')}<h3>Perusahaan tidak ditemukan</h3><p>Coba nama atau kata kunci lain.</p><button class="button secondary" id="reset-company-search">Reset pencarian</button></div>`;
    document.querySelector('#company-result-count').textContent = `Menampilkan ${matches ? 1 : 0} dari 1 perusahaan`;
    document.querySelector('[data-company]')?.addEventListener('click', openCompany);
    document.querySelector('#reset-company-search')?.addEventListener('click', () => { input.value = ''; updateResults(); input.focus(); });
  };
  input.addEventListener('input', updateResults);
  if (search) updateResults();
}
