# CMS · Autoencoder y benchmark

## ¿Por qué utilizar un autoencoder?

El clasificador ATLAS aprende a distinguir dos clases usando ejemplos etiquetados de Higgs y fondo. El autoencoder CMS **aprende únicamente con eventos del Modelo Estándar**: comprime sus variables y trata de reconstruirlas.

Después comparamos cada evento con su reconstrucción. Un error grande puede señalar una configuración poco habitual para la red. La muestra W′ permite comprobar la respuesta ante una señal concreta, aunque el modelo no la haya utilizado para aprender. Esta estrategia motiva la búsqueda de anomalías sin entrenar un clasificador específico para W′.

## Red y entrenamiento

![Autoencoder de referencia: diez entradas, codificador de 16 y 8 neuronas, espacio latente de dos dimensiones, decodificador de 8 y 16 neuronas y diez salidas reconstruidas](assets/cms/autoencoder_network.svg)

El autoencoder comprime las diez entradas a un espacio latente de dos dimensiones e intenta reconstruirlas. Se entrena exclusivamente con las muestras del Modelo Estándar, minimizando el error cuadrático medio (MSE) con Adam. El escalado se ajusta con los eventos de entrenamiento.

El **codificador** reduce las entradas a dos coordenadas latentes. El **decodificador** intenta recuperar las diez variables. Las diez salidas corresponden a reconstrucciones de las entradas, no a etiquetas de señal y fondo.

El error se calcula sobre las variables escaladas. Una reconstrucción muy distinta del evento de entrada genera un MSE alto. Por eso el escalado, la composición del entrenamiento y el tamaño del espacio latente influyen en la respuesta.

## 1. Abrir el YAML de entrenamiento

Completa primero los [cinco pasos del procesamiento NanoAOD](cms-procesamiento.md). Ya tendrás los HDF5 validados y tu YAML **`hep-workshop/configs/cms_autoencoder_baseline01.yaml`**; no necesitas crear otra configuración desde cero.

En el explorador izquierdo de JupyterLab abre **hep-workshop → configs → cms_autoencoder_baseline01.yaml**. Revisa:

| Sección | Configuración de esta reproducción |
| --- | --- |
| `data.normal_input_paths` | Tus HDF5 de DYJets, WZ y ZZ: muestras SM utilizadas para aprender, validar y probar |
| `data.anomaly_input_paths` | Tus HDF5 Wprime: evaluación posterior, sin entrenar con ellos |
| `data.features` | Las diez variables físicas del ejercicio; no incluye `Dataset_ID` |
| `data.output_path` | Tu carpeta **hep-workshop/results/cms_autoencoder_baseline01** |
| `model` | Nombre `cms_autoencoder`, capas `[16, 8]`, espacio latente `2`, máximo `60` épocas, lote `256`, aprendizaje `0.001` y paciencia `8` |
| `anomaly_detection` | Validación SM `0.2`, prueba SM `0.2`, percentil `0.99` y semilla `16` |

Conserva los valores de la configuración inicial y guarda con **Ctrl+S**. El YAML completo utiliza rutas absolutas generadas para tu cuenta. No copies las rutas personales de otro estudiante.

## 2. Enviar el entrenamiento

En la terminal de JupyterLab, activa el mismo ambiente CMS y envía el entrenamiento:

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
conda activate ml-open-data
cd "$HOME/ML-integration-CMSSW"
mkdir -p "$HOME/hep-workshop/logs"
export WORKSHOP_CONDA_ENV=ml-open-data
JOB_ID=$(sbatch --parsable --account=curso07 --qos=qoscurso07 \
  --output="$HOME/hep-workshop/logs/cms_ae_%j.out" \
  workshop/run_cpu.slurm autoencoder \
  "$HOME/hep-workshop/configs/cms_autoencoder_baseline01.yaml")
echo "Trabajo enviado: $JOB_ID"
```

Esta red pequeña se ejecuta en CPU. El comando utiliza el YAML CMS indicado y no depende de la configuración del clasificador ATLAS ni de una asignación previa de grupos.

## 3. Monitorear el entrenamiento

Para ver si el trabajo está pendiente o ejecutándose:

```bash
squeue -u "$USER"
```

Para seguir las épocas y las pérdidas en la misma terminal donde lo enviaste:

```bash
tail -F "$HOME/hep-workshop/logs/cms_ae_${JOB_ID}.out"
```

El log muestra una **barra de avance por épocas**, la pérdida de entrenamiento (`train`) y la pérdida de validación SM (`SM validation`). Si el trabajo sigue en cola, el archivo puede no existir todavía; `tail -F` esperará a que aparezca. Si abriste otra terminal, sustituye `${JOB_ID}` por el número de tu trabajo.

**Ctrl+C cierra la consulta del log, no cancela el entrenamiento.** La parada temprana puede terminar antes del máximo de épocas. Una pérdida de entrenamiento que disminuye mientras la validación empeora puede indicar sobreajuste.

Para comprobar cómo terminó el trabajo, usa su número:

```bash
sacct -j "$JOB_ID" --format=JobID,State,ExitCode
```

Que desaparezca de `squeue` no garantiza que terminó correctamente. Revisa `COMPLETED`, el código de salida y los archivos de resultados. Si falla, el mismo log contiene los mensajes de error.

## 4. Abrir e interpretar los resultados

Al terminar, abre **hep-workshop → results → cms_autoencoder_baseline01** en el explorador de JupyterLab. Con `model.name: cms_autoencoder`, los archivos principales son:

| Archivo | Qué revisar |
| --- | --- |
| `workshop_config.yaml` | Copia de la configuración utilizada |
| `best_model_cms_autoencoder.pth` | Modelo conservado por su menor pérdida de validación |
| `loss_cms_autoencoder.pdf` | Pérdidas SM de entrenamiento y validación |
| `validation_events_cms_autoencoder.pdf` | Error por evento en validación SM y evaluación W′, con eventos separados por el umbral |
| `scores_by_process_cms_autoencoder.pdf` | Error de reconstrucción por proceso y umbral |
| `ROC_cms_autoencoder.pdf` | Separación entre SM y la muestra W′ de evaluación |
| `metrics_cms_autoencoder.json` | Conteos, umbral, AUC y eficiencias |
| `scores_cms_autoencoder.csv` | Errores por evento y selección respecto al umbral |

### Pérdidas: ¿la red aprende a reconstruir eventos SM?

Abre **`loss_cms_autoencoder.pdf`**. El eje horizontal muestra las épocas y el vertical el error de reconstrucción. Compara entrenamiento y validación **SM**: si entrenamiento mejora mientras validación empeora, puede haber sobreajuste. Se conserva el modelo con menor pérdida de validación.

### Error por evento y umbral: ¿qué selecciona el autoencoder?

Abre primero **`validation_events_cms_autoencoder.pdf`**: es la gráfica de **error de reconstrucción frente al índice del evento**. Tiene un panel por proceso SM de validación y otro para W′ de evaluación. La línea horizontal muestra el mismo umbral en todos los paneles; los puntos **azules** quedan por debajo y los **rojos** alcanzan o superan el umbral.

El índice horizontal solo ordena los eventos dentro de cada muestra: no es tiempo ni una variable física. Observa cuántos eventos SM se seleccionan y qué fracción de W′ produce un error alto. Si hay más de 4000 puntos azules por panel, se muestra una submuestra para facilitar la lectura; se conservan todos los puntos rojos y las fracciones se calculan con todos los eventos.

Abre **`scores_by_process_cms_autoencoder.pdf`**. Muestra las distribuciones del error de reconstrucción (MSE) para cada proceso SM y la muestra W′. La línea de umbral se fija con el **percentil 99 de la validación SM**, antes de evaluar W′. Los eventos con MSE igual o superior al umbral son los seleccionados como anómalos.

Compara cuánto SM y cuánto W′ quedan por encima del corte. Un evento seleccionado no queda identificado automáticamente como nueva física: el umbral conserva también una fracción de eventos SM. El 1 % se fija en validación con balance por proceso; no obliga a obtener exactamente 1 % en el conteo conjunto de prueba.

### ROC: ¿cómo cambia la selección al mover el umbral?

Abre **`ROC_cms_autoencoder.pdf`**. Compara la eficiencia W′ frente a la aceptación SM al recorrer distintos umbrales de MSE. La AUC resume esa separación. La ROC utiliza W′ como muestra de evaluación; sus eventos no ajustan la red ni el umbral de referencia.

### Indicadores numéricos

En **`metrics_cms_autoencoder.json`**, revisa `threshold`, `roc_auc`, `signal_test_tpr` (eficiencia W′), `normal_test_fpr` (aceptación SM conjunta) y `balanced_normal_test_fpr` (aceptación SM balanceada por proceso), junto con los conteos de eventos. Las métricas, las curvas y el YAML deben corresponder a la misma carpeta de resultados.

También puedes consultar las métricas desde la terminal:

```bash
cat "$HOME/hep-workshop/results/cms_autoencoder_baseline01/metrics_cms_autoencoder.json"
```

Para otra ejecución, guarda otro YAML y cambia `data.output_path`, por ejemplo a `results/cms_autoencoder_02`. El programa rechaza una carpeta de salida existente para proteger las corridas anteriores. El nombre de los archivos cambia si modificas `model.name`.

## Benchmark alcanzado {#benchmark-cms}

Para comparar con la referencia, conserva la selección, los archivos de entrada, las diez variables, el escalado y las particiones.

### Configuración y resultados de referencia

El benchmark alcanzado utiliza la configuración inicial de diez variables y arquitectura **10 → 16 → 8 → 2 → 8 → 16 → 10**. Su ejecución en Yuca el 9 de octubre de 2026 produjo los siguientes resultados con DYJets HT 70–100, WZ y ZZ, semilla 16 y una muestra W′ de 320 eventos para evaluación:

| Magnitud | Benchmark alcanzado |
| --- | ---: |
| Entradas de la red | 10 |
| Eventos SM de entrenamiento | 4 019 |
| Eventos SM de validación | 1 340 |
| Eventos SM de prueba | 1 340 |
| Eventos W′ de evaluación | 320 |
| Percentil de validación SM | 99 |
| Umbral de MSE | 3.19375 |
| Fracción SM seleccionada en prueba | 2.09 % |
| Fracción SM seleccionada, promediada por proceso | 1.07 % |
| Eficiencia W′ al umbral de referencia | 34.69 % |
| AUC de evaluación | 0.97041 |

[Descargar las métricas del benchmark inicial](assets/benchmarks/cms_10features_pilot.json).

La AUC de **0.97041** se evalúa dando el mismo peso total a cada proceso SM, igual que la aceptación SM promediada de **1.07 %**. La fracción SM de **2.09 %** corresponde, en cambio, al conteo conjunto de eventos de prueba. Son dos formas distintas de resumir la misma evaluación.

Para repetir la corrida, primero deben coincidir los conteos y la preparación de los datos. Las métricas se contrastarán con estos resultados; no se presupone que otra extracción reproduzca automáticamente los mismos números.

Los conteos por proceso permiten comprobar la composición:

| Proceso | Entrenamiento | Validación | Prueba |
| --- | ---: | ---: | ---: |
| DYJets HT 70–100 | 49 | 17 | 17 |
| WZ | 3 151 | 1 050 | 1 050 |
| ZZ | 819 | 273 | 273 |

### Archivos para comprobar la ejecución

| Archivo de la corrida | Qué comparar |
| --- | --- |
| `workshop_config.yaml` | Entradas, selección de variables y parámetros utilizados |
| `metrics_<nombre>.json` | Conteos, semilla, umbral y métricas |
| `loss_<nombre>.pdf` | Evolución de las pérdidas SM de entrenamiento y validación |
| `scores_by_process_<nombre>.pdf` | Distribuciones del error por proceso |
| `ROC_<nombre>.pdf` | Respuesta de la referencia frente a W′ |

`<nombre>` es el nombre del modelo indicado en el YAML. En las versiones actuales también se registran la mejor pérdida de validación, las épocas ejecutadas y el tiempo de entrenamiento; el archivo histórico no contiene esos tres valores.

### Condiciones para una comparación posterior

Una comparación posterior comenzaría por comprobar los conteos y las variables, seguida de las pérdidas y las distribuciones del error. La corrida inicial se conserva como referencia. Una modificación utilizaría una copia del YAML y una carpeta de salida diferente, con los mismos eventos y particiones.

La reproducción del benchmark incluye su evaluación W′. Para estudiar cambios del modelo, utilizar la validación SM; las cifras W′ no se emplean como objetivo para seleccionar la arquitectura.

<div class="image-credits" markdown>

Esquema didáctico de la arquitectura implementada en el repositorio principal. Las métricas corresponden al benchmark alcanzado, no a una nueva ejecución realizada al actualizar esta página.

</div>

[Anterior: Procesamiento NanoAOD](cms-procesamiento.md){ .md-button }
[Continuar: Interpretación y perspectivas](cms-resultados.md){ .md-button .md-button--primary }
