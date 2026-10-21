# Bitácora y resumen

1. Selecciona **Referencia** o la variación que ejecutaste.
2. Introduce los seis indicadores de `metrics.json`, o carga el archivo para completarlos automáticamente.
3. Pulsa **Guardar ejecución**. La tabla de abajo se actualiza y puedes registrar la siguiente corrida.

**Los registros quedan guardados en este navegador**, incluso al recargar o volver después. El formulario pendiente también se recupera. No se sincronizan entre equipos o estudiantes; descarga el CSV para respaldarlos o compartirlos. En modo incógnito, el guardado es temporal.

<div id="simple-log">
<label class="md-button">Cargar metrics.json<input id="simple-metrics" type="file" accept=".json,application/json"></label>
<form class="result-form">
<label>Variación<select name="variation"><option>Referencia</option><option>A. Más ancha</option><option>B. Compacta</option><option>C. Dropout</option><option>D. Aprendizaje</option></select></label>
<label>AUC · roc_auc_unweighted<input name="auc" type="number" min="0" max="1" step="any" required></label>
<label>AMS · ams_validation_tuned<input name="ams" type="number" min="0" step="any" required></label>
<label>Tiempo (s) · fit_seconds<input name="seconds" type="number" min="0" step="any" required></label>
<label>Parámetros · parameters<input name="parameters" type="number" min="1" step="1" required></label>
<label>Épocas ejecutadas · epochs_run<input name="epochs" type="number" min="1" step="1" required></label>
<label>Mejor época · best_epoch<input name="best" type="number" min="1" step="1" required></label>
<div><button type="submit" class="md-button md-button--primary">Guardar ejecución</button></div>
</form>
<p id="simple-log-status" role="status"></p>
</div>

**Qué compararemos:** AUC y AMS describen la calidad; tiempo y número de parámetros, el costo y la capacidad; mejor época y épocas ejecutadas, la duración y la parada temprana. El sobreajuste se revisa en las curvas de pérdidas.

## Resumen de resultados

Cada fila corresponde a una ejecución. Puedes conservar repeticiones de la misma variación y eliminar una fila si la introdujiste incorrectamente.

<div id="simple-summary">
<button id="simple-export" class="md-button" type="button">Descargar tabla CSV</button>
<label class="md-button">Importar CSV<input id="simple-import" type="file" accept=".csv,text/csv" multiple></label>
<button id="simple-clear" class="md-button" type="button">Borrar todos los registros locales</button>
<p id="simple-summary-status" role="status"></p>
<div class="result-table-wrap"><table><thead><tr><th>Variación</th><th>AUC</th><th>AMS interna</th><th>Tiempo (s)</th><th>Parámetros</th><th>Épocas</th><th>Mejor época</th><th>Acción</th></tr></thead><tbody></tbody></table></div>
</div>

**Para reunir resultados del grupo:** descarga la tabla CSV. El instructor puede importar los CSV de otros estudiantes para añadirlos al mismo resumen, sin volver a introducir sus indicadores. Si se utiliza la carpeta de entrega, súbelos a `/lustre/cursos/curso07/variaciones/` desde Open OnDemand.

[Volver a las variaciones](variaciones.md){ .md-button }

[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
