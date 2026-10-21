(() => {
  const fields=['id','variation','auc','ams','seconds','epochs','best','parameters'];
  function validate(row){
    const r={...row};
    if(!r.id || !r.variation)throw Error('Falta identificar la variación.');
    for(const key of fields.slice(2)){
      if(key==='parameters' && (r[key]===undefined || r[key]===null || r[key]==='')){r[key]='';continue;}
      if(String(r[key]??'').trim()==='' || !Number.isFinite(Number(r[key])))throw Error(`Revisa ${key}.`);
      r[key]=Number(r[key]);
    }
    if(r.auc<0 || r.auc>1 || r.ams<0 || r.seconds<0 || !Number.isInteger(r.epochs) || !Number.isInteger(r.best) || r.best<1 || r.best>r.epochs)throw Error('Revisa los indicadores y las épocas.');
    if(r.parameters!=='' && (!Number.isInteger(r.parameters)||r.parameters<1))throw Error('Revisa el número de parámetros.');
    return r;
  }
  const encode=rows=> '\uFEFF'+[fields,...rows.map(r=>fields.map(k=>r[k]??''))].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');
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
    if(!header || fields.filter(k=>k!=='parameters').some(k=>!header.includes(k)))throw Error('Utiliza los CSV descargados de la nueva bitácora.');
    return rows.map(values=>{if(values.length!==header.length)throw Error('Fila incompleta.');return validate(Object.fromEntries(header.map((k,i)=>[k,values[i]])));});
  }
  const storageKey='atlas-quantitative-records-v1',draftKey='atlas-quantitative-draft-v1';
  const readRecords=storage=>JSON.parse(storage.getItem(storageKey)||'[]').map(validate);
  const writeRecords=(storage,rows)=>storage.setItem(storageKey,JSON.stringify(rows.map(validate)));
  if(typeof module!=='undefined' && module.exports)module.exports={validate,encode,decode,readRecords,writeRecords};
  if(typeof document==='undefined')return;
  let records=new Map();
  const log=document.querySelector('#simple-log'),summary=document.querySelector('#simple-summary');
  if(!log && !summary)return;
  const status=summary?.querySelector('#simple-summary-status');
  const logStatus=log?.querySelector('#simple-log-status');
  try{for(const row of readRecords(localStorage))records.set(row.id,row);}
  catch(e){if(status)status.textContent='No se pudieron recuperar los registros: '+e.message;}
  const download=rows=>{
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([encode(rows)],{type:'text/csv;charset=utf-8'}));
    a.download='resultados_ATLAS_'+new Date().toISOString().replace(/[:.]/g,'-')+'.csv';
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };
  const render=()=>{
    if(!summary)return;
    const body=summary.querySelector('tbody');body.replaceChildren();
    for(const row of [...records.values()].sort((a,b)=>a.variation.localeCompare(b.variation))){
      const tr=document.createElement('tr');
      for(const value of [row.variation,row.auc.toFixed(5),row.ams.toFixed(4),row.seconds.toFixed(2),row.parameters===''?'—':row.parameters,row.epochs,row.best]){
        const td=document.createElement('td');td.textContent=value;tr.append(td);
      }
      const actions=document.createElement('td');
      const remove=document.createElement('button');remove.type='button';remove.className='md-button';remove.textContent='Eliminar';
      remove.addEventListener('click',()=>{
        try{const next=new Map(records);next.delete(row.id);writeRecords(localStorage,[...next.values()]);records=next;render();}
        catch(e){status.textContent='No se pudo eliminar: '+e.message;}
      });actions.append(remove);tr.append(actions);body.append(tr);
    }
    status.textContent=records.size ? `${records.size} ejecuciones guardadas en este navegador.` : 'Todavía no hay ejecuciones guardadas.';
  };
  if(log){
    const form=log.querySelector('form');
    try{const draft=JSON.parse(localStorage.getItem(draftKey)||'{}');for(const [k,v] of Object.entries(draft)){const el=form.elements.namedItem(k);if(el)el.value=v;}}
    catch(e){logStatus.textContent='No se pudo recuperar el formulario pendiente.';}
    const saveDraft=()=>{try{localStorage.setItem(draftKey,JSON.stringify(Object.fromEntries(new FormData(form))));}catch(e){logStatus.textContent='El navegador no permite guardar el borrador. Descarga una copia de tus registros.';}};
    form.addEventListener('input',saveDraft);form.addEventListener('change',saveDraft);
    log.querySelector('#simple-metrics').addEventListener('change',async event=>{
      try{
        const file=event.target.files[0];if(!file)return;
        const m=JSON.parse(await file.text());
        const map={auc:'roc_auc_unweighted',ams:'ams_validation_tuned',seconds:'fit_seconds',epochs:'epochs_run',best:'best_epoch',parameters:'parameters'};
        const values=Object.fromEntries(Object.entries(map).map(([k,v])=>[k,m[v]]));
        validate({id:'check',variation:'Referencia',...values});
        for(const [k,v] of Object.entries(values))form.elements.namedItem(k).value=v??'';
        saveDraft();logStatus.textContent='Indicadores cargados. Selecciona la variación y pulsa Guardar ejecución.';
      }catch(e){logStatus.textContent=e.message;}event.target.value='';
    });
    form.addEventListener('submit',event=>{
      event.preventDefault();
      try{
        const row=validate({id:crypto.randomUUID(),...Object.fromEntries(new FormData(form))});
        const next=new Map(records);next.set(row.id,row);writeRecords(localStorage,[...next.values()]);records=next;
        form.reset();saveDraft();render();logStatus.textContent='Ejecución guardada. Puedes registrar otra variación; el resumen se actualizó abajo.';
      }catch(e){logStatus.textContent='No se guardó: '+e.message;}
    });
  }
  if(summary){
    summary.querySelector('#simple-import').addEventListener('change',async event=>{
      try{
        const incoming=[];for(const file of event.target.files)incoming.push(...decode(await file.text()));
        const next=new Map(records);for(const row of incoming)next.set(row.id,row);
        writeRecords(localStorage,[...next.values()]);records=next;render();
      }catch(e){status.textContent=`No se importaron registros: ${e.message}`;}event.target.value='';
    });
    summary.querySelector('#simple-clear').addEventListener('click',()=>{
      try{writeRecords(localStorage,[]);records=new Map();render();}catch(e){status.textContent=e.message;}
    });
    summary.querySelector('#simple-export').addEventListener('click',()=>{
      if(!records.size){status.textContent='Primero guarda una ejecución.';return;}download([...records.values()]);
    });
  }
  render();
})();
