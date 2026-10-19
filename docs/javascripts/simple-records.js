(() => {
  const fields=['id','variation','auc','ams','seconds','epochs','best'];
  function validate(row){
    const r={...row};
    if(!r.id || !r.variation)throw Error('Falta identificar la variación.');
    for(const key of fields.slice(2)){
      if(String(r[key]??'').trim()==='' || !Number.isFinite(Number(r[key])))throw Error(`Revisa ${key}.`);
      r[key]=Number(r[key]);
    }
    if(r.auc<0 || r.auc>1 || r.ams<0 || r.seconds<0 || !Number.isInteger(r.epochs) || !Number.isInteger(r.best) || r.best<1 || r.best>r.epochs)throw Error('Revisa los indicadores y las épocas.');
    return r;
  }
  const encode=rows=> '\uFEFF'+[fields,...rows.map(r=>fields.map(k=>r[k]))].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');
  function decode(text){
    text=text.replace(/^\uFEFF/,'');
    const rows=[];let row=[],value='',quoted=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(c==='"'){if(quoted && text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
      else if(c===',' && !quoted){row.push(value);value='';}
      else if((c==='\n'||c==='\r') && !quoted){if(c==='\r' && text[i+1]==='\n')i++;row.push(value);if(row.some(x=>x.trim()))rows.push(row);row=[];value='';}
      else value+=c;
    }
    if(quoted)throw Error('CSV incompleto.');
    row.push(value);if(row.some(x=>x.trim()))rows.push(row);
    const header=rows.shift();
    if(!header || fields.some(k=>!header.includes(k)))throw Error('Utiliza los CSV descargados de la nueva bitácora.');
    return rows.map(values=>{if(values.length!==header.length)throw Error('Fila incompleta.');return validate(Object.fromEntries(header.map((k,i)=>[k,values[i]])));});
  }
  if(typeof module!=='undefined' && module.exports)module.exports={validate,encode,decode};
  if(typeof document==='undefined')return;
  const log=document.querySelector('#simple-log');
  if(log){
    const form=log.querySelector('form'),status=log.querySelector('#simple-log-status');
    log.querySelector('#simple-metrics').addEventListener('change',async event=>{
      try{
        const file=event.target.files[0];if(!file)return;
        const m=JSON.parse(await file.text());
        const map={auc:'roc_auc_unweighted',ams:'ams_validation_tuned',seconds:'fit_seconds',epochs:'epochs_run',best:'best_epoch'};
        const values=Object.fromEntries(Object.entries(map).map(([k,v])=>[k,m[v]]));
        validate({id:'check',variation:'Referencia',...values});
        for(const [k,v] of Object.entries(values))form.elements.namedItem(k).value=v;
        status.textContent='Indicadores cargados. Selecciona la variación correcta y descarga el registro.';
      }catch(e){status.textContent=e.message;}event.target.value='';
    });
    form.addEventListener('submit',event=>{
      event.preventDefault();
      try{
        const row=validate({id:crypto.randomUUID(),...Object.fromEntries(new FormData(form))});
        const stamp=new Date().toISOString().replace(/[:.]/g,'-');
        const label=row.variation==='Referencia'?'referencia':row.variation[0];
        const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([encode([row])],{type:'text/csv;charset=utf-8'}));
        a.download=`resultado_${label}_${stamp}.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
        status.textContent='Registro descargado. Súbelo a /lustre/cursos/curso07/variaciones/ desde Open OnDemand: Files → Curso: curso07 → variaciones → Upload.';
      }catch(e){status.textContent=e.message;}
    });
  }
  const summary=document.querySelector('#simple-summary');
  if(summary){
    let records=new Map();const status=summary.querySelector('#simple-summary-status');
    const render=()=>{
      const body=summary.querySelector('tbody');body.replaceChildren();
      for(const row of [...records.values()].sort((a,b)=>a.variation.localeCompare(b.variation))){
        const tr=document.createElement('tr');
        for(const value of [row.variation,row.auc.toFixed(5),row.ams.toFixed(4),row.seconds.toFixed(2),row.epochs,row.best,row.file]){
          const td=document.createElement('td');td.textContent=value;tr.append(td);
        }body.append(tr);
      }status.textContent=`${records.size} ejecuciones en el resumen. Cada fila conserva sus indicadores originales.`;
    };
    summary.querySelector('#simple-import').addEventListener('change',async event=>{
      try{
        const incoming=[];for(const file of event.target.files)for(const row of decode(await file.text()))incoming.push({...row,file:file.name});
        for(const row of incoming)records.set(row.id,row);render();
      }catch(e){status.textContent=`No se importaron registros: ${e.message}`;}event.target.value='';
    });
    summary.querySelector('#simple-clear').addEventListener('click',()=>{records=new Map();render();});
  }
})();
