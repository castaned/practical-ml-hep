# Variaciones del benchmark

Esta actividad corresponde a la **última hora del miércoles**. Utilizar el YAML `atlas_baseline01.yaml` y los resultados de `atlas_gpu_baseline01` obtenidos en el [benchmark](laboratorio.md).

Antes de preparar cambios, completar la [comparación del benchmark](laboratorio.md#comparar-benchmark), revisar `training_summary.png` y registrar la corrida como **Referencia** en la [tabla](#registro). Las variaciones se compararán con esa ejecución personal, realizada con los mismos datos y particiones.

| Tiempo | Actividad |
| --- | --- |
| 0–10 min | Asignar el escenario por mesa o grupo, formular la hipótesis y preparar el YAML |
| 10–30 min | Ejecutar una variación y examinar las pérdidas y la curva ROC |
| 30–45 min | Registrar las métricas y comparar con la referencia; repetir únicamente si es necesario |
| 45–60 min | Reunir las tablas, visualizar los resultados y discutir las conclusiones |

## 1. Escenarios por grupo

Los participantes podrán organizarse por mesas o filas. Todos ejecutarán la misma referencia; cada grupo estudiará inicialmente uno de los siguientes factores. Si varias mesas comparten escenario, podrán contrastar la reproducibilidad de sus resultados.

| Escenario | Modificación en el YAML | Pregunta de análisis |
| --- | --- | --- |
| A. Arquitectura | Cambiar `model.hidden_dims`, por ejemplo a `[512, 256, 128, 64]` | ¿La capacidad adicional mejora la validación y cuánto aumenta el tiempo? |
| B. Regularización | Cambiar `model.dropout` de `0.1` a `0.3` | ¿Se reduce la diferencia entre entrenamiento y validación? |
| C. Optimización | Reducir `training.learning_rate`, por ejemplo de `0.001` a `0.0003` | ¿Cambia la convergencia con el mismo límite de épocas? |
| D. Duración | Aumentar `training.epochs` a `100` y fijar `training.patience` en `10` | ¿En qué época se alcanza la menor pérdida de validación y cuándo se detiene? |

Conservar los demás parámetros, las variables y las particiones de datos. Cada modificación requiere un YAML y una carpeta de salida propios. Los valores iniciales deben comprobarse en el archivo de referencia antes de registrar el cambio.

### Explorar la arquitectura antes de modificar el YAML

<div class="network-explorer" data-network-explorer>
<div class="explorer-intro">
<span class="eyebrow">ARQUITECTURAS DE REFERENCIA</span>
<h3>Capas y parámetros entrenables</h3>
<p>Elige una arquitectura para explorar sus capas, parámetros y configuración YAML.</p>
<label for="network-choice">Arquitectura</label>
<select id="network-choice">
<option value="baseline">Referencia · cuatro capas</option>
<option value="wide">Más ancha · cuatro capas</option>
<option value="deep">Más profunda · ocho capas</option>
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
<p id="copy-status" role="status">Conserva el resto de tu YAML y elige una carpeta nueva para cada corrida.</p>
</div>
</div>

## 2. Preparar y ejecutar la variación

El YAML permite elegir los cambios del modelo y la carpeta de salida; los scripts de ejecución se encuentran en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop).

Copiar el YAML de referencia y abrir la copia en JupyterLab:

```bash
cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/atlas_02.yaml"
```

En el explorador lateral de **JupyterLab**, abre **hep-workshop → configs → atlas_02.yaml**. Este es el archivo que vas a editar y enviar al entrenamiento; conserva `atlas_baseline01.yaml` como referencia.

En esa copia, modifica el campo del escenario asignado y cambia también **`output.directory`**. Por ejemplo, para el **escenario A**, los bloques correspondientes deben quedar así:

```yaml
model:
  hidden_dims: [512, 256, 128, 64]
  dropout: 0.1

output:
  directory: $HOME/hep-workshop/results/atlas_02
```

Actualiza estos bloques dentro del YAML completo; conserva las secciones de datos, entrenamiento y evaluación. Para los escenarios B, C o D, aplica únicamente los cambios de su fila en la tabla anterior, además de la nueva carpeta de salida.

**Guarda el archivo antes de enviar el trabajo.** La ejecución siguiente utilizará `atlas_02.yaml` y guardará sus resultados en `hep-workshop/results/atlas_02/`, separados de `atlas_gpu_baseline01/`.

Conservar los demás parámetros, incluidas las particiones de datos y la semilla. Antes de enviar, anotar el cambio y el resultado esperado en la [bitácora](bitacora.md).

```bash
cd "$HOME/ML-integration-CMSSW"
sbatch --output="$HOME/hep-workshop/logs/atlas_%j.out" \
  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/atlas_02.yaml"
```

Al terminar, abrir **hep-workshop → results → atlas_02** y revisar `training_summary.png` y `metrics.json`. Comparar las pérdidas y la curva ROC con las de la referencia.

Para otra variación, utiliza otro nombre de YAML y otra carpeta, por ejemplo `atlas_03.yaml` y `results/atlas_03`. El entrenamiento rechaza una carpeta de salida que ya existe para evitar sobrescribir resultados anteriores.

## 3. Registrar y visualizar resultados {#registro}

Registra las métricas en la tabla y la hipótesis e interpretación en la **bitácora**, utilizando el mismo nombre de grupo.

[Completar la bitácora del grupo](bitacora.md){ .md-button }

Introducir una fila de referencia y otra de variación por grupo. Se puede cargar el `metrics.json` de cada entrenamiento para completar los números y después identificar el grupo, el escenario y la configuración.

**Guardar fila** incorpora el registro a la tabla y actualiza las gráficas. Para corregir un registro, utilizar el mismo grupo y el mismo nombre de corrida y volver a guardarlo.

<div id="results-board">
<form id="result-form" class="result-form">
<label>Grupo<input name="group" required maxlength="60" placeholder="Mesa 1"></label>
<label>Corrida<input name="run" required maxlength="80" placeholder="referencia o dropout_03"></label>
<label>Tipo<select name="kind"><option value="Referencia">Referencia</option><option value="Variación">Variación</option></select></label>
<label>Escenario<select name="scenario"><option>Referencia</option><option>A. Arquitectura</option><option>B. Regularización</option><option>C. Optimización</option><option>D. Duración</option></select></label>
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
<button id="csv-export" type="button" class="md-button">Descargar tabla CSV</button>
<label class="md-button">Reunir tablas CSV<input id="csv-import" type="file" accept=".csv,text/csv" multiple></label>
</div>
<p id="results-status" role="status" aria-live="polite"></p>
<div class="result-table-wrap"><table id="results-table"><thead><tr><th>Grupo / corrida</th><th>Escenario y cambio</th><th>Equipo</th><th>AUC</th><th>AMS interna</th><th>Tiempo (s)</th><th>Épocas / mejor</th><th>Δ AUC / Δ AMS</th><th>Conclusión</th><th>Acción</th></tr></thead><tbody></tbody></table></div>
<div id="result-charts" class="result-charts" aria-label="Comparación de las métricas registradas"></div>
</div>

Los registros se conservan en este navegador. **No se sincronizan automáticamente entre computadoras.** Cada grupo descargará su tabla CSV y la entregará en la carpeta compartida indicada en clase. Para la discusión colectiva, utilizar **Reunir tablas CSV** con los archivos de los grupos; las filas se mostrarán juntas en la tabla y en las gráficas de esta página. El CSV conserva también el cambio realizado y la conclusión.

## 4. Interpretar la comparación

1. ¿La modificación mejoró AUC y AMS interna simultáneamente? Identificar las diferencias respecto a la referencia del mismo grupo.
2. ¿La pérdida de validación respalda la mejora o muestra sobreajuste?
3. ¿Cuántas épocas se ejecutaron y cuál produjo el modelo conservado?
4. ¿El cambio justifica el tiempo de entrenamiento? Comparar tiempos solamente entre recursos y condiciones equivalentes; excluir la espera en cola.
5. ¿Qué repetirían para comprobar una diferencia pequeña antes de atribuirla a la arquitectura?

Las barras de AUC utilizan el intervalo completo de 0 a 1; las diferencias pequeñas se consultan en la tabla. La AMS corresponde a la validación interna del taller. Los resultados históricos del challenge utilizan una evaluación diferente: [método y benchmarks publicados](referencia.md#benchmarks-publicados-del-higgs-challenge).

[Anterior: benchmark](laboratorio.md){ .md-button }
[Continuar: conclusiones](conclusiones.md){ .md-button .md-button--primary }
