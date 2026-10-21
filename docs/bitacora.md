# Bitácora y resumen

1. Selecciona **Referencia** o la variación que ejecutaste.
2. Escribe los cinco valores obtenidos en el entrenamiento.
3. Pulsa **Guardar ejecución**. La tabla de abajo se actualiza y puedes registrar la siguiente corrida.

**Los valores se conservan en este navegador al volver a la página.**

<div id="simple-log">
<form class="result-form">
<label>Variación<select name="variation"><option>Referencia</option><option>A. Más ancha</option><option>B. Compacta</option><option>C. Dropout</option><option>D. Aprendizaje</option></select></label>
<label>AUC · roc_auc_unweighted<input name="auc" type="number" min="0" max="1" step="any" required></label>
<label>Tiempo (s) · fit_seconds<input name="seconds" type="number" min="0" step="any" required></label>
<label>Parámetros · parameters<input name="parameters" type="number" min="1" step="1" required></label>
<label>Épocas ejecutadas · epochs_run<input name="epochs" type="number" min="1" step="1" required></label>
<label>Mejor época · best_epoch<input name="best" type="number" min="1" step="1" required></label>
<div><button type="submit" class="md-button md-button--primary">Guardar ejecución</button></div>
</form>
<p id="simple-log-status" role="status"></p>
</div>

**Qué compararemos:** AUC y las curvas de pérdidas describen la calidad; tiempo y parámetros muestran el costo; las épocas indican cuándo se conservó el mejor modelo.

## Resumen de resultados

Cada fila corresponde a una ejecución. Puedes conservar repeticiones de la misma variación y eliminar una fila si la introdujiste incorrectamente.

<div id="simple-summary">
<p id="simple-summary-status" role="status"></p>
<div class="result-table-wrap"><table><thead><tr><th>Variación</th><th>AUC</th><th>Tiempo (s)</th><th>Parámetros</th><th>Épocas</th><th>Mejor época</th><th>Acción</th></tr></thead><tbody></tbody></table></div>
</div>


[Volver a las variaciones](variaciones.md){ .md-button }

[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
