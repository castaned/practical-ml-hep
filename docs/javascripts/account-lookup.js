(() => {
  const root=document.querySelector('#account-lookup');if(!root)return;
  const form=root.querySelector('form'),button=form.querySelector('button'),status=root.querySelector('[role="status"]');
  const script=document.currentScript;
  const configUrl=new URL('../assets/account-lookup.json',script.src);
  fetch(configUrl,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(config=>{
    const url=new URL(config.endpoint);
    if(url.protocol!=='https:' || url.hostname!=='script.google.com' || !url.pathname.endsWith('/exec'))throw Error();
    form.action=url.href;button.disabled=false;status.textContent='Escribe tu nombre y apellido tal como fueron registrados.';
    form.addEventListener('submit',()=>{root.querySelector('iframe').hidden=false;status.textContent='Consultando tu cuenta…';});
    root.querySelector('iframe').addEventListener('load',()=>{if(!root.querySelector('iframe').hidden)status.textContent='Consulta completada. Revisa la respuesta debajo.';});
  }).catch(()=>{status.textContent='Consulta en preparación: falta activar la conexión con la hoja de cuentas.';});
})();
