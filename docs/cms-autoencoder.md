# CMS · Autoencoder y benchmark

La red aprende a reconstruir eventos del **Modelo Estándar**. W′ se utiliza solo para evaluar su respuesta ante eventos distintos.

![Autoencoder: diez entradas, espacio latente de dos dimensiones y diez salidas reconstruidas](assets/cms/autoencoder_network.svg)

### ¿Cómo aprende?

El **codificador** comprime las diez variables a dos coordenadas latentes. El **decodificador** intenta recuperar las diez entradas. Durante el entrenamiento, la red ajusta sus parámetros para reducir la diferencia entre entrada y reconstrucción, usando únicamente eventos SM.

### Error de reconstrucción

Para cada evento calculamos el **error cuadrático medio (MSE)**:

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="MSE igual a un décimo de la suma, desde i igual a uno hasta diez, de x i menos x reconstruida i, al cuadrado">
  <mrow>
    <mi mathvariant="normal">MSE</mi><mo>=</mo>
    <mfrac><mn>1</mn><mn>10</mn></mfrac>
    <munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mn>10</mn></munderover>
    <msup><mrow><mo>(</mo><msub><mi>x</mi><mi>i</mi></msub><mo>−</mo><msub><mover accent="true"><mi>x</mi><mo>^</mo></mover><mi>i</mi></msub><mo>)</mo></mrow><mn>2</mn></msup>
  </mrow>
</math>

Aquí, **x** son las variables escaladas y **x̂** sus reconstrucciones. El escalado se calcula con el entrenamiento SM. Un error pequeño indica una reconstrucción cercana; uno grande, un evento que la red reconstruye peor.

### ¿Cuándo se selecciona un evento?

El umbral se fija en el **percentil 99 del error de validación SM, balanceando los procesos**. Seleccionamos eventos con **MSE ≥ umbral**. Después evaluamos W′ sin usarlo para entrenar ni fijar el corte: un error alto señala una anomalía para el modelo, no identifica por sí solo una nueva partícula.

## 1. Revisar la configuración

Completa primero el [procesamiento NanoAOD y las gráficas de entrada](cms-procesamiento.md). En **hep-workshop → configs**, abre el YAML `cms_autoencoder_` seguido de tu etiqueta.

Conserva las diez variables, capas **[16, 8]**, espacio latente **2**, máximo **60 épocas** y paciencia **8**.

## 2. Enviar el entrenamiento

En una terminal con CMS activado, recupera la etiqueta guardada durante el procesamiento. **No elijas una nueva para entrenar:**

```bash
source "$HOME/hep-workshop/cms-session.sh"
echo "Etiqueta CMS: $CMS_TAG"
cd "$HOME/ML-integration-CMSSW"
git pull --ff-only origin opendata_dev
mkdir -p "$HOME/hep-workshop/logs"
export WORKSHOP_CONDA_ENV=ml-open-data
JOB_ID=$(sbatch --parsable --account=curso07 --qos=qoscurso07 \
  --output="$HOME/hep-workshop/logs/cms_ae_%j.out" \
  workshop/run_cpu.slurm autoencoder \
  "$HOME/hep-workshop/configs/cms_autoencoder_${CMS_TAG}.yaml")
echo "Trabajo enviado: $JOB_ID"
```

## 3. Seguir el avance

```bash
tail -F "$HOME/hep-workshop/logs/cms_ae_${JOB_ID}.out"
```

El log muestra las épocas y las pérdidas. **Ctrl+C cierra la consulta; el entrenamiento continúa.** Después comprueba:

```bash
sacct -j "$JOB_ID" --format=JobID,State,ExitCode
```

Continúa cuando indique **`COMPLETED` y `0:0`**. Si falla, revisa el mismo log.

## 4. Abrir los resultados

En JupyterLab abre **hep-workshop → results → cms_autoencoder_ seguido de tu etiqueta**:

| Archivo | Contenido |
| --- | --- |
| `loss_cms_autoencoder.pdf` | Pérdidas de entrenamiento y validación |
| `scores_by_process_cms_autoencoder.pdf` | Error de reconstrucción por proceso y umbral |
| `ROC_cms_autoencoder.pdf` | Separación SM–W′ |
| `metrics_cms_autoencoder.json` | Conteos, AUC, umbral y eficiencias |

## Resultados del benchmark {#benchmark-cms}

Gráficas de la corrida realizada en Yuca. Pulsa una imagen para ampliarla.

### Pérdidas de entrenamiento y validación

[![Pérdidas de entrenamiento y validación SM frente a la época](assets/cms/benchmark_loss_20261020.png){ .benchmark-plot }](assets/cms/benchmark_loss_20261020.png)

Ambas pérdidas disminuyen durante el entrenamiento.

### Gráfico representativo: error de reconstrucción por proceso

[![Distribuciones del error para DYJets, WZ, ZZ y Wprime, con umbral 2.564](assets/cms/benchmark_scores_process_20261020.png){ .benchmark-plot }](assets/cms/benchmark_scores_process_20261020.png)

Compara cada proceso SM con W′: su cola se extiende hacia errores mayores. La línea discontinua marca el umbral **2.564**; los eventos a su derecha se seleccionan como anómalos.

### Comparación SM–W′

[![Error de reconstrucción SM con igual peso por proceso y Wprime](assets/cms/benchmark_scores_sm_20261020.png){ .benchmark-plot }](assets/cms/benchmark_scores_sm_20261020.png)

El conjunto SM se representa con igual peso total por proceso.

### Eventos W′ seleccionados

[![Error de reconstrucción de 7421 eventos Wprime: umbral 2.564 y 17.95 por ciento seleccionados](assets/cms/benchmark_events_wprime_20261020.png){ .benchmark-plot }](assets/cms/benchmark_events_wprime_20261020.png)

Cada punto es un evento W′ de evaluación. El umbral **2.564** selecciona el **17.95 % de los 7 421 eventos**, marcados en rojo.

[Anterior: Procesamiento NanoAOD](cms-procesamiento.md){ .md-button }
[Continuar: Interpretación y perspectivas](cms-resultados.md){ .md-button .md-button--primary }
