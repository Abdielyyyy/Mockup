import './health-output.css';

// Weights and ranks reproduce the supplied example; no official PVML scoring rules are implied.
const factors = [
  {name:'Profil Risiko',weight:25,previous:3,self:1,current:3},
  {name:'Tata Kelola',weight:30,previous:3,self:1,current:2},
  {name:'Rentabilitas',weight:15,previous:2,self:2,current:2},
  {name:'Permodalan',weight:30,previous:1,self:1,current:1},
];
const groups = [
  {key:'previous',title:'Penilaian Pengawas Periode Sebelumnya',period:'Desember 2025',rating:2,final:2},
  {key:'self',title:'Penilaian Perusahaan PVML',period:'Self Assessment · Juni 2026',rating:1,final:null},
  {key:'current',title:'Penilaian Pengawas Periode Saat Ini',period:'Juni 2026',rating:2,final:2},
];
const decimal=value=>value.toLocaleString('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2});
const currency=value=>`Rp ${value.toLocaleString('id-ID')}`;
const score=(factor,key)=>factor[key]*factor.weight/100;
const composite=key=>factors.reduce((sum,factor)=>sum+score(factor,key),0);
const metadata=items=>`<dl class="company-info">${items.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`;

function outputTable() {
  return `<div class="assessment-table-scroll" role="region" aria-label="Tabel output penilaian TKS, dapat digeser horizontal" tabindex="0"><table class="assessment-table output-assessment-table"><caption class="sr-only">Output penilaian TKS PT Sarana Kalteng Ventura. Perbandingan empat faktor dan nilai komposit pada tiga kelompok penilaian. Seluruh angka merupakan simulasi.</caption><colgroup><col class="factor-column">${groups.map(()=>'<col><col><col>').join('')}</colgroup><thead><tr><th rowspan="2" scope="col" class="factor-heading">Faktor</th>${groups.map(group=>`<th colspan="3" scope="colgroup" class="assessment-group ${group.key}"><span>${group.title}</span><small>${group.period}</small></th>`).join('')}</tr><tr>${groups.map(group=>`<th scope="col" class="${group.key}">Peringkat</th><th scope="col" class="${group.key}">Bobot</th><th scope="col" class="${group.key}">Nilai Faktor</th>`).join('')}</tr></thead><tbody>
    ${factors.map(factor=>`<tr><th scope="row">${factor.name}</th>${groups.map(group=>`<td class="${group.key}">${factor[group.key]}</td><td class="${group.key}">${factor.weight}%</td><td class="${group.key} factor-value">${decimal(score(factor,group.key))}</td>`).join('')}</tr>`).join('')}
    <tr class="composite-row"><th scope="row">Nilai Komposit<small>Penjumlahan dari nilai faktor</small></th>${groups.map(group=>`<td colspan="2" rowspan="3" class="not-applicable"><span class="sr-only">Tidak berlaku</span></td><td class="composite-score ${group.key}" data-output-total="${group.key}">${decimal(composite(group.key))}</td>`).join('')}</tr>
    <tr class="rating-row"><th scope="row">Peringkat Komposit<small>By system · simulasi</small></th>${groups.map(group=>`<td class="${group.key}"><span class="rating-number">${group.rating}</span></td>`).join('')}</tr>
    <tr class="final-rating-row"><th scope="row">Peringkat Komposit Akhir</th>${groups.map(group=>group.final===null?`<td class="not-applicable"><span class="sr-only">Tidak tersedia pada contoh self assessment</span></td>`:`<td class="${group.key}"><span class="final-rating">${group.final}</span></td>`).join('')}</tr>
  </tbody></table></div>`;
}

export function outputPage(icon,company,status,simulationNote) {
  return `<div class="work-company-bar output-company-bar"><div><span class="work-company-code">${company.code}</span><span class="work-company-type">MV</span><h1>${company.name}</h1></div><span class="work-period">${company.period}</span></div>
    <section class="worksheet output-worksheet" aria-labelledby="output-worksheet-title"><header class="worksheet-heading"><div><span class="worksheet-icon">${icon('activity')}</span><h2 id="output-worksheet-title">Kertas Kerja Penilaian Tingkat Kesehatan PVML</h2></div><div class="worksheet-badges"><span class="version-badge">Versi: 1</span><span class="output-review-status"><i></i>${status}</span></div></header>
      <div class="worksheet-information">${metadata([['KR/KO',company.office],['Modal Inti',currency(company.capital)],['Total Aset',currency(company.assets)]])}${metadata([['Periode Data Self Assessment TKS',company.period],['Tanggal Penyampaian Self Assessment TKS','27 Juli 2026'],['Jenis Penilaian Self Assessment TKS','—'],['Tanggal Penyusunan','31 Juli 2026'],['Jenis Penilaian Pengawas','Rutin']])}</div>
      <div class="output-section-divider"><span>Penilaian</span></div><p class="table-scroll-hint">${icon('arrow')} Geser tabel untuk melihat seluruh kelompok penilaian.</p>${outputTable()}
      <div class="output-reference-row"><button class="text-button" id="output-rating-reference">Lihat referensi peringkat penilaian ${icon('help')}</button><span>Nilai faktor = peringkat × bobot</span></div>
    </section>${simulationNote(icon)}<div class="output-footer"><p>Peringkat komposit mengikuti contoh gambar. Kolom abu-abu tidak berlaku atau tidak tersedia pada contoh; perhitungan peringkat otomatis sesuai ketentuan resmi PVML belum diterapkan.</p><button class="button secondary" data-page="health">Buka daftar kertas kerja ${icon('arrow')}</button></div>`;
}

export function bindOutputPage(icon) {
  document.querySelector('#output-rating-reference').addEventListener('click',event=>{
    const origin=event.currentTarget;
    const root=document.querySelector('#modal-root');
    root.innerHTML=`<dialog class="output-reference-dialog" aria-labelledby="output-reference-title"><button class="icon-button output-reference-close" aria-label="Tutup referensi">${icon('close')}</button><div class="section-tag">REFERENSI SIMULASI</div><h2 id="output-reference-title">Referensi peringkat penilaian</h2><p>Skala berikut merupakan ilustrasi untuk mockup, bukan panduan atau ketentuan resmi OJK.</p><table><thead><tr><th scope="col">Peringkat</th><th scope="col">Keterangan simulasi</th></tr></thead><tbody>${['Sangat sehat','Sehat','Cukup sehat','Kurang sehat','Tidak sehat'].map((label,index)=>`<tr><th scope="row">${index+1}</th><td>${label}</td></tr>`).join('')}</tbody></table><p class="output-reference-note">Nilai komposit adalah penjumlahan nilai faktor. Peringkat pada output mengikuti contoh dan tidak ditentukan otomatis dari batas nilai tertentu.</p><button class="button primary output-reference-done">Tutup</button></dialog>`;
    const dialog=root.querySelector('dialog');dialog.showModal();
    root.querySelectorAll('.output-reference-close,.output-reference-done').forEach(button=>button.onclick=()=>dialog.close());
    dialog.addEventListener('close',()=>{if(origin.isConnected)origin.focus({preventScroll:true});});
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  });
}
