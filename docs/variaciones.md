# Variaciones del benchmark

Esta actividad corresponde al **bloque del miércoles de 17:00 a 18:30**. Utilizar el YAML `atlas_baseline01.yaml` y los resultados de `atlas_gpu_baseline01` obtenidos en el [benchmark](laboratorio.md).

Antes de preparar cambios, completar la [comparación del benchmark](laboratorio.md#comparar-benchmark), revisar `training_loss.png`, `roc_curve.png` y `classifier_scores.png` y registrar la corrida como **Referencia** en la [tabla](#registro). Las variaciones se compararán con esa ejecución personal, realizada con los mismos datos y particiones.

## 1. Ocho escenarios de trabajo {#1-escenarios-por-grupo}

Para 80 estudiantes, se proponen **ocho grupos de unas diez personas**, `g01` a `g08`. Todos reproducen primero la referencia; después cada grupo estudia el escenario asignado.

Dentro de cada grupo, al menos **dos estudiantes o parejas** ejecutan de forma independiente la referencia y la variación en sus propias cuentas. Comparen sus resultados y registren cada ejecución; no hace falta enviar diez trabajos idénticos al mismo tiempo. Los demás integrantes pueden revisar las curvas, interpretar las métricas y completar la bitácora.

Usa **`gNN_escenario_cambio.yaml`**, sin espacios ni acentos. Los nombres siguientes corresponden al reparto sugerido. Si repites un YAML, identifica la nueva corrida con su `run_XXXX` y el usuario que la ejecutó.

### Escenarios A–D · Arquitectura de la red

En estos cuatro escenarios cambia **solo `model.hidden_dims`**. Conserva dropout `0.1`, aprendizaje `0.001`, lote `4096`, máximo 40 épocas y paciencia 10. El número de elementos de la lista indica las capas ocultas; cada valor indica sus neuronas.

#### A · g01 · Red más ancha

**YAML:** `g01_A_capas512-256-128-64.yaml`
**Cambio:** `[128, 64, 32, 16]` → **`[512, 256, 128, 64]`**. Conserva cuatro capas, con más neuronas. ¿La capacidad adicional mejora la validación y cuánto cuesta en tiempo?

#### B · g02 · Red más profunda

**YAML:** `g02_B_capas1024-1024-512-512-256-128-64-32.yaml`
**Cambio:** usar **`[1024, 1024, 512, 512, 256, 128, 64, 32]`**. Aumentan la profundidad y el número de parámetros; este escenario estudia la arquitectura completa, no aísla el efecto de añadir capas. ¿La mejora compensa el costo y el posible sobreajuste?

#### C · g03 · Red compacta

**YAML:** `g03_C_capas64-32-16-8.yaml`
**Cambio:** usar **`[64, 32, 16, 8]`**. Conserva cuatro capas con menos neuronas. ¿Se obtiene una clasificación comparable con menos parámetros?

#### D · g04 · Capas de anchura uniforme

**YAML:** `g04_D_capas128-128-128-128.yaml`
**Cambio:** usar **`[128, 128, 128, 128]`**. Conserva cuatro capas sin reducir su anchura. ¿Cómo cambia el aprendizaje frente a la arquitectura decreciente de referencia?

#### Selector para los escenarios A–D {#explorar-la-arquitectura-antes-de-modificar-el-yaml}

Elige la opción de tu escenario y deja dropout en **`0.1`**. Copia el bloque `model` al YAML correspondiente en JupyterLab y guarda con **Ctrl+S**. El selector no modifica el archivo de Yuca ni envía un entrenamiento.

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

### Escenarios E–H · Parámetros del entrenamiento

Conserva las capas **`[128, 64, 32, 16]`**. Cambia únicamente el parámetro indicado en tu escenario; no uses otra arquitectura del selector.

#### E · g05 · Regularización

**YAML:** `g05_E_dropout0p3.yaml`
**Cambio:** `model.dropout`: **`0.1` → `0.3`**. ¿Disminuye la diferencia entre entrenamiento y validación? Un dropout mayor también puede dificultar el aprendizaje.

#### F · g06 · Tasa de aprendizaje

**YAML:** `g06_F_lr0p0003.yaml`
**Cambio:** `training.learning_rate`: **`0.001` → `0.0003`**. ¿La convergencia es más estable o necesita más épocas? En el nombre del archivo se usa `p`; dentro del YAML escribe `0.0003`.

#### G · g07 · Tamaño de lote

**YAML:** `g07_G_batch8192.yaml`
**Cambio:** `training.batch_size`: **`4096` → `8192`**. ¿Cómo cambian el tiempo y la calidad de la clasificación? A igual número de épocas, un lote mayor implica menos actualizaciones de parámetros.

#### H · g08 · Duración máxima

**YAML:** `g08_H_epochs100.yaml`
**Cambio:** `training.epochs`: **`40` → `100`**, conservando paciencia **`10`**. ¿La red aprovecha las épocas adicionales? Si la parada temprana ya se activaba antes de 40, aumentar el máximo puede no cambiar el resultado.

## 2. Preparar y ejecutar la variación

El YAML permite elegir los cambios del modelo y la carpeta de salida; los scripts de ejecución se encuentran en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop).

Copiar el YAML de referencia y abrir la copia en JupyterLab:

```bash
cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/g01_A_capas512-256-128-64.yaml"
```

En el explorador lateral de **JupyterLab**, abre **hep-workshop → configs → g01_A_capas512-256-128-64.yaml**. Este es el archivo que vas a editar y enviar al entrenamiento; conserva `atlas_baseline01.yaml` como referencia.

En esa copia, modifica el campo del escenario asignado. Puedes conservar **`output.directory`**: las ejecuciones se separan automáticamente. Para el **escenario A**, cambia:

```yaml
model:
  hidden_dims: [512, 256, 128, 64]
  dropout: 0.1

output:
  directory: $HOME/hep-workshop/results/atlas_gpu_baseline01
```

Actualiza estos bloques dentro del YAML completo; conserva las secciones de datos, entrenamiento y evaluación. Para los escenarios B–H, aplica únicamente el cambio de su apartado.

**Guarda el archivo antes de enviar el trabajo.** La ejecución utilizará `g01_A_capas512-256-128-64.yaml` y creará la siguiente subcarpeta `run_XXXX` dentro de la ruta de salida. Allí se conserva también la configuración utilizada.

Conservar los demás parámetros, incluidas las particiones de datos y la semilla. Antes de enviar, anotar el cambio y el resultado esperado en la [bitácora](bitacora.md).

```bash
cd "$HOME/ML-integration-CMSSW"
sbatch --output="$HOME/hep-workshop/logs/atlas_%j.out" \
  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/g01_A_capas512-256-128-64.yaml"
```

Al terminar, abrir la subcarpeta **run_XXXX** indicada en el log y revisar `training_loss.png`, `roc_curve.png` y `classifier_scores.png` y `metrics.json`. Comparar las pérdidas y la curva ROC con las de la referencia.

Para los escenarios B–H, sustituye el nombre del ejemplo en **la copia, el editor y el comando de envío** por el de tu escenario. Puedes conservar la carpeta base de salida: cada envío crea su propio `run_XXXX`.

## 3. Registrar y visualizar resultados {#registro}

**Un responsable por grupo reúne y entrega los resultados:**

1. Completa **Grupo**, **Variación asignada**, **Corrida**, métricas, cambio realizado y conclusión. Registra primero la referencia y después cada ejecución de la variación con **Guardar fila**.
2. Completa la [bitácora](bitacora.md) con la misma variación, los YAML utilizados y las carpetas de resultados.
3. Pulsa **Descargar CSV del grupo**. El archivo `resultados_gNN.csv` contiene las filas guardadas de ese grupo, incluida la referencia.
4. En **JupyterLab**, abre la carpeta compartida de entregas que indique el instructor y utiliza **Upload Files** (flecha hacia arriba) para subir el CSV descargado. Sube también la bitácora `.md` para compartir la interpretación.
5. **El instructor** descarga los CSV de esa carpeta y los selecciona juntos en **Reunir tablas CSV**. La página reúne las filas y genera las gráficas comparativas para la discusión.

Guardar en la página conserva los datos en este navegador; **la entrega se completa al subir los archivos a Yuca**. La página no lee la carpeta compartida automáticamente.

Usa el mismo identificador de **Grupo** en la tabla y la bitácora, por ejemplo `g01`. En **Corrida**, escribe el nombre del YAML sin `.yaml`, seguido de `/run_XXXX`:

- Referencia: `atlas_baseline01/run_0001`.
- Variación A: `g01_A_capas512-256-128-64/run_0002`.

Los números son ejemplos: copia el `run_XXXX` real que aparece en el visor. Añade también tu usuario al nombre de corrida, por ejemplo `g01_A_capas512-256-128-64/docente_07/run_0002`, para distinguir ejecuciones de cuentas diferentes. En la bitácora registra también los nombres de ambos YAML y las rutas completas de resultados. Si repites el mismo YAML, conserva su nombre y registra el nuevo número de ejecución.

[Completar la bitácora del grupo](bitacora.md){ .md-button }

Introducir una fila de referencia y otra de variación por grupo. Se puede cargar el `metrics.json` de cada entrenamiento para completar los números y después identificar el grupo, el escenario y la configuración.

**Guardar fila** incorpora el registro a la tabla y actualiza las gráficas. Para corregir un registro, utilizar el mismo grupo y el mismo nombre de corrida y volver a guardarlo.

<div id="results-board">
<form id="result-form" class="result-form">
<label>Grupo<input name="group" required maxlength="60" placeholder="g01"></label>
<label>Corrida<input name="run" required maxlength="80" placeholder="g05_E_dropout0p3/run_0002"></label>
<label>Tipo<select name="kind"><option value="Referencia">Referencia</option><option value="Variación">Variación</option></select></label>
<label>Variación asignada<select name="scenario"><option>Referencia</option><option>A. Más ancha</option><option>B. Más profunda</option><option>C. Compacta</option><option>D. Uniforme</option><option>E. Dropout</option><option>F. Aprendizaje</option><option>G. Lote</option><option>H. Duración</option></select></label>
<label>Equipo<select name="device"><option>GPU MI210</option><option>CPU</option></select></label>
<label>AUC<input name="auc" type="number" min="0" max="1" step="any" required></label>
<label>AMS interna<input name="ams" type="number" min="0" step="any" required></label>
<label>Entrenamiento (s)<input name="seconds" type="number" min="0" step="any" required></label>
<label>Épocas ejecutadas<input name="epochs" type="number" min="1" step="1" required></label>
<label>Mejor época<input name="best" type="number" min="1" step="1" required></label>
<label class="result-wide">Cambio realizado<input name="change" required maxlength="240" placeholder="Sin cambios / dropout de 0.1 a 0.3"></label>
<label class="result-wide">Conclusión breve<input name="conclusion" maxlength="360" placeholder="Relacionar las métricas con las curvas de aprendizaje"></label>
<div class="result-wide"><button type="submit" class="md-button md-button--primary">Guardar fila</button></div>
</form>
<div class="result-controls">
<label class="md-button">Cargar metrics.json<input id="metrics-import" type="file" accept=".json,application/json"></label>
<button id="csv-export" type="button" class="md-button">Descargar CSV del grupo</button>
<label class="md-button">Reunir tablas CSV<input id="csv-import" type="file" accept=".csv,text/csv" multiple></label>
</div>
<p id="results-status" role="status" aria-live="polite"></p>
<div class="result-table-wrap"><table id="results-table"><thead><tr><th>Grupo / corrida</th><th>Escenario y cambio</th><th>Equipo</th><th>AUC</th><th>AMS interna</th><th>Tiempo (s)</th><th>Épocas / mejor</th><th>Δ AUC / Δ AMS</th><th>Conclusión</th><th>Acción</th></tr></thead><tbody></tbody></table></div>
<div id="result-charts" class="result-charts" aria-label="Comparación de las métricas registradas"></div>
</div>

## 4. Interpretar la comparación

1. ¿La modificación mejoró AUC y AMS interna simultáneamente? Identificar las diferencias respecto a la referencia del mismo grupo.
2. ¿La pérdida de validación respalda la mejora o muestra sobreajuste?
3. ¿Cuántas épocas se ejecutaron y cuál produjo el modelo conservado?
4. ¿El cambio justifica el tiempo de entrenamiento? Comparar tiempos solamente entre recursos y condiciones equivalentes; excluir la espera en cola.
5. ¿Qué repetirían para comprobar una diferencia pequeña antes de atribuirla a la arquitectura?

Las barras de AUC utilizan el intervalo completo de 0 a 1; las diferencias pequeñas se consultan en la tabla. La AMS corresponde a la validación interna del taller. Los resultados históricos del challenge utilizan una evaluación diferente: [método y benchmarks publicados](referencia.md#benchmarks-publicados-del-higgs-challenge).

[Anterior: benchmark](laboratorio.md){ .md-button }
[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
