(() => {
  const scenarios={
    A:{label:'A. Más ancha',file:'atlas_A_ancha2048.yaml',block:'model',field:'hidden_dims',value:'[2048, 1024, 512, 256]',network:'wide',question:'Cuatro capas, con 16 veces más neuronas en cada una que la referencia. ¿La gran capacidad mejora AUC y AMS o aumenta sobreajuste y coste?'},
    B:{label:'B. Más profunda',file:'atlas_B_profunda10x128.yaml',block:'model',field:'hidden_dims',value:'[128, 128, 128, 128, 128, 128, 128, 128, 128, 128]',network:'deep',question:'Diez capas de 128 neuronas. Cambian profundidad y número de parámetros: compara esta arquitectura completa, sin atribuir el efecto solo a la profundidad. ¿Aprende o se dificulta la optimización?'},
    C:{label:'C. Compacta',file:'atlas_C_minima8-4.yaml',block:'model',field:'hidden_dims',value:'[8, 4]',network:'compact',question:'Solo dos capas de 8 y 4 neuronas. ¿Cuánta calidad se pierde al comprimir fuertemente la red y cuánto se ahorra?'},
    D:{label:'D. Uniforme',file:'atlas_D_uniforme4x512.yaml',block:'model',field:'hidden_dims',value:'[512, 512, 512, 512]',network:'uniform',question:'Cuatro capas de 512 neuronas, sin estrechamiento. Cambian anchura y parámetros: ¿esta arquitectura aporta algo frente a la referencia y a A?'},
    E:{network:'baseline',dropout:0.6,label:'E. Dropout',file:'atlas_E_dropout0p6.yaml',block:'model',field:'dropout',value:'0.6',question:'Dropout pasa de 0.1 a 0.6. ¿Disminuye la separación entre pérdidas de entrenamiento y validación o aparece subajuste?'},
    F:{network:'baseline',dropout:0.1,label:'F. Aprendizaje',file:'atlas_F_lr0p03.yaml',block:'training',field:'learning_rate',value:'0.03',question:'La tasa de aprendizaje aumenta 30 veces: de 0.001 a 0.03. ¿Converge antes, oscila o pierde calidad?'},
    G:{network:'baseline',dropout:0.1,label:'G. Lote',file:'atlas_G_batch256.yaml',block:'training',field:'batch_size',value:'256',question:'El lote baja de 4096 a 256: aproximadamente 16 veces más actualizaciones por época. ¿Compensa la calidad el tiempo adicional? No equivale al mismo presupuesto de optimización.'},
    H:{network:'baseline',dropout:0.1,label:'H. Regularización',file:'atlas_H_weightdecay0p1.yaml',block:'training',field:'weight_decay',value:'0.1',question:'weight_decay aumenta de 0.0001 a 0.1 en AdamW. ¿La penalización más fuerte mejora la generalización o limita demasiado el aprendizaje?'}
  };
  function instructions(key){
    const s=scenarios[key];if(!s)throw Error('Variación desconocida');
    return {...s,copy:`cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/${s.file}"`,
      monitor:`python workshop/monitor_atlas.py \\\n  -f "$HOME/hep-workshop/configs/${s.file}" \\\n  --job-id "$JOB_ID" \\\n  --log "$HOME/hep-workshop/logs/atlas_\${JOB_ID}.out"`,
      yaml:`${s.block}:\n  ${s.field}: ${s.value}`,
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
