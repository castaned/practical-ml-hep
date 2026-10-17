(() => {
  const fields={group:'Grupo o mesa',participants:'Participantes',variable:'Variable elegida',physics:'Significado físico y distribuciones',change:'Cambio propuesto',hypothesis:'Hipótesis',baseline_dir:'Carpeta de referencia',variation_dir:'Carpeta de variación',evidence:'Evidencia e hipótesis',metrics_interpretation:'Interpretación de AUC y AMS',learning_curves:'Curvas de aprendizaje',cost:'Tiempo de entrenamiento',conclusion:'Conclusiones',next_test:'Siguiente prueba'};
  const metricsKey='hep-workshop-results-v1', noteKey='hep-workshop-notebook-v1';
  function validate(payload){
    if(!payload || payload.version!==1 || !payload.notes || typeof payload.notes!=='object' || !Array.isArray(payload.metrics)) throw Error('No es una copia editable de la bitácora.');
    const notes={};for(const key of Object.keys(fields)) {
      if(typeof payload.notes[key]!=='string' || payload.notes[key].length>20000) throw Error('Las respuestas de la copia no son válidas.');
      notes[key]=payload.notes[key];
    }
    const metrics=payload.metrics.map(row=>{
      const keys=['group','run','kind','scenario','device','change','conclusion'];
      if(!row || keys.some(k=>typeof row[k]!=='string') || ['auc','ams','seconds','epochs','best'].some(k=>!Number.isFinite(row[k])))throw Error('La copia contiene métricas inválidas.');
      if(row.auc<0 || row.auc>1 || row.ams<0 || row.seconds<0 || !Number.isInteger(row.epochs) || !Number.isInteger(row.best) || row.best<1 || row.best>row.epochs || !['Referencia','Variación'].includes(row.kind))throw Error('Revisar las métricas de la copia.');
      return row;
    });
    return {version:1,notes,metrics};
  }
  function markdown(payload){
    const safe=value=>String(value??'').replace(/\|/g,'\\|').replace(/[\r\n]+/g,' ');
    const text=['# Bitácora del grupo',''];
    for(const [key,label] of Object.entries(fields))text.push(`## ${label}`,'',payload.notes[key]||'(Sin completar)','');
    text.push('## Métricas registradas','','| Corrida | Cambio | Equipo | AUC | AMS interna | Tiempo (s) | Épocas / mejor |','| --- | --- | --- | --- | --- | --- | --- |');
    for(const row of payload.metrics)text.push('| '+[row.run,row.change,row.device,row.auc,row.ams,row.seconds,`${row.epochs} / ${row.best}`].map(safe).join(' | ')+' |');
    text.push('','AMS de validación interna del taller. Los tiempos excluyen la espera en cola.','');return text.join('\n');
  }
  if(typeof module!=='undefined' && module.exports)module.exports={fields,validate,markdown};
  if(typeof document==='undefined')return;
  const root=document.querySelector('#workshop-notebook');if(!root)return;
  const status=root.querySelector('#notebook-status');
  const inputs=Object.fromEntries(Object.keys(fields).map(key=>[key,root.querySelector(`[name="${key}"]`)]));
  const notes=()=>Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,input.value]));
  const message=text=>status.textContent=text;
  function savedMetrics(){try{const all=JSON.parse(localStorage.getItem(metricsKey)||'[]');return Array.isArray(all)?all:[];}catch{return [];}}
  function groupMetrics(){const group=inputs.group.value.trim();return savedMetrics().filter(row=>row.group===group);}
  function render(){
    const body=root.querySelector('tbody');body.replaceChildren();const rows=groupMetrics();
    for(const row of rows){const tr=document.createElement('tr');for(const value of [row.run,row.change,row.auc,row.ams,row.seconds,`${row.epochs} / ${row.best}`]){const td=document.createElement('td');td.textContent=String(value??'');tr.append(td);}body.append(tr);}
    root.querySelector('#notebook-metrics-status').textContent=rows.length?`${rows.length} registros del grupo.`:'No hay registros para este grupo en el navegador. Completar la tabla de Variaciones y resultados.';
  }
  function save(){try{localStorage.setItem(noteKey,JSON.stringify(notes()));message('Respuestas guardadas en este navegador.');}catch{message('El navegador no permite guardar localmente. Descargar una copia antes de cerrar.');}}
  const payload=()=>({version:1,notes:notes(),metrics:groupMetrics()});
  function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  for(const input of Object.values(inputs))input.addEventListener('input',()=>{save();if(input===inputs.group)render();});
  root.querySelector('#notebook-save').addEventListener('click',()=>{save();render();});
  root.querySelector('#notebook-refresh').addEventListener('click',render);
  root.querySelector('#notebook-download').addEventListener('click',()=>{save();download(markdown(payload()),'bitacora-hep.md','text/markdown;charset=utf-8');});
  root.querySelector('#notebook-backup').addEventListener('click',()=>{save();download(JSON.stringify(payload(),null,2),'bitacora-hep.json','application/json');});
  root.querySelector('#notebook-import').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{const restored=validate(JSON.parse(await file.text()));
      // Preserve an existing written draft rather than replacing it silently.
      const previous=localStorage.getItem(noteKey);if(previous && previous!==JSON.stringify(restored.notes))localStorage.setItem(noteKey+'-previous',previous);
      const map=new Map(savedMetrics().map(row=>[JSON.stringify([row.group,row.run]),row]));for(const row of restored.metrics)map.set(JSON.stringify([row.group,row.run]),row);
      localStorage.setItem(metricsKey,JSON.stringify([...map.values()]));
      for(const [key,value] of Object.entries(restored.notes))inputs[key].value=value;
      save();render();message('Copia abierta. Respuestas y métricas del grupo recuperadas.');
    }catch(error){message(`No se abrió la copia: ${error.message}`);}event.target.value='';
  });
  try{const data=JSON.parse(localStorage.getItem(noteKey)||'{}');for(const key of Object.keys(fields))if(typeof data[key]==='string')inputs[key].value=data[key];}catch{}
  window.addEventListener('storage',event=>{if(event.key===metricsKey)render();});render();
})();
