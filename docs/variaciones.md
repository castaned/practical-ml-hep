# Variaciones del benchmark

Esta actividad corresponde a la **última hora del miércoles**. Comenzar con el entrenamiento de referencia completado y sus resultados registrados.

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

## 2. Preparar y ejecutar la variación

Copiar el YAML de referencia y abrir la copia en JupyterLab:

```bash
cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/atlas_02.yaml"
```

Modificar los campos del escenario asignado y definir una carpeta nueva dentro del mismo YAML:

```yaml
output:
  directory: $HOME/hep-workshop/results/atlas_02
```

Conservar los demás parámetros, incluidas las particiones de datos y la semilla. Antes de enviar, anotar el cambio y el resultado esperado en la [bitácora](bitacora.md).

```bash
sbatch --output="$HOME/hep-workshop/logs/atlas_%j.out" \
  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/atlas_02.yaml"
```

Al terminar, abrir `training_summary.png` y `metrics.json` de la carpeta nueva. Comparar las pérdidas y la curva ROC con las de la referencia.

## 3. Registrar y visualizar resultados {#registro}

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

[Presentación de conclusiones](conclusiones.md) · [Volver al benchmark](laboratorio.md)
