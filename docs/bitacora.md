# Bitácora del grupo

Completar la bitácora durante los entrenamientos. Las respuestas se guardan en este navegador. Descargar una copia al terminar para conservarla y compartirla en la carpeta indicada en clase.

<div id="workshop-notebook">
<div class="notebook-fields">
<label>Grupo o mesa<input name="group" maxlength="60" placeholder="Usar el mismo nombre que en la tabla de resultados"></label>
<label>Participantes<input name="participants" maxlength="300"></label>
</div>

<h2 id="antes-de-entrenar-que-informacion-tenemos">Antes de entrenar: observables físicos</h2>
<div class="notebook-fields">
<label>Variable elegida<input name="variable" maxlength="100" placeholder="Por ejemplo, DER_mass_vis"></label>
<label class="notebook-wide">¿Qué representa y qué diferencias se observan entre señal y fondo?<textarea name="physics" rows="4"></textarea></label>
</div>

<h2>Hipótesis de trabajo</h2>
<div class="notebook-fields">
<label class="notebook-wide">Cambio propuesto<textarea name="change" rows="3" placeholder="Indicar el parámetro y sus valores antes y después"></textarea></label>
<label class="notebook-wide">Resultado esperado y justificación<textarea name="hypothesis" rows="4"></textarea></label>
<label>Carpeta de referencia<input name="baseline_dir" maxlength="300"></label>
<label>Carpeta de la variación<input name="variation_dir" maxlength="300"></label>
</div>

<h2>Resultados del grupo</h2>
<p>Las filas registradas en <a href="../variaciones/#registro">Variaciones y resultados</a> aparecen aquí al utilizar el mismo grupo y navegador. Introducir o corregir los números en esa tabla para mantener un único registro.</p>
<button type="button" id="notebook-refresh" class="md-button">Actualizar resultados</button>
<div class="result-table-wrap"><table id="notebook-metrics"><thead><tr><th>Corrida</th><th>Cambio</th><th>AUC</th><th>AMS interna</th><th>Tiempo (s)</th><th>Épocas / mejor</th></tr></thead><tbody></tbody></table></div>
<p id="notebook-metrics-status"></p>

<h2>Interpretación</h2>
<div class="notebook-fields">
<label class="notebook-wide">¿Los resultados respaldan la hipótesis? Citar una métrica o una figura.<textarea name="evidence" rows="4"></textarea></label>
<label class="notebook-wide">¿AUC y AMS mejoraron juntas? ¿Cómo se interpreta la diferencia?<textarea name="metrics_interpretation" rows="4"></textarea></label>
<label class="notebook-wide">¿Qué muestran las pérdidas de entrenamiento y validación?<textarea name="learning_curves" rows="4"></textarea></label>
<label class="notebook-wide">¿La mejora justifica el tiempo de entrenamiento?<textarea name="cost" rows="3"></textarea></label>
<label class="notebook-wide">Conclusiones<textarea name="conclusion" rows="5" placeholder="Resumir el cambio, el resultado y la conclusión respaldada por la comparación"></textarea></label>
<label class="notebook-wide">¿Qué repetirían o comprobarían en una siguiente prueba?<textarea name="next_test" rows="3"></textarea></label>
</div>

<div class="result-controls">
<button type="button" id="notebook-save" class="md-button md-button--primary">Guardar bitácora</button>
<button type="button" id="notebook-download" class="md-button">Descargar para compartir (.md)</button>
<button type="button" id="notebook-backup" class="md-button">Descargar copia editable (.json)</button>
<label class="md-button">Abrir copia editable<input id="notebook-import" type="file" accept=".json,application/json"></label>
</div>
<p id="notebook-status" role="status" aria-live="polite"></p>
</div>

El archivo `.md` contiene las respuestas y la tabla del grupo y puede abrirse como texto o copiarse a un documento compartido. La copia `.json` permite continuar en otro navegador mediante **Abrir copia editable**. Las respuestas no se publican ni se sincronizan automáticamente con otros equipos.

## Referencia externa: el challenge original {#referencia-externa-el-challenge-original}

Los benchmarks publicados son **AMS 3.40 (MultiBoost)** y **3.81 (ganador)**. Nuestra AMS interna no se compara directamente: corresponde a otra evaluación. [Contexto y fuente de los números](referencia.md#benchmarks-publicados-del-higgs-challenge).

[Volver a variaciones y resultados](variaciones.md){ .md-button }
[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
