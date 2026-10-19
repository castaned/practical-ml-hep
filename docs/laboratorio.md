# ATLAS · Benchmark de referencia

Reproduce la configuración inicial y revisa sus resultados antes de probar variaciones del YAML.

## 1. Procesos y variables de entrada

En el menú izquierdo del taller, abre **ATLAS → Procesos y variables**. Allí encontrarás los diagramas del Higgs, las treinta variables y sus distribuciones. Revisa ese contenido en el navegador y después regresa a **Benchmark** para continuar.

[Revisar procesos y variables](fisica.md){ .md-button }

## 2. Red neuronal de referencia {#red-neuronal-de-referencia}

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
| Máximo de épocas | `40` |
| Parada temprana | `10` épocas sin mejora de la pérdida de validación |
| Entrenamiento / validación | 200 000 / 50 000 eventos, de la partición `t` |

Los valores ausentes se sustituyen por medianas y las variables se estandarizan. Ambas transformaciones se ajustan únicamente con los eventos de entrenamiento. El modelo conservado es el de menor pérdida de validación.

## 3. Reproducir el entrenamiento de referencia

Primero ejecutaremos todos la misma configuración. Los datos ya están compartidos en Yuca y cada cuenta guarda sus propios resultados.

!!! info "Preparar el YAML de referencia"
    Con el acceso y el ambiente GPU ya preparados, ejecutar desde la terminal:

    ```bash
    cd "$HOME/ML-integration-CMSSW"
    git pull --ff-only origin opendata_dev
    mkdir -p "$HOME/hep-workshop/configs" "$HOME/hep-workshop/logs"
    cp -n workshop/configs/atlas_higgs_gpu.yaml "$HOME/hep-workshop/configs/atlas_baseline01.yaml"
    ```

    Si falta configurar el ambiente, completar la [preparación inicial](preparacion.md#3-clonacion-y-preparacion-del-entorno-de-analisis). Para generar las comparaciones de las treinta variables, sigue el [apoyo de visualización](apoyo.md#3-mira-las-variables-antes-de-entrenar).

Si ya tenías una copia personal del YAML, actualiza `training.epochs` a `40` y `training.patience` a `10`; `cp -n` conserva los archivos existentes.

### Abrir y revisar el YAML en JupyterLab

1. En el **explorador de archivos de la izquierda**, vuelve a tu carpeta personal y abre **hep-workshop → configs**.
2. Haz doble clic en **atlas_baseline01.yaml** para abrirlo en el editor. Si no se abre como texto, haz clic derecho y selecciona **Open With → Editor**.
3. Revisa `model` (capas y dropout) y `training` (épocas, tamaño de lote y tasa de aprendizaje). Para reproducir la referencia, conserva los valores de la copia inicial.
4. Comprueba que `output.directory` coincida con la ruta siguiente. Si necesitas corregirla, edita el valor **después de los dos puntos**, conservando la sangría, y guarda con **Ctrl+S**.

![Contenido del YAML de referencia y ubicación en la carpeta configs](assets/workshop/atlas_baseline_yaml.png)

Puedes conservar `output.directory` al repetir el entrenamiento. Cada envío crea una subcarpeta nueva: `run_0001`, `run_0002`, etc., sin sobrescribir las anteriores.

```yaml
output:
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

Al comenzar, verás un mensaje como este:

```text
Slurm: EN EJECUCIÓN | amdgpu-hpc-01
[------------------------------] Sin épocas registradas / máximo 40
Trabajo activo; aún no se ha completado la primera época.
Resultados: /lustre/home/TU_USUARIO/hep-workshop/results/atlas_gpu_baseline01/run_0001
```

Deja el visor abierto: después de la primera época aparecerán las pérdidas, el AUC y la gráfica. **Resultados** indica la carpeta de esta ejecución.

**Qué observar:** ¿disminuyen ambas pérdidas? ¿La validación deja de mejorar mientras entrenamiento sigue bajando? Al finalizar, el visor muestra la época del modelo conservado y la AMS interna. La parada temprana puede terminar antes de que la barra alcance el máximo.

Si el trabajo aún está en cola o prepara los datos, aparecerá un mensaje de espera. **Ctrl+C cierra solamente el visor**; el trabajo continúa en Slurm. Puedes volver a abrirlo con el mismo comando, incluso cuando la corrida haya terminado. Si abriste una nueva terminal, sustituye `${JOB_ID}` por el número del trabajo que se mostró al enviarlo.

Si el visor se cierra sin mostrar resultados finales o el avance se detiene, comprueba el estado con los comandos siguientes y revisa el log. Para consultar una sola captura del visor, añade `--once`. [Apoyo operativo](apoyo.md).

### Comprobar el estado del trabajo

```bash
squeue -u "$USER"
sacct -j "$JOB_ID" --format=JobID,State,ExitCode,Elapsed -X
```

En la cola, **PD** indica que espera recursos y **R** que está ejecutándose. Al terminar, `COMPLETED` con código `0:0` indica que finalizó sin error. No envíes otra copia mientras la primera espera. Si necesitas detener esa ejecución, utiliza `scancel "$JOB_ID"`. En una nueva terminal, sustituye `$JOB_ID` por el número recibido al enviar el trabajo.


## 4. Localizar y revisar los resultados

En el explorador de archivos de JupyterLab, abrir **hep-workshop → results → atlas_gpu_baseline01 → run_0001** (o el número de la ejecución). El visor y el log muestran la ruta exacta. Dentro encontrarás una copia del YAML y los resultados de esa corrida.

Para repetir el benchmark, envía de nuevo el mismo YAML: se creará `run_0002`, después `run_0003`, y así sucesivamente. **No cambies ni borres las carpetas anteriores.** Identifica la corrida por la ruta que muestra el visor.

| Archivo | Contenido y uso |
| --- | --- |
| `config.yaml` | Configuración utilizada en esta ejecución |
| `training_loss.png` | Pérdidas de entrenamiento y validación por época |
| `roc_curve.png` | Curva ROC y AUC de validación |
| `classifier_scores.png` | Puntuación del clasificador para señal y fondo |
| `metrics.json` | AUC, AMS interna, tiempo, mejor época y épocas ejecutadas |
| `history.csv` | Evolución del entrenamiento por época |
| `best_model.pt` | Modelo conservado según la pérdida de validación |
| `validation_scores.csv` | Puntuaciones de los eventos de validación |
| `splits.csv` | Identificación de los eventos de cada partición |
| `preprocessing.joblib` | Transformaciones aplicadas a las variables |

Las tres figuras se guardan por separado en **PNG, PDF y SVG**. Para regenerarlas a partir de una corrida anterior, sin volver a entrenar:

```bash
git pull --ff-only origin opendata_dev
python workshop/plot_atlas_training.py --results "$HOME/hep-workshop/results/atlas_gpu_baseline01/run_0001"
```

Sustituye la ruta por la carpeta de la corrida que quieras visualizar.

### Comparar con el benchmark antes de variar {#comparar-benchmark}

La configuración actual permite hasta **40 épocas**, con parada tras **10 épocas sin mejora**. Registra sus resultados en `metrics.json`.

Las mediciones siguientes corresponden a la configuración anterior de **20 épocas y paciencia 6**; se conservan como antecedente, no como resultados del benchmark actualizado:

| Magnitud | Referencia GPU MI210 | Tu ejecución |
| --- | ---: | --- |
| Variables de entrada | 30 | Registrar |
| Eventos de entrenamiento | 200 000 | Registrar |
| Eventos de validación | 50 000 | Registrar |
| Semilla | 16 | Registrar |
| Épocas ejecutadas | 20 | Registrar |
| AUC de validación | 0.90999 | Registrar |
| AMS interna | 3.5229 | Registrar |
| Tiempo de entrenamiento | 29.95 s | Registrar |

Para la misma red en CPU, con cuatro hilos, se midieron **AUC 0.91048**, **AMS interna 3.5629** y **39.35 s** en 20 épocas. Comparar primero con el dispositivo utilizado. [Descargar el resumen de referencia](assets/benchmarks/atlas_yuca_baseline.json).

El número de entradas, los conteos y la semilla deben coincidir con esta configuración. AUC, AMS y tiempos son mediciones de una corrida: pequeñas diferencias numéricas o de rendimiento no implican un fallo. Si la separación difiere claramente, revisar el YAML, las particiones y las curvas antes de pasar a las variaciones. No se ha establecido una tolerancia numérica a partir de repeticiones.

Compara las variaciones con tu nueva ejecución de referencia de 40 épocas máximas y paciencia 10. Las puntuaciones históricas del challenge sirven como contexto. Nuestra AMS corresponde a validación interna, no a la evaluación privada del concurso.


Abrir `training_loss.png`, `roc_curve.png` y `classifier_scores.png` y `metrics.json`. Registrar la primera fila de la [bitácora](bitacora.md) con los valores propios. Antes de modificar el modelo, identificar:

1. La carpeta donde se guardaron los resultados.
2. El archivo que conserva la configuración utilizada.
3. La evolución de las pérdidas de entrenamiento y validación.
4. El AUC, la AMS interna y el tiempo de entrenamiento.

### Interpretación de las figuras

Abre **`training_loss.png`, `roc_curve.png` y `classifier_scores.png`** en la carpeta de tu corrida. Los números para la tabla están en **`metrics.json`**.

| Observa | Interpreta |
| --- | --- |
| Pérdida de entrenamiento y validación | ¿Aprende también sobre eventos que no vio al entrenar? |
| Curva ROC | ¿Conserva más señal para el mismo fondo aceptado? |
| Puntuaciones de señal y fondo | ¿Dónde se separan y dónde se confunden? |
| AUC y AMS interna | ¿Mejoró la separación global y también la selección? |
| Tiempo y épocas | ¿La mejora justificó el costo? |

Una curva de validación que empeora mientras entrenamiento sigue mejorando sugiere **sobreajuste**. La parada temprana conserva el modelo con menor pérdida de validación. Una red más grande o más tiempo no garantizan mejores resultados.

### Cómo leer la curva ROC {#leer-una-roc-como-fisico}

La red asigna una puntuación. Al exigir una puntuación mayor que cierto umbral, conservamos una fracción de señal **εs** y una fracción de fondo **εb**.

| Elemento de la ROC del taller | Significado |
| --- | --- |
| Eje horizontal | Fondo que dejamos pasar, εb |
| Eje vertical | Señal que conservamos, εs |
| Un punto | Una elección de umbral |
| Más arriba al mismo εb | Más señal para el mismo fondo aceptado |
| Más a la izquierda al mismo εs | Menos fondo para la misma señal conservada |

**AUC resume toda la curva.** Un análisis puede depender solo de una zona de bajo fondo; por eso una AUC ligeramente mayor no garantiza mejor AMS o mejor límite.

Nuestro gráfico ROC es **sin pesos**. Para traducirlo a rendimientos físicos, se deben sumar los pesos de los eventos seleccionados. Los porcentajes de eventos simulados no siempre son las eficiencias ponderadas que corresponden a tasas esperadas.

#### Ejemplo para completar en clase

Imagina dos selecciones que conservan **60 eventos de señal**. Una deja pasar **1 000 eventos de fondo** y la otra solo **500**. Si el fondo se conoce con suficiente precisión, la segunda facilita distinguir la señal de las fluctuaciones del fondo. Es un ejemplo ilustrativo, no un resultado del dataset.

**Para discutir:** si una red rechaza más fondo, pero también pierde buena parte de la señal, ¿podemos afirmar que mejoró el análisis? ¿Qué información de la ROC necesitamos comparar?

### Qué aporta la AMS a la comparación {#interpretar-ams}

La red asigna una puntuación a cada evento. Al elegir un **umbral**, aceptamos una parte de la señal y otra del fondo: ese punto aparece en la ROC. La **AMS** utiliza los pesos de los eventos seleccionados para estimar una sensibilidad aproximada de esa selección.

En **`metrics.json`**, `roc_auc_unweighted` resume la ROC sin pesos y `ams_validation_tuned` guarda la AMS obtenida tras ajustar el umbral en validación. **Una AUC mayor no garantiza una AMS mayor**: la primera resume todos los umbrales; la segunda depende de la selección elegida y de los rendimientos ponderados de señal y fondo.

Para comparar modelos, conserva las mismas particiones y el mismo procedimiento de evaluación. La AMS del taller se ajusta en validación interna; no es una significancia observada ni una puntuación de la evaluación privada del challenge.

**Al revisar tus figuras:** ¿la ROC mejora en la zona de bajo fondo? ¿Sube también la AMS? ¿La mejora se mantiene en validación o solo disminuye la pérdida de entrenamiento?

### De una mejor clasificación a una búsqueda más sensible {#significado-fisico}

Una mejora útil de la ROC permite **conservar más señal para el mismo fondo**, o **reducir el fondo sin perder señal**. Esto puede hacer que un proceso poco frecuente resulte más fácil de distinguir de las fluctuaciones del fondo. La mejora debe mantenerse en eventos que la red no utilizó para aprender.

- **Si los datos contienen una señal:** una selección más sensible puede ayudar a identificar un exceso compatible con ese proceso y aportar evidencia para su observación.
- **Si no aparece un exceso significativo:** el análisis puede establecer un límite superior a la intensidad de la señal. Una búsqueda más sensible puede excluir, en promedio, señales más débiles; es decir, alcanzar un **límite esperado más bajo**.

La red mejora la selección; la conclusión física requiere además los datos observados, los rendimientos esperados y sus incertidumbres. Por eso, una mejor ROC o una AMS mayor **no garantizan una observación ni un límite observado más estricto**. La AMS del ejercicio permite explorar esa sensibilidad aproximada en simulación, como explica el [artículo del Higgs Challenge](https://proceedings.mlr.press/v42/cowa14.html).

**Qué significa entrenar mejor:** conseguir una separación que se mantenga en validación y sea útil en la región de interés. Una pérdida de entrenamiento menor, una red más profunda o una AUC global mayor no bastan por sí solas. Al comparar tus corridas, pregunta: **¿esta mejora permitiría conservar una señal débil con menos fondo, y a qué costo de tiempo?**

## Continuar con las variaciones

En la siguiente sección podrás utilizar el [selector de arquitecturas](variaciones.md#explorar-la-arquitectura-antes-de-modificar-el-yaml) para comparar capas, neuronas y número de parámetros antes de preparar una variación.

Conservar `atlas_baseline01.yaml` y la subcarpeta `run_XXXX` correspondiente a la referencia. Registrar su fila como **Referencia** en la [tabla de resultados](variaciones.md#registro), después de contrastarla con el benchmark. Esa corrida personal será el punto de comparación de las variaciones.


## Programa del miércoles: tres horas

| Horario relativo | Actividad |
| --- | --- |
| Primera hora | Acceso a Yuca, configuración del entorno e introducción a los procesos y variables físicas |
| Segunda hora | Explicación de la red de referencia, ejecución del benchmark y revisión de carpetas, figuras y métricas |
| Tercera hora | [Variaciones por grupos, registro de resultados y discusión](variaciones.md) |


[Anterior: procesos y variables](fisica.md){ .md-button }
[Continuar: variaciones y resultados](variaciones.md){ .md-button .md-button--primary }
