import './dashboard.css';

// Entire dashboard is a simulated aggregate, independent of the example worksheet.
const sectors = [
  { id:'financing', name:'Pembiayaan', short:'Pembiayaan', assets:582.4, debtors:18.42, branches:4420, companies:147, financing:452.6, color:'#c51c30' },
  { id:'venture', name:'Modal Ventura', short:'Modal Ventura', assets:28.6, debtors:.12, branches:184, companies:54, financing:21.8, color:'#24262d' },
  { id:'micro', name:'Lembaga Keuangan Mikro', short:'LKM', assets:14.8, debtors:1.26, branches:1080, companies:281, financing:11.4, color:'#e99aa7' },
];
const months=['Jan','Feb','Mar','Apr','Mei','Jun'];
const trend=[.911,.934,.948,.966,.984,1];
let scope='all';
let period=5;
const format=(value,digits=0)=>value.toLocaleString('id-ID',{minimumFractionDigits:digits,maximumFractionDigits:digits});
const selectedSectors=()=>scope==='all'?sectors:sectors.filter(s=>s.id===scope);
const aggregate=(key,index=period)=>['branches','companies'].includes(key) ? selectedSectors().reduce((sum,s)=>sum+Math.round(s[key]*trend[index]),0) : selectedSectors().reduce((sum,s)=>sum+s[key],0)*trend[index];
const label=()=>scope==='all'?'Seluruh sektor PVML':sectors.find(s=>s.id===scope).name;

function lineChart() {
  const assets=selectedSectors().reduce((sum,s)=>sum+s.assets,0);
  const values=trend.slice(0,period+1).map(t=>t*assets);
  const low=Math.floor(assets*.86/10)*10;
  const high=Math.ceil(assets*1.04/10)*10;
  const x=i=>62+i*524/(values.length-1);
  const y=value=>182-(value-low)/(high-low)*148;
  const points=values.map((value,i)=>`${x(i)},${y(value)}`);
  const area=`M ${x(0)},182 L ${points.join(' L ')} L ${x(values.length-1)},182 Z`;
  return `<svg class="asset-chart" viewBox="0 0 620 230" role="img" aria-label="Grafik total aset ${label()}, Januari sampai ${months[period]} 2026. Nilai terakhir ${format(values.at(-1),1)} triliun rupiah."><defs><linearGradient id="asset-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c51c30" stop-opacity=".16"/><stop offset="100%" stop-color="#c51c30" stop-opacity=".005"/></linearGradient></defs>${[0,1,2,3].map(i=>{const v=low+(high-low)*i/3;return `<line x1="62" y1="${y(v)}" x2="586" y2="${y(v)}" stroke="#ededf2" stroke-dasharray="4 4"/><text x="48" y="${y(v)+4}" text-anchor="end">${format(v)}</text>`}).join('')}<path d="${area}" fill="url(#asset-fill)"/><polyline points="${points.join(' ')}" fill="none" stroke="#c51c30" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${values.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${i===period?5:3.5}" fill="white" stroke="#c51c30" stroke-width="2"/><text x="${x(i)}" y="212" text-anchor="middle">${months[i]}</text>`).join('')}</svg><div class="chart-months" aria-label="Lihat nilai aset per bulan">${values.map((v,i)=>`<button class="chart-month ${i===period?'active':''}" data-chart-month="${i}" aria-pressed="${i===period}">${months[i]}<strong>Rp ${format(v,1)} T</strong></button>`).join('')}</div>`;
}

function composition() {
  const list=selectedSectors();
  const total=list.reduce((sum,s)=>sum+s.assets,0);
  let offset=0;
  const segments=list.map(s=>{const length=s.assets/total*100;const svg=`<circle cx="80" cy="80" r="61" fill="none" stroke="${s.color}" stroke-width="17" pathLength="100" stroke-dasharray="${length} ${100-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 80 80)"/>`;offset+=length;return svg}).join('');
  return `<div class="composition-content"><div class="donut-wrap"><svg viewBox="0 0 160 160" role="img" aria-label="Komposisi aset: ${list.map(s=>`${s.name} ${format(s.assets/total*100,1)} persen`).join(', ')}">${segments}</svg><span class="donut-center"><small>TOTAL ASET</small><strong>${format(aggregate('assets'),1)}</strong><span>triliun rupiah</span></span></div><div class="composition-legend">${list.map(s=>`<div><span class="legend-dot" style="--sector-color:${s.color}"></span><span>${s.short}<small>Rp ${format(s.assets*trend[period],1)} T</small></span><strong>${format(s.assets/total*100,1)}%</strong></div>`).join('')}</div></div>`;
}

export function dashboardPage(icon) {
  const assets=aggregate('assets'), debtors=aggregate('debtors'),branches=Math.round(aggregate('branches')),companies=Math.round(aggregate('companies'));
  const cards=[['Total Aset',`Rp ${format(assets,1)}`, 'triliun','layers','assets'],['Total Debitur',format(debtors,2),'juta debitur','people','debtors'],['Total Cabang',format(branches),'kantor cabang','building','branches'],['Total Perusahaan',format(companies),'perusahaan','briefcase','companies']];
  return `<div class="page-heading dashboard-heading"><div><div class="section-tag">SISTEM INFORMASI PENGAWASAN PVML</div><h1>Ringkasan sektor PVML<span class="heading-dot">.</span></h1><p class="muted">Agregasi aset, debitur, dan jaringan usaha dalam satu dashboard.</p></div><div class="dashboard-period"><label for="dashboard-period">PERIODE DATA</label><select id="dashboard-period"><option value="5" ${period===5?'selected':''}>Juni 2026</option><option value="4" ${period===4?'selected':''}>Mei 2026</option><option value="3" ${period===3?'selected':''}>April 2026</option></select></div></div>
    <div class="dashboard-scope"><div class="sector-tabs" role="group" aria-label="Cakupan sektor">${[{id:'all',short:'Semua sektor'},...sectors].map(s=>`<button data-sector="${s.id}" class="sector-tab ${scope===s.id?'active':''}" aria-pressed="${scope===s.id}">${s.short}</button>`).join('')}</div><span class="dashboard-demo"><i></i> Data agregasi simulasi</span></div>
    <section class="metric-grid" aria-label="Indikator agregat">${cards.map(([title,value,unit,type,key],i)=>`<article class="metric-card ${i===0?'featured':''}"><div class="metric-label"><h2>${title}</h2><span>${icon(type)}</span></div><strong class="metric-value">${value}</strong><span class="metric-unit">${unit}</span><div class="metric-change">${icon('trend')}<strong>+${format((aggregate(key)/aggregate(key,period-1)-1)*100,2)}%</strong><span>dari bulan sebelumnya</span></div></article>`).join('')}</section>
    <div class="dashboard-chart-grid"><section class="dashboard-panel asset-panel" aria-labelledby="asset-title"><header class="panel-heading"><div><span class="section-tag">PERKEMBANGAN SEKTOR</span><h2 id="asset-title">Tren total aset</h2><p>${label()} · Januari–${months[period]} 2026</p></div><span class="chart-unit">Dalam triliun rupiah</span></header><div class="chart-headline"><strong id="selected-asset-value" aria-live="polite">Rp ${format(assets,1)} T</strong><span id="selected-asset-month">${months[period]} 2026</span><span class="chart-key"><i></i> Total aset</span></div>${lineChart()}</section><section class="dashboard-panel composition-panel" aria-labelledby="composition-title"><header class="panel-heading"><div><span class="section-tag">DISTRIBUSI SEKTOR</span><h2 id="composition-title">Komposisi aset</h2><p>Proporsi aset menurut jenis lembaga.</p></div></header>${composition()}</section></div>
    <section class="dashboard-panel sector-summary" aria-labelledby="sector-summary-title"><header class="panel-heading"><div><span class="section-tag">IKHTISAR AGREGASI</span><h2 id="sector-summary-title">Ringkasan per sektor</h2><p>Gambaran aset dan jangkauan layanan pada ${months[period]} 2026.</p></div><button class="text-button" data-page="health">Lihat tingkat kesehatan ${icon('arrow')}</button></header><div class="sector-table-wrap" role="region" aria-label="Tabel agregasi per sektor" tabindex="0"><table class="sector-summary-table"><thead><tr><th scope="col">Jenis lembaga</th><th scope="col">Total perusahaan</th><th scope="col">Total aset</th><th scope="col">Total debitur</th><th scope="col">Total cabang</th><th scope="col">Pembiayaan / penyertaan</th></tr></thead><tbody>${selectedSectors().map(s=>`<tr><th scope="row"><span class="legend-dot" style="--sector-color:${s.color}"></span>${s.name}</th><td>${format(Math.round(s.companies*trend[period]))}</td><td>Rp ${format(s.assets*trend[period],1)} T</td><td>${format(s.debtors*trend[period],2)} juta</td><td>${format(Math.round(s.branches*trend[period]))}</td><td>Rp ${format(s.financing*trend[period],1)} T</td></tr>`).join('')}</tbody></table></div><div class="summary-footer"><span>${label()}</span><span>Total pembiayaan / penyertaan <strong>Rp ${format(aggregate('financing'),1)} triliun</strong></span></div></section>
    <p class="dashboard-data-note">${icon('help')} Seluruh angka dan grafik merupakan data simulasi agregat untuk mockup, bukan data resmi OJK. Data ini terpisah dari contoh kertas kerja perusahaan.</p>`;
}

export function bindDashboard(rerender) {
  document.querySelector('#dashboard-period').addEventListener('change',event=>{period=Number(event.target.value);rerender(false);document.querySelector('#dashboard-period').focus({preventScroll:true});});
  document.querySelectorAll('[data-sector]').forEach(button=>button.addEventListener('click',()=>{scope=button.dataset.sector;rerender(false);document.querySelector(`[data-sector="${scope}"]`).focus({preventScroll:true});}));
  document.querySelectorAll('[data-chart-month]').forEach(button=>button.addEventListener('click',()=>{
    const month=Number(button.dataset.chartMonth);
    const value=selectedSectors().reduce((sum,s)=>sum+s.assets,0)*trend[month];
    document.querySelector('#selected-asset-value').textContent=`Rp ${format(value,1)} T`;
    document.querySelector('#selected-asset-month').textContent=`${months[month]} 2026`;
    document.querySelectorAll('[data-chart-month]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  }));
}
