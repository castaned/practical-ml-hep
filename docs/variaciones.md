# Variaciones del benchmark

Parte del benchmark y cambia **solo el parámetro de tu escenario**. Después registra sus indicadores en la [bitácora](bitacora.md). La tabla de comparación se genera allí automáticamente.

## 1. Elige la variación asignada {#1-escenarios-por-grupo}

Selecciona una variación para ver sus instrucciones.

<div id="scenario-picker" class="result-table-wrap">
<table><thead><tr><th>Variación</th><th>Parámetro</th><th>Configuración nueva</th><th>Parámetros entrenables</th><th>Elegir</th></tr></thead><tbody>
<tr data-scenario-row="A"><td><strong>A · Más ancha</strong></td><td><code>model.hidden_dims</code></td><td><code>[1024, 512, 256, 128]</code></td><td>720 897</td><td><button type="button" class="md-button" data-scenario="A" aria-label="Seleccionar A: Más ancha" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="B"><td><strong>B · Compacta</strong></td><td><code>model.hidden_dims</code></td><td><code>[8, 4]</code></td><td>289</td><td><button type="button" class="md-button" data-scenario="B" aria-label="Seleccionar B: Compacta" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="C"><td><strong>C · Dropout</strong></td><td><code>model.dropout</code></td><td><code>0.1 → 0.6</code></td><td>14 849</td><td><button type="button" class="md-button" data-scenario="C" aria-label="Seleccionar C: Dropout" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="D"><td><strong>D · Aprendizaje</strong></td><td><code>training.learning_rate</code></td><td><code>0.001 → 0.0005</code></td><td>14 849</td><td><button type="button" class="md-button" data-scenario="D" aria-label="Seleccionar D: Aprendizaje" aria-pressed="false">Seleccionar</button></td></tr>
</tbody></table>
</div>

<div id="scenario-instructions" aria-live="polite">
<p id="scenario-empty" hidden></p>
<div id="scenario-detail" hidden>
<h3 id="scenario-title"></h3>
<p id="scenario-question"></p>
<p id="scenario-architecture"></p>
<p><strong>1. Crea la copia del YAML</strong> desde la terminal de JupyterLab:</p>
<pre><code id="scenario-copy" class="language-bash"></code></pre>
<p><strong>2. Ábrela en el explorador izquierdo:</strong> <code id="scenario-path"></code>.</p>
<p>Actualiza el parámetro indicado y la carpeta <code>output.directory</code> como se muestra. Conserva los demás valores del YAML:</p>
<pre><code id="scenario-yaml" class="language-yaml"></code></pre>
<p><strong>3. Guarda con Ctrl+S y envía el trabajo:</strong></p>
<pre><code id="scenario-submit" class="language-bash"></code></pre>
<p>Cada variación tiene su propia carpeta de resultados. Dentro se crean <code>run_0001</code>, <code>run_0002</code>, etc., sin sobrescribir ejecuciones.</p>
<p><strong>4. Monitorea el entrenamiento</strong> en la misma terminal, usando el <code>JOB_ID</code> del trabajo que acabas de enviar:</p>
<pre><code id="scenario-monitor" class="language-bash"></code></pre>
<p>El visor muestra el estado del trabajo, el avance de las épocas y la carpeta de resultados. <strong>Ctrl+C cierra solo el visor;</strong> el entrenamiento continúa en Slurm.</p>
<p><strong>5. Al terminar:</strong> abre la carpeta que indique el log, revisa las figuras y registra sus indicadores en la bitácora, seleccionando <strong id="scenario-log-label"></strong>.</p>
</div>
</div>

## 2. Registrar resultados {#registro}

Abre la **Bitácora y resumen** para registrar la referencia y las variaciones. Allí se guardan los valores y se genera la tabla automáticamente.

[Registrar valores y ver la tabla](bitacora.md){ .md-button .md-button--primary }

[Anterior: benchmark](laboratorio.md){ .md-button }
[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
