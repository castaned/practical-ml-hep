# Variaciones del benchmark

Parte del benchmark y cambia **solo el parámetro de tu escenario**. Después registra sus indicadores en la [bitácora](bitacora.md). La comparación se hará con los CSV reunidos de las ejecuciones.

## 1. Elige la variación asignada {#1-escenarios-por-grupo}

Cada escenario puede asignarse a unas diez personas. Al menos dos estudiantes o parejas ejecutan la referencia y la variación en sus cuentas; los demás apoyan en la revisión de las figuras.

**Mantén las 30 variables de entrada (`all_physics`), los mismos datos y la partición con semilla 16.** Todas las pruebas conservan máximo 40 épocas y paciencia 10. Compara cada variación con tu referencia; no acumules cambios entre escenarios.

Estos contrastes exploran capacidad, optimización y regularización. Una diferencia grande revela sensibilidad en las condiciones de esta prueba; confirma las tendencias con las repeticiones y las curvas de pérdidas.

**En E–H se conserva la arquitectura del benchmark: `[128, 64, 32, 16]`, con 14 849 parámetros entrenables.** E cambia únicamente dropout; F–H conservan también dropout en `0.1`.

Selecciona una fila para ver las instrucciones de esa variación. Conserva los demás parámetros y las mismas particiones del benchmark.

<div id="scenario-picker" class="result-table-wrap">
<table><thead><tr><th>Variación</th><th>Parámetro</th><th>Configuración nueva</th><th>Elegir</th></tr></thead><tbody>
<tr data-scenario-row="A"><td><strong>A · Más ancha</strong></td><td><code>model.hidden_dims</code></td><td><code>[2048, 1024, 512, 256]</code></td><td><button type="button" class="md-button" data-scenario="A" aria-label="Seleccionar A: Más ancha" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="B"><td><strong>B · Más profunda</strong></td><td><code>model.hidden_dims</code></td><td>10 capas de <code>128</code> neuronas</td><td><button type="button" class="md-button" data-scenario="B" aria-label="Seleccionar B: Más profunda" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="C"><td><strong>C · Compacta</strong></td><td><code>model.hidden_dims</code></td><td><code>[8, 4]</code></td><td><button type="button" class="md-button" data-scenario="C" aria-label="Seleccionar C: Compacta" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="D"><td><strong>D · Anchura uniforme</strong></td><td><code>model.hidden_dims</code></td><td><code>[512, 512, 512, 512]</code></td><td><button type="button" class="md-button" data-scenario="D" aria-label="Seleccionar D: Anchura uniforme" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="E"><td><strong>E · Dropout</strong></td><td><code>model.dropout</code></td><td><code>0.1 → 0.6</code></td><td><button type="button" class="md-button" data-scenario="E" aria-label="Seleccionar E: Dropout" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="F"><td><strong>F · Aprendizaje</strong></td><td><code>training.learning_rate</code></td><td><code>0.001 → 0.03</code></td><td><button type="button" class="md-button" data-scenario="F" aria-label="Seleccionar F: Aprendizaje" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="G"><td><strong>G · Tamaño de lote</strong></td><td><code>training.batch_size</code></td><td><code>4096 → 256</code></td><td><button type="button" class="md-button" data-scenario="G" aria-label="Seleccionar G: Tamaño de lote" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="H"><td><strong>H · Regularización</strong></td><td><code>training.weight_decay</code></td><td><code>0.0001 → 0.1</code></td><td><button type="button" class="md-button" data-scenario="H" aria-label="Seleccionar H: Regularización" aria-pressed="false">Seleccionar</button></td></tr>
</tbody></table>
</div>

## 2. Preparar y ejecutar la variación

<div id="scenario-instructions" aria-live="polite">
<p id="scenario-empty">Elige una variación en la tabla de arriba.</p>
<div id="scenario-detail" hidden>
<h3 id="scenario-title"></h3>
<p id="scenario-question"></p>
<p id="scenario-architecture"></p>
<p><strong>1. Crea la copia del YAML</strong> desde la terminal de JupyterLab:</p>
<pre><code id="scenario-copy" class="language-bash"></code></pre>
<p><strong>2. Ábrela en el explorador izquierdo:</strong> <code id="scenario-path"></code>.</p>
<p>Dentro del archivo completo, modifica <strong>solo el campo indicado</strong>. No reemplaces toda la sección por este fragmento:</p>
<pre><code id="scenario-yaml" class="language-yaml"></code></pre>
<p><strong>3. Guarda con Ctrl+S y envía el trabajo:</strong></p>
<pre><code id="scenario-submit" class="language-bash"></code></pre>
<p>La salida se crea en una nueva carpeta <code>run_XXXX</code>; no necesitas cambiar <code>output.directory</code>.</p>
<p><strong>4. Monitorea el entrenamiento</strong> en la misma terminal, usando el <code>JOB_ID</code> del trabajo que acabas de enviar:</p>
<pre><code id="scenario-monitor" class="language-bash"></code></pre>
<p>El visor muestra el estado del trabajo, el avance de las épocas y la carpeta de resultados. <strong>Ctrl+C cierra solo el visor;</strong> el entrenamiento continúa en Slurm.</p>
<p><strong>5. Al terminar:</strong> abre la carpeta que indique el log, revisa las figuras y carga su <code>metrics.json</code> en la bitácora, seleccionando <strong id="scenario-log-label"></strong>.</p>
</div>
</div>

<div id="scenario-network" hidden markdown>

### Explorar las capas de esta variación {#explorar-la-arquitectura-antes-de-modificar-el-yaml}

En la referencia, `[128, 64, 32, 16]` describe cuatro capas ocultas; la entrada sigue teniendo 30 variables y la salida una neurona. El explorador muestra la arquitectura del escenario seleccionado y sus parámetros entrenables. E usa dropout `0.6`; los demás escenarios usan `0.1`. Cambiar dropout no altera el número de parámetros.

<div class="network-explorer" data-network-explorer>
<div class="explorer-intro">
<span class="eyebrow">ARQUITECTURAS DE REFERENCIA</span>
<h3>Capas y parámetros entrenables</h3>
<p>Elige una arquitectura para explorar sus capas, parámetros y configuración YAML.</p>
<label for="network-choice">Arquitectura</label>
<select id="network-choice">
<option value="baseline">Referencia · cuatro capas</option>
<option value="wide">A · Más ancha · cuatro capas</option>
<option value="deep">B · Más profunda · diez capas</option>
<option value="compact">C · Compacta · dos capas</option>
<option value="uniform">D · Uniforme · cuatro capas</option>
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
<p id="copy-status" role="status">Conserva el resto de tu YAML; cada ejecución crea su propia carpeta numerada.</p>
</div>
</div>

</div>

## 3. Bitácora y entrega

1. Abre la [bitácora de resultados](bitacora.md), selecciona la variación y carga el `metrics.json` de la corrida.
2. Comprueba los seis indicadores y descarga su **registro CSV**. Registra también el benchmark como **Referencia** en otro CSV.
3. El responsable sube los CSV a **`/lustre/cursos/curso07/variaciones/`**. En Open OnDemand, abre **Files → Curso: curso07 → variaciones → Upload** y selecciona los archivos descargados.

[Registrar indicadores](bitacora.md){ .md-button .md-button--primary }

## 4. Tabla de resumen {#registro}

El instructor descarga los CSV de **`/lustre/cursos/curso07/variaciones/`** y los selecciona juntos con **Reunir registros CSV**. La tabla se genera automáticamente; cada fila corresponde a una ejecución, sin promediar ni ocultar las repeticiones.

<div id="simple-summary">
<label class="md-button">Reunir registros CSV<input id="simple-import" type="file" accept=".csv,text/csv" multiple></label>
<button id="simple-clear" class="md-button" type="button">Vaciar resumen</button>
<p id="simple-summary-status" role="status">Selecciona los CSV para mostrar la comparación.</p>
<div class="result-table-wrap"><table><thead><tr><th>Variación</th><th>AUC</th><th>AMS interna</th><th>Tiempo (s)</th><th>Parámetros</th><th>Épocas</th><th>Mejor época</th><th>Registro</th></tr></thead><tbody></tbody></table></div>
</div>

### Discusión de la tabla

- ¿Qué variaciones mejoran AUC y AMS respecto a la referencia?
- ¿La mejora compensa el tiempo y el número de parámetros?
- ¿Las repeticiones de la misma variación dan resultados parecidos?
- ¿Las curvas de pérdidas muestran sobreajuste?

Compara tiempos obtenidos en equipos y condiciones equivalentes. La AMS es una medida de sensibilidad interna en simulación, no una significancia observada.

[Anterior: benchmark](laboratorio.md){ .md-button }
[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
