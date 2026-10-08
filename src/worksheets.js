import './worksheets.css';

const groups = [
  { id:'risk', title:'Profil Risiko', items:[
    'Analisis Profil Risiko', 'Risiko Strategis', 'Risiko Operasional', 'Risiko Kredit',
    'Risiko Pasar', 'Risiko Likuiditas', 'Risiko Hukum', 'Risiko Kepatuhan', 'Risiko Reputasi',
  ] },
  { id:'governance', title:'Tata Kelola', items:[
    'Peringkat Komposit',
    'Faktor 1 Aspek Pemegang Saham',
    'Faktor 2 Pelaksanaan Tugas, Tanggung Jawab, dan Wewenang Direksi',
    'Faktor 3 Pelaksanaan Tugas, Tanggung Jawab, dan Wewenang Dewan Komisaris',
    'Faktor 4 Kelengkapan dan Pelaksanaan Tugas Komite',
    'Faktor 5 Penanganan Benturan Kepentingan',
    'Faktor 6 Penerapan Fungsi Kepatuhan',
    'Faktor 7 Penerapan Fungsi Audit Intern',
    'Faktor 8 Penerapan Fungsi Audit Ekstern',
    'Faktor 9 Penerapan Manajemen Risiko dan Strategi Anti Fraud, termasuk Sistem Pengendalian Intern',
    'Faktor 10 Batas Maksimum Pemberian Kredit',
    'Faktor 11 Integritas Pelaporan dan Sistem Teknologi Informasi',
    'Faktor 12 Rencana Bisnis',
  ] },
  { id:'earnings', title:'Rentabilitas', items:['Rentabilitas'] },
  { id:'capital', title:'Permodalan', items:['Permodalan'] },
  { id:'tks', title:'TKS', items:['Tingkat Kesehatan PVML'] },
];
const records = groups.flatMap(group => group.items.map((title,index) => ({
  id:`${group.id}-${index}`, group:group.id, title,
  status:group.id==='tks'?'Dalam Proses Review':'Selesai',
  note:'',
})));
const collapsed = new Set();
export const getTksWorksheetStatus = () => records.find(record=>record.group==='tks').status;
const statusOptions=['Belum diisi','Dalam Proses Review','Selesai'];
const escapeHTML = value => value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const actionIcon = action => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${action==='view'?'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>':'<path d="m15 4 5 5M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15Z"/>'}</svg>`;

function statusBadge(status) {
  return `<span class="work-status ${status==='Selesai'?'done':status==='Belum diisi'?'empty':'review'}"><i></i>${status}</span>`;
}

function worksheetTable(icon) {
  return `<div class="work-table-wrap" role="region" aria-label="Daftar kertas kerja penilaian TKS" tabindex="0"><table class="work-table"><caption class="sr-only">25 kertas kerja PT Sarana Kalteng Ventura dalam lima kelompok penilaian, beserta status dan aksi.</caption><colgroup><col class="work-name-column"><col class="work-status-column"><col class="work-action-column"></colgroup><thead><tr><th scope="col">Kertas Kerja</th><th scope="col">Status</th><th scope="col">Aksi</th></tr></thead>${groups.map(group=>`<tbody><tr class="work-group-row"><th colspan="3"><button class="work-group-toggle" data-work-group="${group.id}" aria-expanded="${!collapsed.has(group.id)}" aria-controls="work-items-${group.id}">${icon('chevron')}<span>Penilaian: ${group.title}</span><small>${group.items.length} kertas kerja</small></button></th></tr></tbody><tbody id="work-items-${group.id}" ${collapsed.has(group.id)?'hidden':''}>${records.filter(record=>record.group===group.id).map(record=>`<tr class="work-item-row" data-work-row="${record.id}"><th scope="row">${record.title}</th><td>${statusBadge(record.status)}</td><td><div class="work-actions"><button class="icon-button" data-work-view="${record.id}" aria-label="Lihat ${record.title}" title="Lihat ${record.title}">${actionIcon('view')}</button><button class="icon-button" data-work-edit="${record.id}" aria-label="Edit ${record.title}" title="Edit ${record.title}">${actionIcon('edit')}</button></div></td></tr>`).join('')}</tbody>`).join('')}</table></div>`;
}

export function worksheetPage(icon,company) {
  const completed=records.filter(record=>record.status==='Selesai').length;
  return `<button class="back-to-companies" id="back-to-companies">${icon('arrow')} Kembali ke daftar perusahaan</button>
    <div class="work-company-bar"><div><span class="work-company-code">${company.code}</span><span class="work-company-type">MV</span><h1>${company.name}</h1></div><span class="work-period">${company.period}</span></div>
    <section class="worksheet work-directory" aria-labelledby="work-directory-title"><header class="worksheet-heading"><div><span class="worksheet-icon">${icon('book')}</span><h2 id="work-directory-title">Daftar Kertas Kerja Penilaian Tingkat Kesehatan PVML</h2></div><div class="worksheet-badges"><span class="version-badge">Versi: 1</span>${statusBadge('Dalam Proses Review')}</div></header>
      <dl class="work-metadata"><div><dt>Jenis Penilaian</dt><dd>Rutin</dd></div><div><dt>Tanggal Penyusunan</dt><dd>31 Juli 2026</dd></div><div><dt>Periode Data Self Assessment</dt><dd>${company.period}</dd></div><div><dt>Tanggal Penyampaian Self Assessment</dt><dd>27 Juli 2026</dd></div><div><dt>Posisi Data PVML</dt><dd>${company.period}</dd></div></dl>
      <div class="work-table-toolbar"><span><strong>25</strong> kertas kerja <i></i> <strong>${completed}</strong> selesai</span><button class="text-button" id="toggle-all-work-groups">${collapsed.size===groups.length?'Buka semua kelompok':'Tutup semua kelompok'}</button></div><p class="work-scroll-hint">${icon('arrow')} Geser tabel untuk melihat status dan aksi.</p>${worksheetTable(icon)}
      <footer class="work-list-footer"><span>${icon('help')} Gunakan ikon kaca pembesar untuk melihat dan pensil untuk mengedit.</span><button class="button secondary" id="back-to-companies-bottom">Kembali ke daftar perusahaan ${icon('arrow')}</button></footer>
    </section><p class="work-demo-note">Data dan status merupakan simulasi. Perubahan catatan dan status hanya berlaku selama halaman mockup ini tidak dimuat ulang.</p>`;
}

function showWorksheetDialog(record,editing,company,rerender) {
  const root=document.querySelector('#modal-root');
  const origin=document.activeElement;
  root.innerHTML=`<dialog class="work-dialog" aria-labelledby="work-dialog-title"><button class="icon-button work-dialog-close" aria-label="Tutup kertas kerja">${'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>'}</button><div class="section-tag">${editing?'EDIT':'LIHAT'} KERTAS KERJA</div><h2 id="work-dialog-title">${record.title}</h2><p class="work-dialog-company">${company.name} <span>·</span> ${company.period}</p>${editing?`<form id="work-edit-form"><label for="work-edit-status">Status</label><select id="work-edit-status">${statusOptions.map(status=>`<option ${status===record.status?'selected':''}>${status}</option>`).join('')}</select><label for="work-edit-note">Catatan penilaian</label><textarea id="work-edit-note" rows="5" maxlength="3000" placeholder="Tambahkan catatan penilaian untuk mockup…">${escapeHTML(record.note)}</textarea><p class="work-edit-note">Perubahan ini merupakan simulasi untuk mockup.</p><div class="work-dialog-buttons"><button type="button" class="button secondary" data-dialog-cancel>Batal</button><button type="submit" class="button primary">Simpan perubahan</button></div></form>`:`<dl class="work-view-info"><div><dt>Status</dt><dd>${statusBadge(record.status)}</dd></div><div><dt>Catatan penilaian</dt><dd class="work-view-note">${record.note?escapeHTML(record.note):'<span class="muted">Belum ada catatan penilaian.</span>'}</dd></div></dl><div class="work-dialog-buttons"><button class="button secondary" data-dialog-cancel>Tutup</button><button class="button primary" id="work-view-edit">Edit kertas kerja</button></div>`}</dialog>`;
  const dialog=root.querySelector('dialog');
  dialog.showModal();
  const close=()=>dialog.close();
  root.querySelectorAll('.work-dialog-close,[data-dialog-cancel]').forEach(button=>button.onclick=close);
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)close();
  });
  dialog.addEventListener('close',()=>{if(origin?.isConnected)origin.focus({preventScroll:true});});
  document.querySelector('#work-view-edit')?.addEventListener('click',()=>{dialog.close();showWorksheetDialog(record,true,company,rerender);});
  document.querySelector('#work-edit-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const status=document.querySelector('#work-edit-status').value;
    if(!statusOptions.includes(status))return;
    record.status=status;
    record.note=document.querySelector('#work-edit-note').value;
    dialog.close();
    rerender(false);
    document.querySelector(`[data-work-edit="${record.id}"]`)?.focus({preventScroll:true});
  });
}

export function bindWorksheetPage(icon,company,rerender,back) {
  document.querySelector('#back-to-companies-bottom')?.addEventListener('click',back);
  document.querySelectorAll('[data-work-group]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.workGroup;
    const open=button.getAttribute('aria-expanded')!=='true';
    if(open)collapsed.delete(id);else collapsed.add(id);
    button.setAttribute('aria-expanded',String(open));
    document.querySelector(`#work-items-${id}`).hidden=!open;
    document.querySelector('#toggle-all-work-groups').textContent=collapsed.size===groups.length?'Buka semua kelompok':'Tutup semua kelompok';
  }));
  document.querySelector('#toggle-all-work-groups')?.addEventListener('click',()=>{
    const open=collapsed.size===groups.length;
    groups.forEach(group=>{if(open)collapsed.delete(group.id);else collapsed.add(group.id);});
    rerender(false);
    document.querySelector('#toggle-all-work-groups')?.focus({preventScroll:true});
  });
  for(const action of ['view','edit'])document.querySelectorAll(`[data-work-${action}]`).forEach(button=>button.addEventListener('click',()=>{
    const record=records.find(item=>item.id===button.getAttribute(`data-work-${action}`));
    if(record)showWorksheetDialog(record,action==='edit',company,rerender);
  }));
}
