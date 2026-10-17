/* Results remain in the browser; CSV files provide explicit exchange between groups. */
(() => {
  const fields = ['group','run','kind','scenario','device','auc','ams','seconds','epochs','best','change','conclusion'];
  const numeric = ['auc','ams','seconds','epochs','best'];
  function normalize(row) {
    const clean = Object.fromEntries(fields.map(key => [key, String(row[key] ?? '').trim()]));
    if (!clean.group || !clean.run || !clean.change) throw Error('Faltan grupo, corrida o cambio realizado.');
    if (!['Referencia','Variación'].includes(clean.kind)) throw Error('Tipo de corrida inválido.');
    for (const key of numeric) {
      if (!clean[key] || !Number.isFinite(Number(clean[key]))) throw Error(`Valor inválido: ${key}.`);
      clean[key] = Number(clean[key]);
    }
    if (clean.auc < 0 || clean.auc > 1 || clean.ams < 0 || clean.seconds < 0 ||
        !Number.isInteger(clean.epochs) || !Number.isInteger(clean.best) || clean.best < 1 || clean.epochs < clean.best)
      throw Error('Revisar AUC, AMS, tiempo y épocas (mejor época ≤ épocas ejecutadas).');
    return clean;
  }
  function encode(rows) {
    const cell = value => '"' + String(value).replace(/"/g,'""') + '"';
    return '\uFEFF' + [fields,...rows.map(row => fields.map(key => row[key]))].map(row => row.map(cell).join(',')).join('\r\n');
  }
  function decode(text) {
    text = text.replace(/^\uFEFF/,'');
    const rows=[]; let row=[], value='', quoted=false;
    for (let i=0;i<text.length;i++) {
      const c=text[i];
      if(c==='"') { if(quoted && text[i+1]==='"') {value+='"';i++;} else quoted=!quoted; }
      else if(c===',' && !quoted) {row.push(value);value='';}
      else if((c==='\n'||c==='\r') && !quoted) {
        if(c==='\r' && text[i+1]==='\n') i++;
        row.push(value); if(row.some(x=>x.trim())) rows.push(row);row=[];value='';
      } else value+=c;
    }
    if(quoted) throw Error('CSV con comillas sin cerrar.');
    row.push(value);if(row.some(x=>x.trim())) rows.push(row);
    const header=rows.shift();
    if(!header || fields.some(key=>!header.includes(key))) throw Error('Utilizar una tabla CSV descargada desde esta página.');
    return rows.map(values => {
      if(values.length!==header.length) throw Error('Fila CSV incompleta.');
      return normalize(Object.fromEntries(header.map((key,i)=>[key,values[i]])));
    });
  }
  // Pure helpers are also available for offline validation.
  if(typeof module!=='undefined' && module.exports) module.exports={normalize,encode,decode};
  if(typeof document==='undefined') return;
  const board=document.querySelector('#results-board');if(!board)return;
  const form=board.querySelector('form'), status=board.querySelector('#results-status');
  const storageKey='hep-workshop-results-v1';let rows=[];
  const message=text=>{status.textContent=text;};
  const element=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(rows));}catch{message('El navegador no permite guardar localmente. Descargar el CSV antes de cerrar.');}}
  const key=row=>JSON.stringify([row.group,row.run]);
  function merge(incoming) {const map=new Map(rows.map(row=>[key(row),row]));for(const row of incoming)map.set(key(row),row);rows=[...map.values()];save();render();}
  function render(){
    const body=board.querySelector('tbody');body.replaceChildren();
    for(const row of rows){
      const tr=element('tr');const refs=rows.filter(r=>r.group===row.group && r.kind==='Referencia' && r.device===row.device);
      const delta=row.kind==='Variación' && refs.length===1 ? `${(row.auc-refs[0].auc).toFixed(5)} / ${(row.ams-refs[0].ams).toFixed(4)}` : '—';
      const values=[`${row.group} / ${row.run}`,`${row.scenario}: ${row.change}`,row.device,row.auc.toFixed(5),row.ams.toFixed(4),row.seconds.toFixed(2),`${row.epochs} / ${row.best}`,delta,row.conclusion];
      for(const value of values)tr.append(element('td',value));
      const td=element('td'), button=element('button','Quitar');button.type='button';button.setAttribute('aria-label',`Quitar ${row.group} / ${row.run}`);
      button.addEventListener('click',()=>{rows=rows.filter(r=>key(r)!==key(row));save();render();message('Fila eliminada.');});td.append(button);tr.append(td);body.append(tr);
    }
    const charts=board.querySelector('#result-charts');charts.replaceChildren();
    if(!rows.length){message('Sin resultados. Registrar primero el entrenamiento de referencia.');return;}
    for(const [metric,title] of [['auc','AUC (0–1)'],['ams','AMS interna'],['seconds','Entrenamiento (s)']]){
      const panel=element('section');panel.append(element('h3',title));const max=metric==='auc'?1:Math.max(1,...rows.map(row=>row[metric]));
      for(const row of rows){
        const label=`${row.group} / ${row.run} (${row.device})`;
        const item=element('div');item.className='metric-row';item.append(element('span',label));
        const track=element('div');track.className='metric-track';track.setAttribute('role','img');track.setAttribute('aria-label',`${label}: ${row[metric]}`);
        const bar=element('div');bar.className=row.kind==='Referencia'?'metric-bar reference':'metric-bar';bar.style.width=`${100*row[metric]/max}%`;track.append(bar);
        item.append(track,element('strong',row[metric].toFixed(metric==='auc'?5:2)));panel.append(item);
      }charts.append(panel);
    }
  }
  form.addEventListener('submit',event=>{event.preventDefault();try{merge([normalize(Object.fromEntries(new FormData(form)))]);message('Fila guardada. Tabla y gráficas actualizadas.');}catch(error){message(error.message);}});
  board.querySelector('#metrics-import').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{
      const metrics=JSON.parse(await file.text());
      const mapping={auc:'roc_auc_unweighted',ams:'ams_validation_tuned',seconds:'fit_seconds',epochs:'epochs_run',best:'best_epoch'};
      for(const [field,source] of Object.entries(mapping)){
        if(!Number.isFinite(metrics[source]))throw Error(`El archivo no contiene ${source}.`);
      }
      for(const [field,source] of Object.entries(mapping))form.elements.namedItem(field).value=metrics[source];
      form.elements.namedItem('device').value=metrics.device==='cpu'?'CPU':'GPU MI210';
      message('Métricas cargadas. Completar grupo, corrida y cambio realizado antes de guardar.');
    }catch(error){message(`No se cargaron las métricas: ${error.message}`);}event.target.value='';
  });
  board.querySelector('#csv-export').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([encode(rows)],{type:'text/csv;charset=utf-8'}));
    const a=element('a');a.href=url;a.download='resultados-hep.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    message('Tabla descargada. Entregar el CSV en la carpeta compartida de la actividad.');
  });
  board.querySelector('#csv-import').addEventListener('change',async event=>{
    try{const incoming=[];for(const file of event.target.files)incoming.push(...decode(await file.text()));merge(incoming);message(`${incoming.length} filas importadas. Grupo y corrida identifican cada registro; las coincidencias se actualizan.`);}catch(error){message(`No se importaron las tablas: ${error.message}`);}event.target.value='';
  });
  try{rows=JSON.parse(localStorage.getItem(storageKey)||'[]').map(normalize);}catch{rows=[];}
  render();
})();
