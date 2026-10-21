# Variaciones del benchmark

Parte del benchmark y cambia **solo el parámetro de tu escenario**. Después registra sus indicadores en la [bitácora](bitacora.md). La comparación se hará con los CSV reunidos de las ejecuciones.

## 1. Elige la variación asignada {#1-escenarios-por-grupo}

Trabajaremos con **cuatro variaciones**, además de la referencia. El instructor solicitará resultados de quienes puedan ejecutarlas; los demás pueden apoyar en la lectura de las figuras y la comparación de indicadores. Reúne repeticiones cuando estén disponibles.

**Mantén las 30 variables de entrada (`all_physics`), los mismos datos y la partición con semilla 16.** Todas las pruebas conservan máximo 100 épocas y paciencia 20. Compara cada variación con tu referencia; no acumules cambios entre escenarios.

Estos contrastes exploran capacidad, optimización y regularización. Una diferencia grande revela sensibilidad en las condiciones de esta prueba; confirma las tendencias con las repeticiones y las curvas de pérdidas.

**En C y D se conserva la arquitectura del benchmark: `[128, 64, 32, 16]`, con 14 849 parámetros entrenables.** C cambia solo dropout; D cambia solo la tasa de aprendizaje. En A, B y D se conserva dropout `0.1`.

Selecciona una fila para ver las instrucciones de esa variación. Conserva los demás parámetros y las mismas particiones del benchmark.

<div id="scenario-picker" class="result-table-wrap">
<table><thead><tr><th>Variación</th><th>Parámetro</th><th>Configuración nueva</th><th>Elegir</th></tr></thead><tbody>
<tr data-scenario-row="A"><td><strong>A · Más ancha</strong></td><td><code>model.hidden_dims</code></td><td><code>[1024, 512, 256, 128]</code></td><td><button type="button" class="md-button" data-scenario="A" aria-label="Seleccionar A: Más ancha" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="B"><td><strong>B · Compacta</strong></td><td><code>model.hidden_dims</code></td><td><code>[8, 4]</code></td><td><button type="button" class="md-button" data-scenario="B" aria-label="Seleccionar B: Compacta" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="C"><td><strong>C · Dropout</strong></td><td><code>model.dropout</code></td><td><code>0.1 → 0.6</code></td><td><button type="button" class="md-button" data-scenario="C" aria-label="Seleccionar C: Dropout" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="D"><td><strong>D · Aprendizaje</strong></td><td><code>training.learning_rate</code></td><td><code>0.001 → 0.0005</code></td><td><button type="button" class="md-button" data-scenario="D" aria-label="Seleccionar D: Aprendizaje" aria-pressed="false">Seleccionar</button></td></tr>
</tbody></table>
</div>

## 2. Preparar y ejecutar la variación

El primer bloque actualiza el repositorio antes de copiar el YAML. Revisa que tu referencia tenga `training.epochs: 100` y `training.patience: 20`; si ya existía, `cp -n` conserva sus valores anteriores. Usa estas mismas condiciones en la referencia y las cuatro variantes. La paciencia cuenta épocas **consecutivas** sin mejorar la pérdida de validación y se reinicia cuando mejora.

<div id="scenario-instructions" aria-live="polite">
<p id="scenario-empty">Elige una variación en la tabla de arriba.</p>
<div id="scenario-detail" hidden>
<h3 id="scenario-title"></h3>
<p id="scenario-question"></p>
<p id="scenario-architecture"></p>
<p><strong>1. Crea la copia del YAML</strong> desde la terminal de JupyterLab:</p>
<pre><code id="scenario-copy" class="language-bash"></code></pre>
<p><strong>2. Ábrela en el explorador izquierdo:</strong> <code id="scenario-path"></code>.</p>
<p>Dentro del archivo completo, cambia el parámetro indicado y añade <code>output.run_name</code> para identificar los resultados. Conserva <code>output.directory</code> y los demás valores; no reemplaces secciones completas por este fragmento:</p>
<pre><code id="scenario-yaml" class="language-yaml"></code></pre>
<p><strong>3. Guarda con Ctrl+S y envía el trabajo:</strong></p>
<pre><code id="scenario-submit" class="language-bash"></code></pre>
<p>La salida se crea dentro de <code>output.directory</code>, con el nombre de la variación y un número: por ejemplo <code>atlas_A_capas1024-512-256-128_0001</code>. Al repetirla se crea <code>..._0002</code>, sin sobrescribir resultados.</p>
<p><strong>4. Monitorea el entrenamiento</strong> en la misma terminal, usando el <code>JOB_ID</code> del trabajo que acabas de enviar:</p>
<pre><code id="scenario-monitor" class="language-bash"></code></pre>
<p>El visor muestra el estado del trabajo, el avance de las épocas y la carpeta de resultados. <strong>Ctrl+C cierra solo el visor;</strong> el entrenamiento continúa en Slurm.</p>
<p><strong>5. Al terminar:</strong> abre la carpeta que indique el log, revisa las figuras y carga su <code>metrics.json</code> en la bitácora, seleccionando <strong id="scenario-log-label"></strong>.</p>
</div>
</div>

<div id="scenario-network" hidden markdown>

### Explorar las capas de esta variación {#explorar-la-arquitectura-antes-de-modificar-el-yaml}

En la referencia, `[128, 64, 32, 16]` describe cuatro capas ocultas; la entrada sigue teniendo 30 variables y la salida una neurona. El explorador muestra la arquitectura del escenario seleccionado y sus parámetros entrenables. C usa dropout `0.6`; los demás escenarios usan `0.1`. Cambiar dropout no altera el número de parámetros.

<div class="network-explorer" data-network-explorer>
<div class="explorer-intro">
<span class="eyebrow">ARQUITECTURAS DE REFERENCIA</span>
<h3>Capas y parámetros entrenables</h3>
<p>Elige una arquitectura para explorar sus capas, parámetros y configuración YAML.</p>
<label for="network-choice">Arquitectura</label>
<select id="network-choice">
<option value="baseline">Referencia · cuatro capas</option>
<option value="wide">A · Más ancha · cuatro capas</option>
<option value="compact">B · Compacta · dos capas</option>
</select>
<p id="network-scenario" role="status"></p>
<label for="dropout-choice">Dropout <output id="dropout-value">0.1</output></label>
<input id="dropout-choice" type="range" min="0" max="0.6" step="0.1" value="0.1">
<p class="explorer-hint">El aumento del número de parámetros puede modificar el tiempo de entrenamiento y el sobreajuste. Su efecto sobre la clasificación se evaluará con las mismas particiones de datos.</p>
</div>
<div class="explorer-result">
<div class="network-layers" id="network-layers" aria-label="Capas de la red elegida"></div>
<p class="parameter-count"><strong id="parameter-count">14 849</strong> parámetros entrenables</p>
<pre><code id="network-yaml">model:
  hidden_dims: [128, 64, 32, 16]
  dropout: 0.1</code></pre>
<button type="button" id="copy-network">Copiar fragmento YAML</button>
<p id="copy-status" role="status">Conserva el resto de tu YAML; cada ejecución crea una carpeta con su nombre y número.</p>
</div>
</div>

</div>

## 3. Registrar resultados {#registro}

Abre la **Bitácora y resumen** para registrar la referencia y las variaciones. Allí se guardan los valores y se genera la tabla automáticamente.

[Registrar valores y ver la tabla](bitacora.md){ .md-button .md-button--primary }

[Anterior: benchmark](laboratorio.md){ .md-button }
[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
