# Entrenamiento con el ATLAS Higgs Challenge

El objetivo del laboratorio es evaluar cómo una modificación de la red neuronal afecta las curvas de aprendizaje, la discriminación entre señal y fondo y el tiempo de entrenamiento.

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

### Escenarios de trabajo

Los participantes podrán organizarse por mesas o filas. Todos ejecutarán la misma referencia; cada grupo estudiará inicialmente uno de los siguientes factores. Si varias mesas comparten escenario, podrán contrastar la reproducibilidad de sus resultados.

| Escenario | Modificación en el YAML | Pregunta de análisis |
| --- | --- | --- |
| A. Arquitectura | Cambiar `model.hidden_dims`, por ejemplo a `[512, 256, 128, 64]` | ¿La capacidad adicional mejora la validación y cuánto aumenta el tiempo? |
| B. Regularización | Cambiar `model.dropout` de `0.1` a `0.3` | ¿Se reduce la diferencia entre entrenamiento y validación? |
| C. Optimización | Reducir `training.learning_rate`, por ejemplo de `0.001` a `0.0003` | ¿Cambia la convergencia con el mismo límite de épocas? |
| D. Duración | Aumentar `training.epochs` a `100` y fijar `training.patience` en `10` | ¿En qué época se alcanza la menor pérdida de validación y cuándo se detiene? |

Conservar los demás parámetros, las variables y las particiones de datos. Cada modificación requiere un YAML y una carpeta de salida propios. Los valores iniciales deben comprobarse en el archivo de referencia antes de registrar el cambio.

El criterio de la actividad será la calidad de la comparación y de su interpretación. La rapidez de envío o el mayor AUC aislado no determinan el mejor trabajo. La [bitácora](bitacora.md) y la [tabla de puesta en común](conclusiones.md) se completarán durante la sesión. El jueves se retomarán las conclusiones y se presentará el autoencoder CMS como extensión.

## Entender el problema

Queremos separar **Higgs → ττ** de procesos de fondo que pueden producir objetos similares. La red recibe **30 variables físicas** y asigna una puntuación a cada evento.

![Higgs a dos taus: leptón, hadrones y tres neutrinos](assets/workshop/higgs_tautau_final_state.svg)

*Cadena ilustrativa del taller: esperamos un electrón o muón, un tau hadrónico y momento transversal faltante por los tres neutrinos. También se considera el conjugado de carga. [Ver la explicación del diagrama](fisica.md#el-estado-final-que-buscamos).*

Antes de entrenar, conversamos: **¿qué distingue señal y fondo? ¿Por qué los neutrinos dificultan reconstruir el Higgs?** La [introducción física](fisica.md) explica las muestras y las 30 variables, no solo las que aparecen en esta imagen:

![Seis ejemplos de las treinta variables](assets/workshop/atlas_variables_01.png)

*Cada curva permite comparar formas de señal y fondo. Este panel muestra seis variables; la red utiliza las treinta.*

!!! info "¿Es tu primera sesión?"
    Sigue primero la [preparación inicial en Yuca](preparacion.md): acceso, ambiente, terminal y recursos. Luego regresa aquí para experimentar con el YAML.

## Preparar una referencia común

Primero ejecutaremos todos la misma configuración. Los datos ya están compartidos en Yuca y cada cuenta guarda sus propios resultados.

??? info "Comandos de preparación: una sola vez"
    Con el acceso y el ambiente GPU ya preparados, ejecutar desde la terminal:

    ```bash
    cd "$HOME/ML-integration-CMSSW"
    git pull --ff-only origin opendata_dev
    mkdir -p "$HOME/hep-workshop/configs" "$HOME/hep-workshop/logs"
    cp -n workshop/configs/atlas_higgs_gpu.yaml "$HOME/hep-workshop/configs/atlas_baseline01.yaml"
    ```

    Si falta configurar tu cuenta, consulta el [apoyo de preparación](referencia.md#entorno-gpu-de-yuca). Para generar las comparaciones de las treinta variables, sigue el [apoyo de visualización](apoyo.md#3-mira-las-variables-antes-de-entrenar).

## Configuración mediante YAML

Abre `hep-workshop/configs/atlas_baseline01.yaml` con el editor de **Files de Open OnDemand**. Al principio conserva la configuración de referencia.

| Campo que puedes cambiar | Idea que estás probando |
| --- | --- |
| `hidden_dims` | Número de capas y neuronas por capa |
| `dropout` | Regularización para evitar aprender demasiado los detalles del entrenamiento |
| `learning_rate` | Tamaño de los pasos al aprender |
| `batch_size` | Cuántos eventos procesa juntos |
| `epochs` y `patience` | Cuánto puede entrenar y cuándo dejar de insistir |

**Ejemplo dentro del YAML:**

```yaml
model:
  hidden_dims: [128, 64, 32, 16]
  dropout: 0.1
```

Son cuatro capas ocultas. Para ensayar una red mayor, podrías cambiar solo la lista a `[512, 256, 128, 64]`. No necesitas modificar el código ni los scripts del clúster.

## Un experimento, una carpeta

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
    Copiar la referencia, editar la copia en Files y cambiar su carpeta de salida:

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

## Evaluación de los resultados

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

## Comparación de configuraciones

Completa la **[bitácora breve](bitacora.md)** durante la actividad. Compara con la referencia usando los mismos datos y modificando un factor por experimento. Si hay tiempo, evalúa una segunda configuración o compara CPU y GPU con apoyo del docente.

Al cerrar, comparte una figura y responde: **¿qué esperabas, qué observaste y qué puedes concluir?** [Puesta en común](conclusiones.md).

Nuestra AMS es de validación interna. Los números históricos del challenge corresponden a otra evaluación; se consultan como [referencia externa](referencia.md#benchmarks-publicados-del-higgs-challenge), no como una clasificación directa de nuestros grupos.

[Apoyo operativo](apoyo.md) · [Física y todas las variables](fisica.md) · [Detalles opcionales del método](referencia.md)
