(() => {
  const scenarios={
    A:{label:'A. Más ancha',file:'atlas_A_capas1024-512-256-128.yaml',block:'model',field:'hidden_dims',value:'[1024, 512, 256, 128]',network:'wide',question:'Cuatro capas, con ocho veces más neuronas por capa que la referencia. ¿Mejoran AUC y AMS? Compara el coste en tiempo y parámetros.'},
    B:{label:'B. Compacta',file:'atlas_B_capas8-4.yaml',block:'model',field:'hidden_dims',value:'[8, 4]',network:'compact',question:'Solo dos capas de 8 y 4 neuronas. ¿Se mantienen resultados cercanos al benchmark con muchos menos parámetros?'},
    C:{label:'C. Dropout',file:'atlas_C_dropout0p6.yaml',block:'model',field:'dropout',value:'0.6',network:'baseline',dropout:0.6,question:'Dropout pasa de 0.1 a 0.6. ¿Reduce el sobreajuste o dificulta el aprendizaje? Revisa las pérdidas de entrenamiento y validación.'},
    D:{label:'D. Aprendizaje',file:'atlas_D_lr0p0005.yaml',block:'training',field:'learning_rate',value:'0.0005',network:'baseline',dropout:0.1,question:'La tasa de aprendizaje baja de 0.001 a 0.0005. ¿El aprendizaje más lento mejora la validación y cuántas épocas y segundos necesita?'}
  };
  function instructions(key){
    const s=scenarios[key];if(!s)throw Error('Variación desconocida');
    return {...s,copy:`cd "$HOME/ML-integration-CMSSW"\ngit pull --ff-only origin opendata_dev\ncp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/${s.file}"`,
      monitor:`python workshop/monitor_atlas.py \\\n  -f "$HOME/hep-workshop/configs/${s.file}" \\\n  --job-id "$JOB_ID" \\\n  --log "$HOME/hep-workshop/logs/atlas_\${JOB_ID}.out"`,
      yaml:`${s.block}:\n  ${s.field}: ${s.value}\noutput:\n  directory: $HOME/hep-workshop/results/atlas_gpu_baseline01\n  run_name: ${s.file.replace(/\.yaml$/, '')}`,
      submit:`cd "$HOME/ML-integration-CMSSW"\nJOB_ID=$(sbatch --parsable --output="$HOME/hep-workshop/logs/atlas_%j.out" \\\n  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/${s.file}")\necho "Trabajo enviado: $JOB_ID"`};
  }
  if(typeof module!=='undefined' && module.exports)module.exports={scenarios,instructions};
  if(typeof document==='undefined')return;
  const picker=document.querySelector('#scenario-picker');if(!picker)return;
  const set=(id,value)=>{document.getElementById(id).textContent=value;};
  picker.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
    const s=instructions(button.dataset.scenario);
    picker.querySelectorAll('[data-scenario]').forEach(b=>{const active=b===button;b.setAttribute('aria-pressed',String(active));b.textContent=active?'Seleccionada':'Seleccionar';b.closest('tr').classList.toggle('scenario-selected',active);});
    document.getElementById('scenario-empty').hidden=true;
    document.getElementById('scenario-detail').hidden=false;
    set('scenario-architecture',s.network==='baseline'?'Conserva la red del benchmark: 30 → 128 → 64 → 32 → 16 → 1, con 14 849 parámetros entrenables. Solo cambia el parámetro de este escenario.':'La arquitectura y su número de parámetros se muestran en el explorador de abajo.');set('scenario-title',s.label);set('scenario-question',s.question);set('scenario-copy',s.copy);
    set('scenario-path',`hep-workshop → configs → ${s.file}`);set('scenario-yaml',s.yaml);set('scenario-submit',s.submit);set('scenario-monitor',s.monitor);set('scenario-log-label',s.label);
    const network=document.getElementById('scenario-network');network.hidden=!s.network;
    if(s.network){const explorer=document.querySelector('[data-network-explorer]');explorer.dataset.scenarioLabel=s.label;explorer.dataset.scenarioBlock=s.block;explorer.dataset.scenarioField=s.field;explorer.dataset.scenarioValue=s.value;const select=document.getElementById('network-choice');select.value=s.network;document.getElementById('dropout-choice').value=String(s.dropout ?? 0.1);select.dispatchEvent(new Event('change'));}
  }));
})();
