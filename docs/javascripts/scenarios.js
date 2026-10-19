(() => {
  const scenarios={
    A:{label:'A. Más ancha',file:'atlas_A_capas512-256-128-64.yaml',block:'model',field:'hidden_dims',value:'[512, 256, 128, 64]',network:'wide',question:'Cuatro capas con más neuronas: ¿mejora la validación y cuánto aumenta el tiempo?'},
    B:{label:'B. Más profunda',file:'atlas_B_capas128-128-64-64-32-32-16-16.yaml',block:'model',field:'hidden_dims',value:'[128, 128, 64, 64, 32, 32, 16, 16]',network:'deep',question:'Ocho capas, duplicando cada etapa inicial. También aumenta el número de parámetros: no es una comparación a capacidad fija. ¿La profundidad adicional aporta una mejora?'},
    C:{label:'C. Compacta',file:'atlas_C_capas64-32-16-8.yaml',block:'model',field:'hidden_dims',value:'[64, 32, 16, 8]',network:'compact',question:'Cuatro capas más pequeñas: ¿se obtiene una clasificación comparable con menos parámetros?'},
    D:{label:'D. Uniforme',file:'atlas_D_capas128-128-128-128.yaml',block:'model',field:'hidden_dims',value:'[128, 128, 128, 128]',network:'uniform',question:'Cuatro capas de igual anchura: ¿qué cambia frente a la reducción progresiva de la referencia?'},
    E:{label:'E. Dropout',file:'atlas_E_dropout0p3.yaml',block:'model',field:'dropout',value:'0.3',question:'Aumenta dropout de 0.1 a 0.3. ¿Se reduce el sobreajuste o se dificulta el aprendizaje?'},
    F:{label:'F. Aprendizaje',file:'atlas_F_lr0p0003.yaml',block:'training',field:'learning_rate',value:'0.0003',question:'Reduce la tasa de 0.001 a 0.0003. ¿La convergencia es más estable o necesita más épocas?'},
    G:{label:'G. Lote',file:'atlas_G_batch8192.yaml',block:'training',field:'batch_size',value:'8192',question:'Aumenta el lote de 4096 a 8192. Habrá menos actualizaciones por época: ¿cómo cambian tiempo y calidad?'},
    H:{label:'H. Duración',file:'atlas_H_epochs100.yaml',block:'training',field:'epochs',value:'100',question:'Aumenta el máximo de 40 a 100 épocas y conserva paciencia 10. Si la parada temprana ocurre antes de 40, puede no cambiar el resultado.'}
  };
  function instructions(key){
    const s=scenarios[key];if(!s)throw Error('Variación desconocida');
    return {...s,copy:`cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/${s.file}"`,
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
    set('scenario-title',s.label);set('scenario-question',s.question);set('scenario-copy',s.copy);
    set('scenario-path',`hep-workshop → configs → ${s.file}`);set('scenario-yaml',s.yaml);set('scenario-submit',s.submit);set('scenario-log-label',s.label);
    const network=document.getElementById('scenario-network');network.hidden=!s.network;
    if(s.network){const select=document.getElementById('network-choice');select.value=s.network;document.getElementById('dropout-choice').value='0.1';select.dispatchEvent(new Event('change'));}
  }));
})();
