# Entrenamiento con el ATLAS Higgs Challenge

El ejercicio comienza con la reproducción de una red de referencia. Una vez identificados sus resultados, se modificarán los parámetros del YAML para comparar distintas configuraciones.

## 1. Procesos y variables de entrada

Revisar los [diagramas de producción y decaimiento del Higgs](fisica.md) y las [treinta variables de entrada](fisica.md#las-30-variables-organizadas-por-su-significado). Identificar el leptón, el tau hadrónico, el momento transversal faltante y los jets que caracterizan los eventos.

![Distribuciones de seis de las treinta variables de entrada](assets/workshop/atlas_variables_01.png)

*Comparación de las distribuciones de señal y fondo. El entrenamiento utiliza las treinta variables, no solamente las seis de este panel.*

## 2. Red neuronal de referencia {#red-neuronal-de-referencia}

El benchmark del taller es una red completamente conectada de clasificación binaria. Esta configuración proporciona el punto de comparación para los ejercicios posteriores; no corresponde al modelo ganador del challenge.

**30 entradas → 128 → 64 → 32 → 16 → 1 salida**

Las cuatro capas ocultas utilizan activación ReLU y dropout. La salida se transforma mediante una función sigmoide en una puntuación entre cero y uno; los valores altos favorecen la clasificación como señal.

| Parámetro | Configuración de referencia |
| --- | --- |
| Variables de entrada | Las 30 variables físicas |
| Capas ocultas | `[128, 64, 32, 16]` |
| Dropout | `0.1` |
| Optimizador | AdamW |
| Tasa de aprendizaje | `0.001` |
| Tamaño de lote | `4096` eventos |
| Máximo de épocas | `20` |
| Parada temprana | `6` épocas sin mejora de la pérdida de validación |
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

    Si falta configurar tu cuenta, consulta el [apoyo de preparación](referencia.md#entorno-gpu-de-yuca). Para generar las comparaciones de las treinta variables, sigue el [apoyo de visualización](apoyo.md#3-mira-las-variables-antes-de-entrenar).

Abrir `hep-workshop/configs/atlas_baseline01.yaml` en el explorador lateral de JupyterLab. Comprobar los parámetros anteriores y conservarlos sin cambios durante esta primera ejecución. La carpeta de salida indicada en el YAML debe ser:

```yaml
output:
  directory: $HOME/hep-workshop/results/atlas_gpu_baseline01
```

Desde la terminal de JupyterLab, en la raíz del repositorio:

```bash
sbatch --output="$HOME/hep-workshop/logs/atlas_%j.out" \
  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/atlas_baseline01.yaml"
```

Consultar el estado del trabajo con `squeue -u "$USER"`. Esperar a que termine antes de abrir sus resultados. Si se produce un error, consultar el [apoyo operativo](apoyo.md).

## 4. Localizar y revisar los resultados

En el explorador de archivos de JupyterLab, abrir **hep-workshop → results → atlas_gpu_baseline01** dentro del directorio personal. Los resultados pertenecen a la cuenta del participante; los datos originales permanecen en la carpeta compartida.

| Archivo | Contenido y uso |
| --- | --- |
| `config.yaml` | Configuración utilizada en esta ejecución |
| `training_summary.png` | Pérdidas, curva ROC y distribuciones de puntuación |
| `metrics.json` | AUC, AMS interna, tiempo, mejor época y épocas ejecutadas |
| `history.csv` | Evolución del entrenamiento por época |
| `best_model.pt` | Modelo conservado según la pérdida de validación |
| `validation_scores.csv` | Puntuaciones de los eventos de validación |
| `splits.csv` | Identificación de los eventos de cada partición |
| `preprocessing.joblib` | Transformaciones aplicadas a las variables |

En la prueba previa en una MI210 se obtuvieron **AUC ≈ 0.910**, **AMS interna ≈ 3.52** y **30 segundos de entrenamiento**. Son valores orientativos: el tiempo depende de los recursos y los resultados pueden presentar pequeñas variaciones numéricas. La AMS corresponde a la validación interna del taller.

Abrir `training_summary.png` y `metrics.json`. Registrar la primera fila de la [bitácora](bitacora.md) con los valores propios. Antes de modificar el modelo, identificar:

1. La carpeta donde se guardaron los resultados.
2. El archivo que conserva la configuración utilizada.
3. La evolución de las pérdidas de entrenamiento y validación.
4. El AUC, la AMS interna y el tiempo de entrenamiento.

### Interpretación de las figuras

Abre **`training_summary.png`** en la carpeta de tu corrida. Los números para la tabla están en **`metrics.json`**.

| Observa | Interpreta |
| --- | --- |
| Pérdida de entrenamiento y validación | ¿Aprende también sobre eventos que no vio al entrenar? |
| Curva ROC | ¿Conserva más señal para el mismo fondo aceptado? |
| Puntuaciones de señal y fondo | ¿Dónde se separan y dónde se confunden? |
| AUC y AMS interna | ¿Mejoró la separación global y también la selección? |
| Tiempo y épocas | ¿La mejora justificó el costo? |

Una curva de validación que empeora mientras entrenamiento sigue mejorando sugiere **sobreajuste**. La parada temprana conserva el modelo con menor pérdida de validación. Una red más grande o más tiempo no garantizan mejores resultados.

Una mejor selección puede ayudar a medir procesos o aumentar la sensibilidad a señales. No cambia la sección eficaz física ni calcula por sí sola un límite: [explicación con un ejemplo](fisica.md#leer-una-roc-como-fisico).

## Variaciones de la referencia

**Antes de modificar la referencia, copia su YAML con otro nombre.** Por ejemplo, `atlas_02.yaml`. Dentro de esa copia modifica un parámetro o un conjunto definido de parámetros y elige una carpeta nueva:

```yaml
output:
  directory: $HOME/hep-workshop/results/atlas_02
```

Conserva el resto del archivo. Cambiar el nombre del YAML no cambia por sí solo la carpeta de salida. Los resultados anteriores se conservan para poder compararlos.

| Experimento | Qué queremos averiguar |
| --- | --- |
| Más neuronas o capas | ¿Aprende mejor o solo se vuelve más complejo? |
| Otro aprendizaje | ¿Cambia cómo progresa la red? |
| Más dropout | ¿Mejora su comportamiento en eventos que no usó para aprender? |
| Más épocas con parada temprana | ¿Cuándo deja de mejorar? |

**Antes de enviar, escribe una frase:** «Esperamos que este cambio… porque…».

??? info "Cómo copiar y enviar un YAML"
    Copiar la referencia, editar la copia en JupyterLab y cambiar su carpeta de salida:

    ```bash
    cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/atlas_02.yaml"
    ```

    Desde la raíz del repositorio, enviar el YAML elegido. Para la referencia, usar `atlas_baseline01.yaml` en la última línea:

    ```bash
    sbatch --output="$HOME/hep-workshop/logs/atlas_%j.out" \
      workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/atlas_02.yaml"
    squeue -u "$USER"
    ```

    Si hay un problema con el trabajo, consulta el [apoyo de comandos y archivos](apoyo.md). Los fragmentos YAML se editan dentro del archivo; no se ejecutan en la terminal.

### Escenarios de trabajo

Los participantes podrán organizarse por mesas o filas. Todos ejecutarán la misma referencia; cada grupo estudiará inicialmente uno de los siguientes factores. Si varias mesas comparten escenario, podrán contrastar la reproducibilidad de sus resultados.

| Escenario | Modificación en el YAML | Pregunta de análisis |
| --- | --- | --- |
| A. Arquitectura | Cambiar `model.hidden_dims`, por ejemplo a `[512, 256, 128, 64]` | ¿La capacidad adicional mejora la validación y cuánto aumenta el tiempo? |
| B. Regularización | Cambiar `model.dropout` de `0.1` a `0.3` | ¿Se reduce la diferencia entre entrenamiento y validación? |
| C. Optimización | Reducir `training.learning_rate`, por ejemplo de `0.001` a `0.0003` | ¿Cambia la convergencia con el mismo límite de épocas? |
| D. Duración | Aumentar `training.epochs` a `100` y fijar `training.patience` en `10` | ¿En qué época se alcanza la menor pérdida de validación y cuándo se detiene? |

Conservar los demás parámetros, las variables y las particiones de datos. Cada modificación requiere un YAML y una carpeta de salida propios. Los valores iniciales deben comprobarse en el archivo de referencia antes de registrar el cambio.

## Comparación de configuraciones

Completar la [bitácora](bitacora.md) con la referencia y la variación. Mantener los mismos datos y modificar un factor por experimento. Comparar las curvas y las métricas antes de decidir una segunda modificación.

Presentar una figura y explicar si los resultados respaldan la hipótesis inicial. Las referencias históricas del challenge utilizan una evaluación diferente de nuestra validación interna: [método y benchmarks publicados](referencia.md#benchmarks-publicados-del-higgs-challenge).

## Programa del miércoles: tres horas

La sesión combina una introducción breve con ejercicios de entrenamiento y análisis. La activación de la cuenta y, de ser posible, la instalación del ambiente se completarán previamente siguiendo la [preparación inicial](preparacion.md).

| Tiempo transcurrido | Actividad | Resultado esperado |
| --- | --- | --- |
| 0–20 min | Acceso a JupyterLab, activación del ambiente y consulta de los datos compartidos | Entorno listo para ejecutar los ejercicios |
| 20–40 min | Señal Higgs → ττ, procesos de fondo y distribuciones de entrada | Identificar un observable y explicar su significado físico |
| 40–65 min | Entrenamiento de referencia y lectura de sus figuras | Primera fila de la tabla: AUC, AMS interna, épocas y tiempo |
| 65–100 min | Primera variación del YAML por grupo o mesa | Hipótesis escrita, configuración y resultados en una carpeta nueva |
| 100–110 min | Pausa | |
| 110–145 min | Comparación con la referencia y segunda prueba, si procede | Interpretación de la mejora, el sobreajuste o el costo de cómputo |
| 145–170 min | Puesta en común entre grupos | Tabla comparativa y una figura representativa por grupo |
| 170–180 min | Discusión de resultados y cierre | Conclusiones sobre arquitectura, regularización y evaluación |

Mientras los trabajos esperan o se ejecutan, se revisarán las distribuciones, se formularán hipótesis y se completará el registro. El tiempo en cola se distinguirá del tiempo de entrenamiento.

