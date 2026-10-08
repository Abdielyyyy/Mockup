import './risk-analysis.css';

const risks = [
  ['strategic','Risiko Strategis'], ['operational','Risiko Operasional'],
  ['credit','Risiko Kredit'], ['market','Risiko Pasar'],
  ['liquidity','Risiko Likuiditas'], ['legal','Risiko Hukum'],
  ['compliance','Risiko Kepatuhan'], ['reputation','Risiko Reputasi'],
];
const fields = [['inherent','Risiko Inheren'], ['management','Kualitas Penerapan Manajemen Risiko']];
const groups = [['previous','Penilaian Pengawas Sebelumnya'], ['self','Penilaian PMV'], ['current','Penilaian Pengawas Periode Saat Ini']];
const columns = [['inherent','Risiko Inheren'], ['management','KPMR'], ['level','Tingkat Risiko']];
const rowKeys = risks.flatMap(([id]) => fields.map(([field]) => `${id}-${field}`));
const ratingKeys = groups.flatMap(([group]) => [...risks.flatMap(([risk]) => columns.map(([column]) => `${risk}-${group}-${column}`)), `overall-${group}`]);
const storageKey = 'pvml-risk-analysis-skv-001-jun-2026-v1';
const blankState = () => ({ narratives:{}, ratings:{}, submittedAt:null });
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validRating = value => value === '' || ['1','2','3','4','5'].includes(value);
function readState() {
  const clean = blankState();
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey));
    rowKeys.forEach(key => { if (typeof raw?.narratives?.[key] === 'string') clean.narratives[key] = raw.narratives[key].slice(0,5000).trim(); });
    ratingKeys.forEach(key => { if (validRating(raw?.ratings?.[key])) clean.ratings[key] = raw.ratings[key]; });
    if (rowKeys.every(key => clean.narratives[key]) && typeof raw?.submittedAt === 'string' && Number.isFinite(Date.parse(raw.submittedAt))) clean.submittedAt = raw.submittedAt;
  } catch {}
  return clean;
}
let state = readState();
const drafts = Object.fromEntries(rowKeys.map(key => [key,state.narratives[key] || '']));
let message = '';
let messageError = false;
const savedCount = () => rowKeys.filter(key => state.narratives[key] && state.narratives[key] === drafts[key].trim()).length;
export function getRiskAnalysisStatus() {
  return state.submittedAt ? 'Selesai' : Object.values(state.narratives).some(Boolean) || Object.values(state.ratings).some(Boolean) ? 'Dalam Proses Review' : 'Belum diisi';
}
function persist(next) {
  try { localStorage.setItem(storageKey, JSON.stringify(next)); state = next; return true; }
  catch { message = 'Belum berhasil disimpan. Penyimpanan browser tidak tersedia; izinkan penyimpanan situs lalu coba lagi.'; messageError = true; return false; }
}
function ratingSelect(key,label) {
  return `<select data-risk-rating="${key}" aria-label="${label}" ${state.submittedAt?'disabled':''}><option value="">—</option>${['1','2','3','4','5'].map(value=>`<option value="${value}" ${state.ratings[key]===value?'selected':''}>${value}</option>`).join('')}</select>`;
}
function comparisonTable() {
  return `<div class="risk-table-scroll" role="region" aria-label="Perbandingan penilaian profil risiko" tabindex="0"><table class="risk-comparison"><caption class="sr-only">Penilaian delapan risiko oleh pengawas sebelumnya, perusahaan modal ventura, dan pengawas periode saat ini.</caption><colgroup><col class="risk-name-col">${groups.map(()=>'<col><col><col>').join('')}</colgroup><thead><tr><th rowspan="2" scope="col">Profil Risiko</th>${groups.map(([,title])=>`<th colspan="3" scope="colgroup">${title}</th>`).join('')}</tr><tr>${groups.map(()=>columns.map(([,label])=>`<th scope="col">${label}</th>`).join('')).join('')}</tr></thead><tbody>${risks.map(([id,title])=>`<tr><th scope="row">${title}</th>${groups.map(([group,groupTitle])=>columns.map(([column,label])=>`<td>${ratingSelect(`${id}-${group}-${column}`,`${title} · ${groupTitle} · ${label}`)}</td>`).join('')).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="risk-table-scroll risk-overall-scroll" role="region" aria-label="Peringkat risiko keseluruhan" tabindex="0"><table class="risk-overall"><thead><tr><th scope="col"><span class="sr-only">Ringkasan</span></th>${groups.map(([,title])=>`<th scope="col">${title}</th>`).join('')}</tr></thead><tbody><tr><th scope="row">Peringkat Risiko</th>${groups.map(([id,title])=>`<td>${ratingSelect(`overall-${id}`,`Peringkat Risiko · ${title}`)}</td>`).join('')}</tr></tbody></table></div>`;
}
function narrativeRows() {
  return risks.map(([id,title])=>`<tbody class="risk-narrative-group"><tr><th class="risk-narrative-title" colspan="2" scope="rowgroup">${title}</th></tr>${fields.map(([field,label])=>{
    const key=`${id}-${field}`;
    const saved=Boolean(state.narratives[key]) && state.narratives[key]===drafts[key].trim();
    return `<tr class="risk-narrative-label"><th colspan="2"><label for="risk-text-${key}">${label}:</label></th></tr><tr class="risk-narrative-row" data-risk-row="${key}"><td><textarea id="risk-text-${key}" data-risk-narrative="${key}" aria-label="${title} · ${label}" aria-describedby="risk-status-${key}" rows="4" maxlength="5000" placeholder="Isi manual narasi ${label.toLowerCase()}…" ${state.submittedAt?'readonly':''}>${escapeHTML(drafts[key])}</textarea></td><td class="risk-save-cell"><span class="risk-row-status ${saved?'saved':''}" id="risk-status-${key}">${saved?'Tersimpan':drafts[key].trim()?'Belum tersimpan':'Belum diisi'}</span><button class="button secondary" data-save-risk="${key}" ${saved||state.submittedAt?'disabled':''}>Simpan</button></td></tr>`;
  }).join('')}</tbody>`).join('');
}
export function riskAnalysisPage(icon,company) {
  const submitted=Boolean(state.submittedAt);
  return `<button class="back-to-companies" data-back-from-risk>${icon('arrow')} Kembali ke daftar kertas kerja</button><div class="work-company-bar"><div><span class="work-company-code">${company.code}</span><span class="work-company-type">MV</span><h1>${company.name}</h1></div><span class="work-period">${company.period}</span></div>
    <section class="risk-analysis-panel" aria-labelledby="risk-analysis-title"><header class="risk-analysis-heading"><div><span class="section-tag">PENILAIAN: PROFIL RISIKO</span><h2 id="risk-analysis-title">Analisis Profil Risiko</h2></div><span class="risk-document-status ${submitted?'submitted':''}">${submitted?'Sudah disubmit':'Draft'}</span></header><div class="risk-analysis-content"><p class="risk-instruction">Pilih peringkat 1–5 secara manual jika tersedia. KPMR: Kualitas Penerapan Manajemen Risiko. Tingkat risiko dan peringkat keseluruhan diisi manual.</p><p class="risk-scroll-hint">${icon('arrow')} Geser tabel untuk melihat seluruh kelompok penilaian.</p>${comparisonTable()}
      <p class="risk-narrative-instruction">Isi dua narasi untuk setiap risiko, lalu klik Simpan pada masing-masing isian. Submit tersedia setelah seluruh 16 narasi tersimpan.</p><table class="risk-narratives"><colgroup><col><col class="risk-actions-col"></colgroup><thead><tr><th colspan="2" scope="colgroup">Analisa</th></tr></thead>${narrativeRows()}</table>
      <div class="risk-submit-bar"><div><strong id="risk-save-progress" aria-live="polite">${savedCount()} dari 16 narasi tersimpan</strong><p>${submitted?`Disubmit pada ${new Date(state.submittedAt).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})} WIB.`:'Narasi yang diubah perlu disimpan lagi sebelum submit.'}</p></div>${submitted?'<button class="button secondary" id="risk-edit-again">Edit kembali</button>':`<button class="button primary" id="submit-risk-analysis" ${savedCount()!==16?'disabled':''}>Submit Analisis Profil Risiko ${icon('arrow')}</button>`}</div><p class="risk-feedback ${messageError?'error':''}" id="risk-feedback" role="${messageError?'alert':'status'}" aria-live="polite">${escapeHTML(message)}</p></div>
    </section><div class="risk-bottom"><p>Data simulasi. Simpan dan Submit menyimpan data di browser ini; belum dikirim ke server.</p><button class="button secondary" data-back-from-risk>Kembali ke daftar kertas kerja ${icon('arrow')}</button></div>`;
}
function updateFeedback() {
  const feedback=document.querySelector('#risk-feedback');
  feedback.textContent=message;
  feedback.classList.toggle('error',messageError);
  feedback.setAttribute('role',messageError?'alert':'status');
}
function updateProgress() {
  document.querySelector('#risk-save-progress').textContent=`${savedCount()} dari 16 narasi tersimpan`;
  const submit=document.querySelector('#submit-risk-analysis');
  if(submit)submit.disabled=savedCount()!==16;
}
function updateRow(key) {
  const row=document.querySelector(`[data-risk-row="${key}"]`);
  const saved=Boolean(state.narratives[key]) && state.narratives[key]===drafts[key].trim();
  row.querySelector('.risk-row-status').textContent=saved?'Tersimpan':drafts[key].trim()?'Belum tersimpan':'Belum diisi';
  row.querySelector('.risk-row-status').classList.toggle('saved',saved);
  row.querySelector('[data-save-risk]').disabled=saved||Boolean(state.submittedAt);
  updateProgress();
}
export function bindRiskAnalysisPage(rerender) {
  document.querySelectorAll('[data-risk-narrative]').forEach(input=>input.addEventListener('input',()=>{
    if(state.submittedAt)return;
    drafts[input.dataset.riskNarrative]=input.value;
    input.removeAttribute('aria-invalid');
    message='';messageError=false;updateFeedback();updateRow(input.dataset.riskNarrative);
  }));
  document.querySelectorAll('[data-save-risk]').forEach(button=>button.addEventListener('click',()=>{
    if(state.submittedAt)return;
    const key=button.dataset.saveRisk;
    const value=drafts[key].trim();
    if(!value){message='Isi narasi sebelum menyimpan.';messageError=true;const input=document.querySelector(`[data-risk-narrative="${key}"]`);input.setAttribute('aria-invalid','true');input.focus();updateFeedback();return;}
    if(persist({...state,narratives:{...state.narratives,[key]:value}})) {
      message='Narasi berhasil disimpan di browser ini.';messageError=false;
      drafts[key]=value;document.querySelector(`[data-risk-narrative="${key}"]`).value=value;updateRow(key);
    }
    updateFeedback();
  }));
  document.querySelectorAll('[data-risk-rating]').forEach(select=>select.addEventListener('change',()=>{
    const key=select.dataset.riskRating;
    if(state.submittedAt||!validRating(select.value))return;
    if(persist({...state,ratings:{...state.ratings,[key]:select.value}})){message='Peringkat tersimpan di browser ini.';messageError=false;}
    else select.value=state.ratings[key]||'';
    updateFeedback();
  }));
  document.querySelector('#submit-risk-analysis')?.addEventListener('click',()=>{
    if(state.submittedAt||savedCount()!==16)return;
    if(persist({...state,submittedAt:new Date().toISOString()})) {
      message='Analisis Profil Risiko berhasil disubmit untuk simulasi.';messageError=false;
      rerender(false);document.querySelector('#risk-edit-again').focus({preventScroll:true});
    } else updateFeedback();
  });
  document.querySelector('#risk-edit-again')?.addEventListener('click',()=>{
    if(persist({...state,submittedAt:null})) {
      message='Analisis dibuka kembali sebagai draft. Simpan perubahan sebelum submit ulang.';messageError=false;
      rerender(false);document.querySelector('[data-risk-narrative]').focus({preventScroll:true});
    } else updateFeedback();
  });
}
