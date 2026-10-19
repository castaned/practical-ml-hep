# Bitácora de resultados

1. Selecciona la **variación** que ejecutaste (o **Referencia** para el benchmark).
2. Carga el `metrics.json` de esa ejecución: los indicadores se completan automáticamente. También puedes copiarlos a mano.
3. Pulsa **Descargar registro CSV** y sube el archivo a **`/lustre/cursos/curso07/variaciones/`**. En Open OnDemand, abre **Files → Curso: curso07 → variaciones** y pulsa **Upload** para seleccionar el CSV descargado. El instructor reunirá estos archivos en la [tabla de resumen](variaciones.md#registro).

<div id="simple-log">
<label class="md-button">Cargar metrics.json<input id="simple-metrics" type="file" accept=".json,application/json"></label>
<form class="result-form">
<label>Variación<select name="variation"><option>Referencia</option><option>A. Más ancha</option><option>B. Más profunda</option><option>C. Compacta</option><option>D. Uniforme</option><option>E. Dropout</option><option>F. Aprendizaje</option><option>G. Lote</option><option>H. Duración</option></select></label>
<label>AUC · roc_auc_unweighted<input name="auc" type="number" min="0" max="1" step="any" required></label>
<label>AMS · ams_validation_tuned<input name="ams" type="number" min="0" step="any" required></label>
<label>Tiempo (s) · fit_seconds<input name="seconds" type="number" min="0" step="any" required></label>
<label>Parámetros · parameters<input name="parameters" type="number" min="1" step="1" required></label>
<label>Épocas ejecutadas · epochs_run<input name="epochs" type="number" min="1" step="1" required></label>
<label>Mejor época · best_epoch<input name="best" type="number" min="1" step="1" required></label>
<div><button type="submit" class="md-button md-button--primary">Descargar registro CSV</button></div>
</form>
<p id="simple-log-status" role="status"></p>
</div>

**Qué compararemos:** AUC y AMS describen la calidad; tiempo y número de parámetros, el costo y la capacidad; mejor época y épocas ejecutadas, la duración y la parada temprana. El sobreajuste se revisa en las curvas de pérdidas.

Un CSV corresponde a una ejecución. Registra por separado la referencia y cada variación; el nombre del archivo identifica la opción y el momento de descarga. Las conclusiones se discutirán con la tabla conjunta, sin escribirlas en este formulario.

[Volver a las variaciones](variaciones.md){ .md-button }
