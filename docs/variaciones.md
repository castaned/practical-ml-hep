# Variaciones del benchmark

Parte del benchmark y cambia **solo el parámetro de tu escenario**. Después registra sus indicadores en la [bitácora](bitacora.md). La comparación se hará con los CSV reunidos de las ejecuciones.

## 1. Elige la variación asignada {#1-escenarios-por-grupo}

Cada escenario puede asignarse a unas diez personas. Al menos dos estudiantes o parejas ejecutan la referencia y la variación en sus cuentas; los demás apoyan en la revisión de las figuras.

Selecciona una fila para ver las instrucciones de esa variación. Conserva los demás parámetros y las mismas particiones del benchmark.

<div id="scenario-picker" class="result-table-wrap">
<table><thead><tr><th>Variación</th><th>Parámetro</th><th>Configuración nueva</th><th>Elegir</th></tr></thead><tbody>
<tr data-scenario-row="A"><td><strong>A · Más ancha</strong></td><td><code>model.hidden_dims</code></td><td><code>[512, 256, 128, 64]</code></td><td><button type="button" class="md-button" data-scenario="A" aria-label="Seleccionar A: Más ancha" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="B"><td><strong>B · Más profunda</strong></td><td><code>model.hidden_dims</code></td><td><code>[128, 128, 64, 64, 32, 32, 16, 16]</code></td><td><button type="button" class="md-button" data-scenario="B" aria-label="Seleccionar B: Más profunda" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="C"><td><strong>C · Compacta</strong></td><td><code>model.hidden_dims</code></td><td><code>[64, 32, 16, 8]</code></td><td><button type="button" class="md-button" data-scenario="C" aria-label="Seleccionar C: Compacta" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="D"><td><strong>D · Anchura uniforme</strong></td><td><code>model.hidden_dims</code></td><td><code>[128, 128, 128, 128]</code></td><td><button type="button" class="md-button" data-scenario="D" aria-label="Seleccionar D: Anchura uniforme" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="E"><td><strong>E · Dropout</strong></td><td><code>model.dropout</code></td><td><code>0.1 → 0.3</code></td><td><button type="button" class="md-button" data-scenario="E" aria-label="Seleccionar E: Dropout" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="F"><td><strong>F · Aprendizaje</strong></td><td><code>training.learning_rate</code></td><td><code>0.001 → 0.0003</code></td><td><button type="button" class="md-button" data-scenario="F" aria-label="Seleccionar F: Aprendizaje" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="G"><td><strong>G · Tamaño de lote</strong></td><td><code>training.batch_size</code></td><td><code>4096 → 8192</code></td><td><button type="button" class="md-button" data-scenario="G" aria-label="Seleccionar G: Tamaño de lote" aria-pressed="false">Seleccionar</button></td></tr>
<tr data-scenario-row="H"><td><strong>H · Duración máxima</strong></td><td><code>training.epochs</code></td><td><code>40 → 100</code></td><td><button type="button" class="md-button" data-scenario="H" aria-label="Seleccionar H: Duración máxima" aria-pressed="false">Seleccionar</button></td></tr>
</tbody></table>
</div>

## 2. Preparar y ejecutar la variación

<div id="scenario-instructions" aria-live="polite">
<p id="scenario-empty">Elige una variación en la tabla de arriba.</p>
<div id="scenario-detail" hidden>
<h3 id="scenario-title"></h3>
<p id="scenario-question"></p>
<p><strong>1. Crea la copia del YAML</strong> desde la terminal de JupyterLab:</p>
<pre><code id="scenario-copy" class="language-bash"></code></pre>
<p><strong>2. Ábrela en el explorador izquierdo:</strong> <code id="scenario-path"></code>.</p>
<p>Dentro del archivo completo, modifica <strong>solo el campo indicado</strong>. No reemplaces toda la sección por este fragmento:</p>
<pre><code id="scenario-yaml" class="language-yaml"></code></pre>
<p><strong>3. Guarda con Ctrl+S y envía el trabajo:</strong></p>
<pre><code id="scenario-submit" class="language-bash"></code></pre>
<p>La salida se crea en una nueva carpeta <code>run_XXXX</code>; no necesitas cambiar <code>output.directory</code>.</p>
<p><strong>4. Al terminar:</strong> abre la carpeta que indique el log, revisa las figuras y carga su <code>metrics.json</code> en la bitácora, seleccionando <strong id="scenario-log-label"></strong>.</p>
</div>
</div>

<div id="scenario-network" hidden markdown>

### Explorar las capas de esta variación {#explorar-la-arquitectura-antes-de-modificar-el-yaml}

El dibujo muestra la arquitectura elegida. Mantén dropout en `0.1` para comparar A–D.

<div class="network-explorer" data-network-explorer>
<div class="explorer-intro">
<span class="eyebrow">ARQUITECTURAS DE REFERENCIA</span>
<h3>Capas y parámetros entrenables</h3>
<p>Elige una arquitectura para explorar sus capas, parámetros y configuración YAML.</p>
<label for="network-choice">Arquitectura</label>
<select id="network-choice">
<option value="baseline">Referencia · cuatro capas</option>
<option value="wide">A · Más ancha · cuatro capas</option>
<option value="deep">B · Más profunda · ocho capas</option>
<option value="compact">C · Compacta · cuatro capas</option>
<option value="uniform">D · Uniforme · cuatro capas</option>
</select>
<label for="dropout-choice">Dropout <output id="dropout-value">0.1</output></label>
<input id="dropout-choice" type="range" min="0" max="0.5" step="0.1" value="0.1">
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
