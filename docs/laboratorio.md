# ATLAS · Benchmark de referencia

Reproduce la configuración inicial y revisa sus resultados antes de probar variaciones del YAML.

## 1. Red neuronal de referencia {#red-neuronal-de-referencia}

El benchmark del taller es una red completamente conectada de clasificación binaria. Esta configuración proporciona el punto de comparación para los ejercicios posteriores; no corresponde al modelo ganador del challenge.

![Arquitectura del benchmark: treinta entradas, cuatro capas ocultas de 128, 64, 32 y 16 neuronas, y una salida](assets/workshop/atlas_baseline_network.svg)

Las cuatro capas ocultas utilizan activación ReLU y dropout. La salida se transforma mediante una función sigmoide en una puntuación entre cero y uno; los valores altos favorecen la clasificación como señal.

| Parámetro | Configuración de referencia |
| --- | --- |
| Variables de entrada | Las 30 variables físicas |
| Capas ocultas | `[128, 64, 32, 16]` |
| Dropout | `0.1` |
| Optimizador | AdamW |
| Tasa de aprendizaje | `0.001` |
| Tamaño de lote | `4096` eventos |
| Máximo de épocas | `100` |
| Parada temprana | `20` épocas sin mejora de la pérdida de validación |
| Entrenamiento / validación | 200 000 / 50 000 eventos, de la partición `t` |

Los valores ausentes se sustituyen por medianas y las variables se estandarizan. Ambas transformaciones se ajustan únicamente con los eventos de entrenamiento. El modelo conservado es el de menor pérdida de validación.

## 2. Reproducir el entrenamiento de referencia

Antes de empezar, completa [ATLAS · Preparar el entorno](atlas-preparacion.md): clona el repositorio, instala el ambiente una sola vez y actívalo. Después ejecutaremos todos la misma configuración; los datos están compartidos en Yuca y cada cuenta guarda sus resultados.

!!! info "Preparar el YAML de referencia"
    Con el acceso y el ambiente GPU ya preparados, ejecutar desde la terminal:

    ```bash
    cd "$HOME/ML-integration-CMSSW"
    git pull --ff-only origin opendata_dev
    mkdir -p "$HOME/hep-workshop/configs" "$HOME/hep-workshop/logs"
    cp -n workshop/configs/atlas_higgs_gpu.yaml "$HOME/hep-workshop/configs/atlas_baseline01.yaml"
    ```

    `git pull` descarga las actualizaciones disponibles; si no hay cambios muestra `Already up to date.`. `cp -n` conserva tu YAML si ya existe: revisa los valores indicados abajo.

    Si falta configurar el ambiente, completar la [preparación inicial](atlas-preparacion.md). Para generar las comparaciones de las treinta variables, sigue el [apoyo de visualización](apoyo.md#3-mira-las-variables-antes-de-entrenar).

### Abrir y revisar el YAML en JupyterLab

1. En el **explorador de archivos de la izquierda**, vuelve a tu carpeta personal y abre **hep-workshop → configs**.
2. Haz doble clic en **atlas_baseline01.yaml** para abrirlo en el editor. Si no se abre como texto, haz clic derecho y selecciona **Open With → Editor**.
3. Revisa `model` (capas y dropout) y `training` (épocas, tamaño de lote y tasa de aprendizaje). Para reproducir la referencia, conserva los valores de la copia inicial.
4. Comprueba que `output.directory` y `output.run_name` coincidan con el bloque siguiente. En una copia existente, ajusta también `training.epochs: 100` y `training.patience: 20`. Si necesitas corregirla, edita el valor **después de los dos puntos**, conservando la sangría, y guarda con **Ctrl+S**.

![JupyterLab: explorador izquierdo en hep-workshop/configs y atlas_baseline01.yaml abierto en el editor](assets/workshop/atlas_baseline_yaml_jupyterlab.png)

La captura ilustra dónde editar el YAML; utiliza los valores actuales de esta página: **100 épocas y paciencia 20**.

Puedes conservar `output.directory` al repetir el entrenamiento. Con `output.run_name: atlas_referencia`, cada envío crea una subcarpeta nueva: `atlas_referencia_0001`, `atlas_referencia_0002`, etc., sin sobrescribir las anteriores.

```yaml
output:
  run_name: atlas_referencia
  directory: $HOME/hep-workshop/results/atlas_gpu_baseline01
```

### Enviar el benchmark

Guarda el YAML con **Ctrl+S**. En la terminal de JupyterLab, desde la raíz del repositorio, envía el trabajo:

El script del benchmark solicita **una GPU, cuatro CPU, 16 GB de memoria y hasta 30 minutos**, con el proyecto `curso07` y la QOS `qoscurso07`. Comprueba que tu cuenta tiene acceso a ese proyecto antes de enviarlo.

```bash
JOB_ID=$(sbatch --parsable --output="$HOME/hep-workshop/logs/atlas_%j.out" \
  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/atlas_baseline01.yaml")
echo "Trabajo enviado: $JOB_ID"
```

### Seguir el entrenamiento en la terminal

Después de enviar el trabajo, ejecuta en la misma terminal:

```bash
python workshop/monitor_atlas.py \
  -f "$HOME/hep-workshop/configs/atlas_baseline01.yaml" \
  --job-id "$JOB_ID" \
  --log "$HOME/hep-workshop/logs/atlas_${JOB_ID}.out"
```

El visor muestra el **estado de Slurm**, una **barra de épocas**, las pérdidas y el AUC de validación. La gráfica de la terminal compara las pérdidas en una misma escala: **T** para entrenamiento y **V** para validación. Se actualiza con los valores reales de cada época completada.

Antes de la primera época, indica si el trabajo está en cola o activo y muestra las últimas líneas del log. Si el trabajo falla, muestra el estado y el registro para identificar el problema.

Durante el entrenamiento, el visor muestra el avance y las pérdidas, como en esta captura:

![Monitor ATLAS con épocas, pérdidas de entrenamiento y validación, AUC y gráfica de evolución en la terminal](assets/benchmarks/atlas_training_monitor.png){ .benchmark-monitor }

La imagen corresponde a una corrida anterior de **40 épocas**; la configuración actual permite hasta **100**, con paciencia **20**. El número del trabajo y la ruta de resultados serán los de tu ejecución.

Deja el visor abierto: después de la primera época aparecerán las pérdidas, el AUC y la gráfica. **Resultados** indica la carpeta exacta de esa corrida.

**Qué observar:** ¿disminuyen ambas pérdidas? ¿La validación deja de mejorar mientras entrenamiento sigue bajando? Al finalizar, el visor muestra la época del modelo conservado y la AMS interna. La parada temprana puede terminar antes de que la barra alcance el máximo.

Si el trabajo aún está en cola o prepara los datos, aparecerá un mensaje de espera. **Ctrl+C cierra solamente el visor**; el trabajo continúa en Slurm. Puedes volver a abrirlo con el mismo comando, incluso cuando la corrida haya terminado. Si abriste una nueva terminal, sustituye `${JOB_ID}` por el número del trabajo que se mostró al enviarlo.

Si el visor se cierra sin mostrar resultados finales o el avance se detiene, comprueba el estado con los comandos siguientes y revisa el log. Para consultar una sola captura del visor, añade `--once`. [Apoyo operativo](apoyo.md).

### Comprobar el estado del trabajo

```bash
squeue -u "$USER"
sacct -j "$JOB_ID" --format=JobID,State,ExitCode,Elapsed -X
```

En la cola, **PD** indica que espera recursos y **R** que está ejecutándose. Al terminar, `COMPLETED` con código `0:0` indica que finalizó sin error. No envíes otra copia mientras la primera espera. Si necesitas detener esa ejecución, utiliza `scancel "$JOB_ID"`. En una nueva terminal, sustituye `$JOB_ID` por el número recibido al enviar el trabajo.


## 3. Revisar los resultados del entrenamiento

En el explorador izquierdo de JupyterLab, abre la carpeta **Resultados** indicada por el visor, por ejemplo **hep-workshop → results → atlas_gpu_baseline01 → atlas_referencia_0001**. Cada corrida conserva los siguientes productos:

| Archivo | Información que recuperas |
| --- | --- |
| `training_loss.png` | Evolución del aprendizaje y comparación entre entrenamiento y validación. |
| `classifier_scores.png` | Distribuciones de la puntuación para señal y fondo. |
| `roc_curve.png` | Eficiencia de señal frente a aceptación de fondo al variar el umbral. |
| `metrics.json` | Indicadores numéricos de calidad, tiempo, tamaño de la red y condiciones de ejecución. |
| `config.yaml` | Copia de la configuración utilizada, para identificar y reproducir la corrida. |
| `history.csv` / `validation_scores.csv` | Valores por época y puntuaciones de validación que permiten volver a analizar los resultados. |

Las tres figuras se guardan también en **PDF y SVG**. Abre los PNG y `metrics.json` con doble clic en JupyterLab. Las imágenes siguientes corresponden a una ejecución anterior de 40 épocas. La configuración actual permite hasta 100 épocas con paciencia 20; las imágenes sirven para explicar los resultados, no como cifras esperadas de la nueva configuración.

### Pérdidas y aprendizaje

En **`training_loss.png`**, observa las dos curvas:

- **Pérdida de entrenamiento:** el error que la red intenta reducir al aprender.
- **Pérdida de validación:** el error sobre eventos que no se utilizan para ajustar sus parámetros. Es la curva que usamos para elegir el modelo.
- **Mejor época (`best_epoch`):** la época con menor pérdida de validación; su modelo queda guardado. **Épocas ejecutadas (`epochs_run`)** indica cuántas se completaron en total.

![Pérdidas de entrenamiento y validación del benchmark; mejor época 40](assets/benchmarks/atlas_reference_loss.png){ .benchmark-plot }

En este ejemplo ambas pérdidas siguen disminuyendo y el modelo conservado corresponde a la época 40. La validación puede quedar por debajo del entrenamiento porque dropout está activo al entrenar y se desactiva al evaluar; esa diferencia por sí sola no indica un problema.

Si la pérdida de entrenamiento baja pero la de validación sube, puede haber **sobreajuste**. El máximo es 100 épocas; tras 20 épocas consecutivas sin mejorar la pérdida de validación, el entrenamiento se detiene.

### Separación entre señal y fondo {#leer-una-roc-como-fisico}

En **`classifier_scores.png`**, la puntuación va de 0 a 1: los valores altos favorecen señal. Observa cuánto se solapan las distribuciones de Higgs y fondo. Al exigir una puntuación mínima, seleccionas parte de ambas muestras.

![Puntuación del clasificador: fondo hacia cero y señal hacia uno, con solapamiento](assets/benchmarks/atlas_reference_scores.png){ .benchmark-plot }

Las distribuciones están normalizadas por clase: sus alturas comparan las formas, no la cantidad total de señal y fondo.

En **`roc_curve.png`**, cada punto corresponde a un umbral distinto. El eje horizontal muestra la fracción de fondo aceptado y el vertical la fracción de señal conservada. Una curva más arriba conserva más señal para el mismo fondo; una más a la izquierda acepta menos fondo para la misma señal.

![Curva ROC del benchmark con AUC de aproximadamente 0.9122](assets/benchmarks/atlas_reference_roc.png){ .benchmark-plot }

En el ejemplo, **AUC ≈ 0.9122**. La diagonal representa una clasificación aleatoria; interesa especialmente conservar señal con poca aceptación de fondo.

### Indicadores que debes registrar {#comparar-benchmark}

En **`metrics.json`** encontrarás los valores exactos que acompañan a las figuras:

![Archivo metrics.json de la ejecución de referencia con métricas, tiempos y configuración del equipo](assets/benchmarks/atlas_reference_metrics.png){ .benchmark-metrics }

En esta corrida se obtuvieron **AUC ≈ 0.9122**, **AMS interna ≈ 3.5713**, **49.36 segundos** de entrenamiento y **14 849 parámetros**; se ejecutaron 40 épocas y la mejor fue la 40. Son un ejemplo de lectura, no valores que deban coincidir exactamente con tu ejecución.

Para interpretar tus resultados, revisa estos campos:

| Indicador · campo del archivo | Qué significa y cómo compararlo |
| --- | --- |
| **AUC** · `roc_auc_unweighted` | Resume la separación en toda la ROC: 0.5 corresponde a una clasificación aleatoria y 1 a una separación perfecta. Un valor mayor indica mejor separación global, pero no garantiza mejor selección en la región de bajo fondo. |
| **AMS interna** · `ams_validation_tuned` | Sensibilidad aproximada de una selección, calculada con los rendimientos ponderados de señal y fondo. Mayor es mejor bajo las mismas condiciones de evaluación. No es una significancia observada. |
| **Umbral** · `threshold` | Puntuación mínima elegida para maximizar la AMS en validación. Determina qué eventos se aceptan; un umbral mayor no implica por sí solo una mejora. |
| **Eficiencia de señal** · `signal_efficiency` | Fracción de eventos de señal que supera ese umbral. Multiplica por 100 para expresarla como porcentaje. |
| **Aceptación de fondo** · `background_acceptance` | Fracción de eventos de fondo que supera el mismo umbral. Busca reducirla conservando señal. Estas dos fracciones son conteos sin pesos; la AMS sí utiliza pesos. |
| **Mejor época / épocas ejecutadas** · `best_epoch` / `epochs_run` | Cuándo se obtuvo el modelo conservado y cuánto duró el aprendizaje. Más épocas no garantizan mejor validación. |
| **Parámetros** · `parameters` | Número de valores ajustables de la red. Permite valorar si una mejora requiere una arquitectura mucho mayor. |
| **Tiempo de entrenamiento** · `fit_seconds` | Segundos del entrenamiento, sin incluir la espera en cola. Permite valorar el costo de una mejora y comparar CPU/GPU con la misma configuración. |

El archivo también permite comprobar **200 000 eventos de entrenamiento**, **50 000 de validación**, las **30 variables**, la semilla (`seed`) y la GPU utilizada. `batches_per_epoch`, `mean_epoch_seconds` y `gpu_peak_allocated_mb` describen el trabajo por época, su tiempo medio y la memoria GPU máxima asignada. Úsalos para entender diferencias de coste entre escenarios; la bitácora reúne los seis indicadores principales.

### Qué significa una mejora {#interpretar-ams}

**AUC y AMS responden a preguntas distintas:** la AUC resume todos los umbrales; la AMS evalúa una selección concreta y sus rendimientos ponderados. Por eso pueden cambiar en sentidos diferentes.

<span id="significado-fisico"></span>
Una mejor separación puede ayudar a medir una señal con menor incertidumbre o aumentar la sensibilidad a procesos poco frecuentes. La conclusión física requiere también datos observados, normalizaciones e incertidumbres: **una AMS mayor no equivale a un descubrimiento**.

[Anterior: procesos y variables](fisica.md){ .md-button }
[Continuar: variaciones y resultados](variaciones.md){ .md-button .md-button--primary }
