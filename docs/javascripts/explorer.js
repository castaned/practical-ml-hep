(() => {
  const root = document.querySelector('[data-network-explorer]');
  if (!root) return;
  const choices = { baseline:[128,64,32,16], wide:[512,256,128,64], deep:[128,128,64,64,32,32,16,16], compact:[64,32,16,8], uniform:[128,128,128,128] };
  const select = root.querySelector('#network-choice');
  const slider = root.querySelector('#dropout-choice');
  const code = root.querySelector('#network-yaml');
  const status = root.querySelector('#copy-status');
  const count = dims => dims.slice(1).reduce((total,n,i) => total + dims[i]*n+n, 0);
  const update = () => {
    const hidden = choices[select.value];
    const dims = [30,...hidden,1];
    const layers = root.querySelector('#network-layers');
    layers.replaceChildren(...dims.map((n,i) => {
      const node=document.createElement('span'); node.textContent=n;
      node.className = i>0 && i<dims.length-1 ? 'hidden' : '';
      node.title = i===0 ? '30 variables de entrada' : i===dims.length-1 ? 'Salida de clasificación' : `Capa oculta ${i}: ${n} neuronas`;
      return node;
    }));
    root.querySelector('#parameter-count').textContent = new Intl.NumberFormat('es-MX').format(count(dims));
    root.querySelector('#dropout-value').textContent = Number(slider.value).toFixed(1);
    code.textContent = `model:\n  hidden_dims: [${hidden.join(', ')}]\n  dropout: ${Number(slider.value).toFixed(1)}`;
    status.textContent='Conserva el resto de tu YAML; cada ejecución crea su propia carpeta numerada.';
  };
  select.addEventListener('change',update); slider.addEventListener('input',update);
  root.querySelector('#copy-network').addEventListener('click',async () => {
    try { await navigator.clipboard.writeText(code.textContent); status.textContent='Fragmento copiado. Pégalo dentro de tu YAML en el editor de Yuca.'; }
    catch { status.textContent='Selecciona el fragmento para copiarlo y pegarlo dentro de tu YAML.'; }
  });
  update();
})();
