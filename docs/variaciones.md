# Variaciones del benchmark

Parte del benchmark y cambia **solo el parámetro de tu escenario**. Después registra sus indicadores en la [bitácora](bitacora.md). La comparación se hará con los CSV reunidos de las ejecuciones.

## 1. Elige la variación asignada {#1-escenarios-por-grupo}

Cada escenario puede asignarse a unas diez personas. Al menos dos estudiantes o parejas ejecutan la referencia y la variación en sus cuentas; los demás apoyan en la revisión de las figuras.

### Escenarios A–D · Arquitectura de la red

En estos cuatro escenarios cambia **solo `model.hidden_dims`**. Conserva dropout `0.1`, aprendizaje `0.001`, lote `4096`, máximo 40 épocas y paciencia 10. El número de elementos de la lista indica las capas ocultas; cada valor indica sus neuronas.

#### A · Red más ancha

**YAML:** `atlas_A_capas512-256-128-64.yaml`
**Cambio:** `[128, 64, 32, 16]` → **`[512, 256, 128, 64]`**. Conserva cuatro capas, con más neuronas. ¿La capacidad adicional mejora la validación y cuánto cuesta en tiempo?

#### B · Red más profunda

**YAML:** `atlas_B_capas1024-1024-512-512-256-128-64-32.yaml`
**Cambio:** usar **`[1024, 1024, 512, 512, 256, 128, 64, 32]`**. Aumentan la profundidad y el número de parámetros; este escenario estudia la arquitectura completa, no aísla el efecto de añadir capas. ¿La mejora compensa el costo y el posible sobreajuste?

#### C · Red compacta

**YAML:** `atlas_C_capas64-32-16-8.yaml`
**Cambio:** usar **`[64, 32, 16, 8]`**. Conserva cuatro capas con menos neuronas. ¿Se obtiene una clasificación comparable con menos parámetros?

#### D · Capas de anchura uniforme

**YAML:** `atlas_D_capas128-128-128-128.yaml`
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

#### E · Regularización

**YAML:** `atlas_E_dropout0p3.yaml`
**Cambio:** `model.dropout`: **`0.1` → `0.3`**. ¿Disminuye la diferencia entre entrenamiento y validación? Un dropout mayor también puede dificultar el aprendizaje.

#### F · Tasa de aprendizaje

**YAML:** `atlas_F_lr0p0003.yaml`
**Cambio:** `training.learning_rate`: **`0.001` → `0.0003`**. ¿La convergencia es más estable o necesita más épocas? En el nombre del archivo se usa `p`; dentro del YAML escribe `0.0003`.

#### G · Tamaño de lote

**YAML:** `atlas_G_batch8192.yaml`
**Cambio:** `training.batch_size`: **`4096` → `8192`**. ¿Cómo cambian el tiempo y la calidad de la clasificación? A igual número de épocas, un lote mayor implica menos actualizaciones de parámetros.

#### H · Duración máxima

**YAML:** `atlas_H_epochs100.yaml`
**Cambio:** `training.epochs`: **`40` → `100`**, conservando paciencia **`10`**. ¿La red aprovecha las épocas adicionales? Si la parada temprana ya se activaba antes de 40, aumentar el máximo puede no cambiar el resultado.

## 2. Preparar y ejecutar la variación

El YAML permite elegir los cambios del modelo y la carpeta de salida; los scripts de ejecución se encuentran en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop).

Copiar el YAML de referencia y abrir la copia en JupyterLab:

```bash
cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/atlas_A_capas512-256-128-64.yaml"
```

En el explorador lateral de **JupyterLab**, abre **hep-workshop → configs → atlas_A_capas512-256-128-64.yaml**. Este es el archivo que vas a editar y enviar al entrenamiento; conserva `atlas_baseline01.yaml` como referencia.

En esa copia, modifica el campo del escenario asignado. Puedes conservar **`output.directory`**: las ejecuciones se separan automáticamente. Para el **escenario A**, cambia:

```yaml
model:
  hidden_dims: [512, 256, 128, 64]
  dropout: 0.1

output:
  directory: $HOME/hep-workshop/results/atlas_gpu_baseline01
```

Actualiza estos bloques dentro del YAML completo; conserva las secciones de datos, entrenamiento y evaluación. Para los escenarios B–H, aplica únicamente el cambio de su apartado.

**Guarda el archivo antes de enviar el trabajo.** La ejecución utilizará `atlas_A_capas512-256-128-64.yaml` y creará la siguiente subcarpeta `run_XXXX` dentro de la ruta de salida. Allí se conserva también la configuración utilizada.

Después de ejecutar, registra los indicadores en la [bitácora](bitacora.md).

```bash
cd "$HOME/ML-integration-CMSSW"
sbatch --output="$HOME/hep-workshop/logs/atlas_%j.out" \
  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/atlas_A_capas512-256-128-64.yaml"
```

Al terminar, abrir la subcarpeta **run_XXXX** indicada en el log y revisar `training_loss.png`, `roc_curve.png` y `classifier_scores.png` y `metrics.json`. Comparar las pérdidas y la curva ROC con las de la referencia.

Para los escenarios B–H, sustituye el nombre del ejemplo en **la copia, el editor y el comando de envío** por el de tu escenario. Puedes conservar la carpeta base de salida: cada envío crea su propio `run_XXXX`.

## 3. Bitácora y entrega

1. Abre la [bitácora de resultados](bitacora.md), selecciona la variación y carga el `metrics.json` de la corrida.
2. Comprueba los cinco indicadores y descarga su **registro CSV**. Registra también el benchmark como **Referencia** en otro CSV.
3. El responsable sube los CSV a la carpeta compartida indicada en clase, usando **Upload Files** en JupyterLab.

[Registrar indicadores](bitacora.md){ .md-button .md-button--primary }

## 4. Tabla de resumen {#registro}

El instructor descarga los CSV de la carpeta compartida y los selecciona juntos con **Reunir registros CSV**. La tabla se genera automáticamente; cada fila corresponde a una ejecución, sin promediar ni ocultar las repeticiones.

<div id="simple-summary">
<label class="md-button">Reunir registros CSV<input id="simple-import" type="file" accept=".csv,text/csv" multiple></label>
<button id="simple-clear" class="md-button" type="button">Vaciar resumen</button>
<p id="simple-summary-status" role="status">Selecciona los CSV para mostrar la comparación.</p>
<div class="result-table-wrap"><table><thead><tr><th>Variación</th><th>AUC</th><th>AMS interna</th><th>Tiempo (s)</th><th>Épocas</th><th>Mejor época</th><th>Registro</th></tr></thead><tbody></tbody></table></div>
</div>

### Discusión de la tabla

- ¿Qué variaciones mejoran AUC y AMS respecto a la referencia?
- ¿La mejora compensa el tiempo de entrenamiento?
- ¿Las repeticiones de la misma variación dan resultados parecidos?
- ¿Las curvas de pérdidas muestran sobreajuste?

Compara tiempos obtenidos en equipos y condiciones equivalentes. La AMS es una medida de sensibilidad interna en simulación, no una significancia observada.

[Anterior: benchmark](laboratorio.md){ .md-button }
[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
