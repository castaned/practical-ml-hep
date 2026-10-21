(() => {
  const fields=['id','variation','auc','seconds','epochs','best','parameters'];
  function validate(row){
    const r=Object.fromEntries(fields.map(key=>[key,row[key]]));
    if(!r.id || !r.variation)throw Error('Falta identificar la variación.');
    for(const key of fields.slice(2)){
      if(key==='parameters' && (r[key]===undefined || r[key]===null || r[key]==='')){r[key]='';continue;}
      if(String(r[key]??'').trim()==='' || !Number.isFinite(Number(r[key])))throw Error(`Revisa ${key}.`);
      r[key]=Number(r[key]);
    }
    if(r.auc<0 || r.auc>1 || r.seconds<0 || !Number.isInteger(r.epochs) || !Number.isInteger(r.best) || r.best<1 || r.best>r.epochs)throw Error('Revisa los indicadores y las épocas.');
    if(r.parameters!=='' && (!Number.isInteger(r.parameters)||r.parameters<1))throw Error('Revisa el número de parámetros.');
    return r;
  }
  const storageKey='atlas-quantitative-records-v1',draftKey='atlas-quantitative-draft-v1';
  const readRecords=storage=>JSON.parse(storage.getItem(storageKey)||'[]').map(validate);
  const writeRecords=(storage,rows)=>storage.setItem(storageKey,JSON.stringify(rows.map(validate)));
  if(typeof module!=='undefined' && module.exports)module.exports={validate,readRecords,writeRecords};
  if(typeof document==='undefined')return;
  let records=new Map();
  const log=document.querySelector('#simple-log'),summary=document.querySelector('#simple-summary');
  if(!log && !summary)return;
  const status=summary?.querySelector('#simple-summary-status');
  const logStatus=log?.querySelector('#simple-log-status');
  try{for(const row of readRecords(localStorage))records.set(row.id,row);}
  catch(e){if(status)status.textContent='No se pudieron recuperar los registros: '+e.message;}
  const render=()=>{
    if(!summary)return;
    const body=summary.querySelector('tbody');body.replaceChildren();
    for(const row of [...records.values()].sort((a,b)=>a.variation.localeCompare(b.variation))){
      const tr=document.createElement('tr');
      for(const value of [row.variation,row.auc.toFixed(5),row.seconds.toFixed(2),row.parameters===''?'—':row.parameters,row.epochs,row.best]){
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
    const saveDraft=()=>{try{localStorage.setItem(draftKey,JSON.stringify(Object.fromEntries(new FormData(form))));}catch(e){logStatus.textContent='El navegador no permite guardar el formulario pendiente.';}};
    form.addEventListener('input',saveDraft);form.addEventListener('change',saveDraft);
    form.addEventListener('submit',event=>{
      event.preventDefault();
      try{
        const row=validate({id:crypto.randomUUID(),...Object.fromEntries(new FormData(form))});
        const next=new Map(records);next.set(row.id,row);writeRecords(localStorage,[...next.values()]);records=next;
        form.reset();saveDraft();render();logStatus.textContent='Ejecución guardada. Puedes registrar otra variación; el resumen se actualizó abajo.';
      }catch(e){logStatus.textContent='No se guardó: '+e.message;}
    });
  }
  render();
})();
