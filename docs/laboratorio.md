# Ejercicio 1 · ATLAS Higgs Challenge

El ejercicio comienza con la reproducción de una red de referencia. Una vez identificados sus resultados, se modificarán los parámetros del YAML para comparar distintas configuraciones.

Los datos de este ejercicio son una tabla CSV de CERN Open Data con las variables ya calculadas. No se realiza una extracción desde NanoAOD. La lectura, el tratamiento de valores ausentes y la estandarización forman el preprocesamiento del clasificador.

El entrenamiento se ejecuta con los scripts del repositorio principal [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop). Los parámetros se modifican en el YAML personal; las figuras y métricas se analizan en la carpeta de salida de cada corrida. No se requiere editar el código de Python.

En el [flujo general del curso](index.md#el-flujo-de-un-analisis-experimental), este ejercicio comienza con observables ya calculados. La práctica se concentra en preparar esas entradas, entrenar el clasificador y comparar sus resultados.

## Características del ejercicio

| Aspecto | ATLAS Higgs Challenge |
| --- | --- |
| Datos de origen | Tabla CSV comprimida (`.csv.gz`) del challenge |
| Contenido | Una fila por evento, con 30 variables físicas ya calculadas |
| Procesamiento | Lectura de la tabla, tratamiento de valores ausentes y estandarización |
| Modelo | Red completamente conectada de clasificación supervisada |
| Objetivo | Distinguir Higgs → ττ de los procesos de fondo |
| Evaluación | Curva ROC, AUC y AMS interna |
| Lugar en el curso | Actividad principal del miércoles |

## 1. Procesos y variables de entrada

Revisar los [diagramas de producción y decaimiento del Higgs](fisica.md) y las [treinta variables de entrada](fisica.md#las-30-variables-organizadas-por-su-significado). Identificar el leptón, el tau hadrónico, el momento transversal faltante y los jets que caracterizan los eventos.

Consultar la [comparación de distribuciones de señal y fondo](fisica.md#distribuciones-de-las-variables) antes de ejecutar el entrenamiento.

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

    Si falta configurar el ambiente, completar la [preparación inicial](preparacion.md#3-clonacion-y-preparacion-del-entorno-de-analisis). Para generar las comparaciones de las treinta variables, sigue el [apoyo de visualización](apoyo.md#3-mira-las-variables-antes-de-entrenar).

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

### Comparar con el benchmark antes de variar {#comparar-benchmark}

La primera ejecución reproduce la configuración común. Comparar los valores de `metrics.json` con la corrida de referencia realizada en Yuca:

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

Esta es la referencia reproducible del ejercicio; las puntuaciones históricas del challenge se utilizan posteriormente como contexto. Nuestra AMS corresponde a validación interna, no a la evaluación privada del concurso.


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

Conservar `atlas_baseline01.yaml` y la carpeta `atlas_gpu_baseline01`. Registrar su fila como **Referencia** en la [tabla de resultados](variaciones.md#registro), después de contrastarla con el benchmark. Esa corrida personal será el punto de comparación de las variaciones.


## Programa del miércoles: tres horas

| Horario relativo | Actividad |
| --- | --- |
| Primera hora | Acceso a Yuca, configuración del entorno e introducción a los procesos y variables físicas |
| Segunda hora | Explicación de la red de referencia, ejecución del benchmark y revisión de carpetas, figuras y métricas |
| Tercera hora | [Variaciones por grupos, registro de resultados y discusión](variaciones.md) |


[Anterior: procesos y variables](fisica.md){ .md-button }
[Continuar: variaciones y resultados](variaciones.md){ .md-button .md-button--primary }
