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

## Continuar con las variaciones

Conservar el YAML y los resultados de la referencia. Registrar sus métricas antes de pasar a la actividad de la última hora.

[Variaciones por grupos y tabla de resultados](variaciones.md){ .md-button .md-button--primary }

## Programa del miércoles: tres horas

| Horario relativo | Actividad |
| --- | --- |
| Primera hora | Acceso a Yuca, configuración del entorno e introducción a los procesos y variables físicas |
| Segunda hora | Explicación de la red de referencia, ejecución del benchmark y revisión de carpetas, figuras y métricas |
| Tercera hora | [Variaciones por grupos, registro de resultados y discusión](variaciones.md) |

