import './supervisory.css';

const company = 'PT Sarana Kalteng Ventura';
const plan = { year:2026, latest:'2025-12-17', monitored:'' };
const statuses = ['Belum Dimulai', 'Dalam Proses', 'Selesai'];
const rows = [
  { id:'governance', focus:'UTAMA', object:'Tata Kelola', strategy:'Pengawasan Langsung', description:'Melakukan pemeriksaan on site pada tahun 2026', status:'Selesai', note:'Pengawas telah melakukan pemeriksaan on site terkait tata kelola dan memberikan pembinaan kepada PT Sarana Kalteng Ventura, terdokumentasi pada surat pembinaan pengawas tanggal 19 Juni 2026 (simulasi).' },
  { id:'compliance', focus:'UTAMA', object:'Risiko Kepatuhan', strategy:'Pengawasan Langsung', description:'Melakukan pemeriksaan on site pada tahun 2026', status:'Selesai', note:'Pengawas telah melakukan pemeriksaan on site terkait risiko kepatuhan dan memberikan pembinaan kepada PT Sarana Kalteng Ventura, terdokumentasi pada surat pembinaan pengawas tanggal 19 Juni 2026 (simulasi).' },
];
let documents = [];
let fileMessage = '';
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel = value => value ? value.split('-').reverse().join('/') : '—';
const pencil = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 4 5 5M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15Z"/></svg>';

export function supervisoryPage(icon) {
  return `<div class="supervisory-trail"><span>Supervisory Plan PVML</span>${icon('chevron')}<span>Pemantauan Supervisory Plan</span></div>
    <div class="work-company-bar supervisory-company"><div><span class="work-company-code">SKV-001</span><span class="work-company-type">MV</span><h1>${company}</h1></div><div class="supervisory-year"><span>${plan.year}</span><button class="icon-button" id="edit-supervisory-plan" aria-label="Edit periode dan tanggal Supervisory Plan" title="Edit periode dan tanggal">${pencil}</button></div></div>
    <section class="supervisory-panel" aria-labelledby="supervisory-title"><header class="supervisory-heading"><h2 id="supervisory-title">Pemantauan Supervisory Plan</h2><div class="supervisory-badges"><span>Versi: 1</span><span class="supervisory-draft">Draft</span></div></header>
      <dl class="supervisory-metadata"><div><dt>Tanggal Supervisory Plan Versi Terkini</dt><dd>${dateLabel(plan.latest)}</dd></div><div><dt>Tanggal Pemantauan Supervisory Plan yang Terkini</dt><dd>${dateLabel(plan.monitored)}</dd></div></dl>
      <div class="supervisory-section"><p class="supervisory-scroll-hint">${icon('arrow')} Geser tabel untuk melihat seluruh kolom.</p><div class="supervisory-table-wrap" role="region" aria-label="Tabel pemantauan Supervisory Plan" tabindex="0"><table class="supervisory-table supervisory-monitoring"><caption class="sr-only">Pemantauan Supervisory Plan ${company}, tahun ${plan.year}. Data simulasi.</caption><colgroup><col style="width:10%"><col style="width:9%"><col style="width:12%"><col style="width:18%"><col style="width:8%"><col style="width:37%"><col style="width:6%"></colgroup><thead><tr>${['Fokus Pengawasan','Objek','Strategi Pengawasan','Uraian Strategi Pengawasan','Status','Keterangan','Aksi'].map(title=>`<th scope="col">${title}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr data-plan-row="${row.id}"><td>${row.focus}</td><th scope="row">${row.object}</th><td>${row.strategy}</td><td>${escapeHTML(row.description)}</td><td><span class="supervisory-status ${row.status==='Selesai'?'completed':''}">${row.status}</span></td><td class="supervisory-note">${escapeHTML(row.note)}</td><td class="supervisory-action"><button class="text-button" data-plan-edit="${row.id}" aria-label="Edit pemantauan ${row.object}">Edit</button></td></tr>`).join('')}</tbody></table></div></div>
      <section class="supervisory-section supervisory-history" aria-labelledby="supervisory-history-title"><h3 id="supervisory-history-title">Riwayat Persetujuan Penyusunan dan Penginian Supervisory Plan</h3><div class="supervisory-table-wrap" role="region" aria-label="Riwayat persetujuan Supervisory Plan" tabindex="0"><table class="supervisory-table supervisory-approval"><thead><tr>${['Jenis Dokumen','Tanggal Penyusunan','Tanggal Persetujuan','Approver','Level Approver'].map(title=>`<th scope="col">${title}</th>`).join('')}</tr></thead><tbody><tr><td>Penyusunan</td><td>17-12-2025</td><td>24-12-2025</td><td>pengawas_demo</td><td>Kepala Bagian</td></tr></tbody></table></div></section>
      <section class="supervisory-section supervisory-documents" aria-labelledby="supervisory-documents-title"><div class="supervisory-upload-row"><div><h3 id="supervisory-documents-title">Dokumen Pendukung:</h3><p>Maksimal ukuran file 25 MB per file. Format: docx, xlsx, pptx, pdf, zip.</p></div><button class="button primary" id="choose-plan-files">Pilih File</button><input type="file" id="plan-files" accept=".docx,.xlsx,.pptx,.pdf,.zip" multiple hidden></div><p class="supervisory-file-message" role="status" aria-live="polite">${escapeHTML(fileMessage)}</p>${documents.length?`<ul class="supervisory-file-list">${documents.map((file,index)=>`<li><span>${icon('book')}<span>${escapeHTML(file.name)}<small>${(file.size/1024/1024).toLocaleString('id-ID',{maximumFractionDigits:2})} MB</small></span></span><button class="icon-button" data-remove-plan-file="${index}" aria-label="Hapus dokumen ${escapeHTML(file.name)}">${icon('close')}</button></li>`).join('')}</ul>`:''}<p class="supervisory-local-note">File hanya dipilih untuk demonstrasi dan tidak diunggah ke server.</p></section>
    </section><p class="work-demo-note">Data Supervisory Plan merupakan simulasi. Perubahan dan daftar dokumen berlaku selama halaman ini tidak dimuat ulang.</p>`;
}

function showDialog(icon,title,fields,onSave,focusOrigin) {
  const root=document.querySelector('#modal-root');
  const origin=document.activeElement;
  root.innerHTML=`<dialog class="supervisory-dialog" aria-labelledby="supervisory-dialog-title"><button class="icon-button supervisory-dialog-close" aria-label="Tutup editor">${icon('close')}</button><div class="section-tag">SUPERVISORY PLAN</div><h2 id="supervisory-dialog-title">${title}</h2><p>${company}</p><form id="supervisory-edit-form">${fields}<div class="supervisory-dialog-actions"><button type="button" class="button secondary" data-plan-cancel>Batal</button><button type="submit" class="button primary">Simpan perubahan</button></div></form></dialog>`;
  const dialog=root.querySelector('dialog');
  dialog.showModal();
  root.querySelectorAll('.supervisory-dialog-close,[data-plan-cancel]').forEach(button=>button.onclick=()=>dialog.close());
  dialog.addEventListener('close',()=>{if(origin?.isConnected)origin.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();});
  root.querySelector('form').addEventListener('submit',event=>{
    event.preventDefault();
    onSave(new FormData(event.currentTarget),()=>dialog.close());
    document.querySelector(focusOrigin)?.focus({preventScroll:true});
  });
}

export function bindSupervisoryPage(icon,rerender) {
  document.querySelectorAll('[data-plan-edit]').forEach(button=>button.addEventListener('click',()=>{
    const row=rows.find(item=>item.id===button.dataset.planEdit);
    showDialog(icon,`Edit Pemantauan: ${row.object}`,`<label for="plan-description">Uraian Strategi Pengawasan</label><textarea id="plan-description" name="description" rows="3" maxlength="1500" required>${escapeHTML(row.description)}</textarea><label for="plan-status">Status</label><select id="plan-status" name="status">${statuses.map(status=>`<option ${row.status===status?'selected':''}>${status}</option>`).join('')}</select><label for="plan-note">Keterangan</label><textarea id="plan-note" name="note" rows="5" maxlength="3000">${escapeHTML(row.note)}</textarea>`,(data,close)=>{
      if(!statuses.includes(data.get('status'))||!data.get('description').trim())return;
      row.description=data.get('description').trim();row.status=data.get('status');row.note=data.get('note').trim();
      close();rerender(false);
    },`[data-plan-edit="${row.id}"]`);
  }));
  document.querySelector('#edit-supervisory-plan').addEventListener('click',()=>{
    showDialog(icon,'Edit Periode dan Tanggal',`<label for="plan-year">Tahun Supervisory Plan</label><input id="plan-year" name="year" type="number" min="2000" max="2100" step="1" value="${plan.year}" required><label for="plan-latest">Tanggal Supervisory Plan Versi Terkini</label><input id="plan-latest" name="latest" type="date" value="${plan.latest}" required><label for="plan-monitored">Tanggal Pemantauan Supervisory Plan yang Terkini</label><input id="plan-monitored" name="monitored" type="date" value="${plan.monitored}">`,(data,close)=>{
      const year=Number(data.get('year'));
      if(!Number.isInteger(year)||year<2000||year>2100||!data.get('latest'))return;
      plan.year=year;plan.latest=data.get('latest');plan.monitored=data.get('monitored');
      close();rerender(false);
    },'#edit-supervisory-plan');
  });
  const input=document.querySelector('#plan-files');
  document.querySelector('#choose-plan-files').addEventListener('click',()=>input.click());
  input.addEventListener('change',()=>{
    const files=Array.from(input.files);
    if(!files.length)return;
    const invalid=files.find(file=>! /\.(docx|xlsx|pptx|pdf|zip)$/i.test(file.name)||file.size>25*1024*1024);
    if(invalid)fileMessage=`File “${invalid.name}” tidak dapat dipilih. Gunakan format yang tersedia dengan ukuran maksimal 25 MB per file.`;
    else {documents=files.map(({name,size})=>({name,size}));fileMessage=`${documents.length} dokumen dipilih untuk demonstrasi.`;}
    rerender(false);document.querySelector('#choose-plan-files').focus({preventScroll:true});
  });
  document.querySelectorAll('[data-remove-plan-file]').forEach(button=>button.addEventListener('click',()=>{
    documents.splice(Number(button.dataset.removePlanFile),1);
    fileMessage=documents.length?`${documents.length} dokumen dipilih untuk demonstrasi.`:'Daftar dokumen telah dikosongkan.';
    rerender(false);document.querySelector('#choose-plan-files').focus({preventScroll:true});
  }));
}
