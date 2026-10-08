import './risk-analysis.css';
import './assessment.css';

const definitions = {
  'governance-0': { title:'Peringkat Komposit', section:'Tata Kelola', row:'Peringkat Tata Kelola yang Baik', period:'Juni 2026', storagePeriod:'jun-2026' },
  'earnings-0': { title:'Rentabilitas', section:'Rentabilitas', row:'Peringkat Rentabilitas', period:'Juni 2026', storagePeriod:'jun-2026' },
  'capital-0': { title:'Permodalan', section:'Permodalan', row:'Peringkat Permodalan', period:'Juni 2026', storagePeriod:'jun-2026' },
  'tks-0': { title:'Tingkat Kesehatan PVML', section:'TKS', period:'Desember 2025', storagePeriod:'dec-2025', summary:true },
};
const groups = [['previous','Penilaian Pengawas Sebelumnya'],['self','Penilaian PMV'],['current','Penilaian Pengawas Periode Saat Ini']];
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validRating = value => ['', '1','2','3','4','5'].includes(value);
const storageKey = id => `pvml-assessment-skv-001-${id}-${definitions[id].storagePeriod}-v1`;
function readState(id) {
  const clean = { narrative:'', ratings:{}, submittedAt:null };
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey(id)));
    if(typeof raw?.narrative === 'string')clean.narrative=raw.narrative.slice(0,5000).trim();
    groups.forEach(([key])=>{if(validRating(raw?.ratings?.[key]))clean.ratings[key]=raw.ratings[key];});
    if(clean.narrative && typeof raw?.submittedAt==='string' && Number.isFinite(Date.parse(raw.submittedAt)))clean.submittedAt=raw.submittedAt;
  } catch {}
  return clean;
}
const states = Object.fromEntries(Object.keys(definitions).map(id=>[id,readState(id)]));
const drafts = Object.fromEntries(Object.keys(definitions).map(id=>[id,states[id].narrative]));
const feedback = Object.fromEntries(Object.keys(definitions).map(id=>[id,{text:'',error:false}]));
export const getAssessmentDefinition = id => definitions[id];
export const getAssessmentNarrative = id => states[id]?.narrative || '';
export function getAssessmentStatus(id) {
  const state=states[id];
  return state.submittedAt ? 'Selesai' : state.narrative || Object.values(state.ratings).some(Boolean) ? 'Dalam Proses Review' : 'Belum diisi';
}
const isSaved = id => Boolean(states[id].narrative) && states[id].narrative===drafts[id].trim();
function persist(id,next) {
  try {localStorage.setItem(storageKey(id),JSON.stringify(next));states[id]=next;return true;}
  catch {feedback[id]={text:'Belum berhasil disimpan. Penyimpanan browser tidak tersedia; izinkan penyimpanan situs lalu coba lagi.',error:true};return false;}
}
function ratingSelect(id,key,label) {
  const state=states[id];
  return `<select data-assessment-rating="${key}" aria-label="${label}" ${state.submittedAt?'disabled':''}><option value="">—</option>${['1','2','3','4','5'].map(value=>`<option value="${value}" ${state.ratings[key]===value?'selected':''}>${value}</option>`).join('')}</select>`;
}
function ratingTable(id) {
  const def=definitions[id];
  return `<div class="risk-table-scroll" role="region" aria-label="Perbandingan ${def.row}" tabindex="0"><table class="assessment-detail-table"><caption class="sr-only">${def.row} pada tiga kelompok penilaian.</caption><colgroup><col class="assessment-detail-factor"><col><col><col></colgroup><thead><tr><th scope="col"><span class="sr-only">Faktor</span></th>${groups.map(([,title])=>`<th scope="col">${title}</th>`).join('')}</tr></thead><tbody><tr><th scope="row">${def.row}</th>${groups.map(([key,label])=>`<td>${ratingSelect(id,key,`${def.row} · ${label}`)}</td>`).join('')}</tr></tbody></table></div>`;
}
function tksTable() {
  const rows=[['Profil Risiko',3,1,3],['Tata Kelola',3,1,2],['Rentabilitas',2,2,2],['Permodalan',1,1,1],['Peringkat Komposit Akhir',2,1,2]];
  const headers=[['Penilaian Pengawas Periode Sebelumnya','Desember 2024'],['Penilaian Perusahaan PVML','Self Assessment · Desember 2025'],['Penilaian Pengawas Periode Saat Ini','Desember 2025']];
  return `<div class="risk-table-scroll" role="region" aria-label="Penilaian TKS Desember 2024 dan Desember 2025" tabindex="0"><table class="assessment-detail-table assessment-tks-table"><caption class="sr-only">Tingkat Kesehatan PVML. Peringkat pada contoh Desember 2024 dan Desember 2025.</caption><colgroup><col class="assessment-detail-factor"><col><col><col></colgroup><thead><tr><th rowspan="2" scope="col">Faktor</th>${headers.map(([title,period])=>`<th scope="col"><span>${title}</span><small>${period}</small></th>`).join('')}</tr><tr>${headers.map(()=>'<th scope="col">Peringkat</th>').join('')}</tr></thead><tbody>${rows.map(([label,...ratings],index)=>`<tr class="${index===4?'assessment-final-row':''}"><th scope="row">${label}</th>${ratings.map(rating=>`<td>${rating}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function assessmentPage(icon,company,id) {
  const def=definitions[id];const state=states[id];const saved=isSaved(id);const submitted=Boolean(state.submittedAt);const note=feedback[id];
  return `<button class="back-to-companies" data-back-from-assessment>${icon('arrow')} Kembali ke daftar kertas kerja</button><div class="work-company-bar"><div><span class="work-company-code">${company.code}</span><span class="work-company-type">MV</span><h1>${company.name}</h1></div><span class="work-period">${def.period}</span></div>
    <section class="risk-analysis-panel assessment-detail-panel" aria-labelledby="assessment-detail-title"><header class="risk-analysis-heading"><div><span class="section-tag">PENILAIAN: ${def.section.toUpperCase()}</span><h2 id="assessment-detail-title">${def.title}</h2></div><span class="risk-document-status ${submitted?'submitted':''}">${submitted?'Sudah disubmit':'Draft'}</span></header><div class="risk-analysis-content"><p class="risk-instruction">${def.summary?'Posisi penilaian menggunakan Desember 2024 dan Desember 2025. Peringkat mengikuti contoh yang diberikan.':'Pilih peringkat 1–5 secara manual jika tersedia, lalu isi analisa pada kolom di bawah.'}</p><p class="risk-scroll-hint">${icon('arrow')} Geser tabel untuk melihat seluruh kelompok penilaian.</p>${def.summary?tksTable():ratingTable(id)}
      <table class="assessment-narrative-table"><thead><tr><th scope="col"><label for="assessment-narrative">${def.summary?'Analisis':'Analisa'}</label></th></tr></thead><tbody><tr><td><textarea id="assessment-narrative" aria-label="${def.summary?'Analisis':'Analisa'} ${def.title}" aria-describedby="assessment-save-status" rows="8" maxlength="5000" placeholder="Isi manual analisa ${def.title.toLowerCase()}…" ${submitted?'readonly':''}>${escapeHTML(drafts[id])}</textarea></td></tr></tbody></table>
      <div class="assessment-save-row"><span class="risk-row-status ${saved?'saved':''}" id="assessment-save-status" role="status">${saved?'Analisa tersimpan':drafts[id].trim()?'Analisa belum tersimpan':'Analisa belum diisi'}</span><button class="button secondary" id="save-assessment" ${saved||submitted?'disabled':''}>Simpan Analisa</button></div><div class="risk-submit-bar"><div><strong>${submitted?'Penilaian telah disubmit':'Simpan analisa sebelum submit'}</strong><p>${submitted?`Disubmit pada ${new Date(state.submittedAt).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})} WIB.`:'Perubahan analisa perlu disimpan lagi sebelum submit.'}</p></div>${submitted?'<button class="button secondary" id="edit-assessment-again">Edit kembali</button>':`<button class="button primary" id="submit-assessment" ${saved?'':'disabled'}>Submit ${def.title} ${icon('arrow')}</button>`}</div><p class="risk-feedback ${note.error?'error':''}" id="assessment-feedback" role="${note.error?'alert':'status'}">${escapeHTML(note.text)}</p></div></section>
      <div class="risk-bottom"><p>Data simulasi. Simpan dan Submit menyimpan data di browser ini; belum dikirim ke server.</p><button class="button secondary" data-back-from-assessment>Kembali ke daftar kertas kerja ${icon('arrow')}</button></div>`;
}
export function bindAssessmentPage(id,rerender) {
  const input=document.querySelector('#assessment-narrative');
  const update=()=>{
    const saved=isSaved(id);const status=document.querySelector('#assessment-save-status');
    status.textContent=saved?'Analisa tersimpan':drafts[id].trim()?'Analisa belum tersimpan':'Analisa belum diisi';status.classList.toggle('saved',saved);
    document.querySelector('#save-assessment').disabled=saved||Boolean(states[id].submittedAt);
    const submit=document.querySelector('#submit-assessment');if(submit)submit.disabled=!saved;
    const message=document.querySelector('#assessment-feedback');message.textContent=feedback[id].text;message.classList.toggle('error',feedback[id].error);message.setAttribute('role',feedback[id].error?'alert':'status');
  };
  input.addEventListener('input',()=>{if(states[id].submittedAt)return;drafts[id]=input.value;input.removeAttribute('aria-invalid');feedback[id]={text:'',error:false};update();});
  document.querySelector('#save-assessment').addEventListener('click',()=>{
    if(states[id].submittedAt)return;
    const narrative=drafts[id].trim();
    if(!narrative){feedback[id]={text:'Isi analisa sebelum menyimpan.',error:true};input.setAttribute('aria-invalid','true');input.focus();update();return;}
    if(persist(id,{...states[id],narrative})){drafts[id]=narrative;input.value=narrative;feedback[id]={text:'Analisa berhasil disimpan di browser ini.',error:false};input.focus({preventScroll:true});}
    update();
  });
  document.querySelectorAll('[data-assessment-rating]').forEach(select=>select.addEventListener('change',()=>{
    const key=select.dataset.assessmentRating;if(states[id].submittedAt||!validRating(select.value))return;
    if(persist(id,{...states[id],ratings:{...states[id].ratings,[key]:select.value}}))feedback[id]={text:'Peringkat tersimpan di browser ini.',error:false};
    else select.value=states[id].ratings[key]||'';
    update();
  }));
  document.querySelector('#submit-assessment')?.addEventListener('click',()=>{
    if(states[id].submittedAt||!isSaved(id))return;
    if(persist(id,{...states[id],submittedAt:new Date().toISOString()})){feedback[id]={text:`${definitions[id].title} berhasil disubmit untuk simulasi.`,error:false};rerender(false);document.querySelector('#edit-assessment-again').focus({preventScroll:true});}
    else update();
  });
  document.querySelector('#edit-assessment-again')?.addEventListener('click',()=>{
    if(persist(id,{...states[id],submittedAt:null})){feedback[id]={text:'Penilaian dibuka kembali sebagai draft. Simpan perubahan sebelum submit ulang.',error:false};rerender(false);document.querySelector('#assessment-narrative').focus({preventScroll:true});}
    else update();
  });
}
