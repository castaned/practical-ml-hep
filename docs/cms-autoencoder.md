# CMS · Autoencoder y benchmark

## ¿Por qué utilizar un autoencoder?

El clasificador ATLAS aprende a distinguir dos clases usando ejemplos etiquetados de Higgs y fondo. El autoencoder CMS **aprende únicamente con eventos del Modelo Estándar**: comprime sus variables y trata de reconstruirlas.

Después comparamos cada evento con su reconstrucción. Un error grande puede señalar una configuración poco habitual para la red. La muestra W′ permite comprobar la respuesta ante una señal concreta, aunque el modelo no la haya utilizado para aprender. Esta estrategia motiva la búsqueda de anomalías sin entrenar un clasificador específico para W′.

## Red y entrenamiento

![Autoencoder de referencia: diez entradas, codificador de 16 y 8 neuronas, espacio latente de dos dimensiones, decodificador de 8 y 16 neuronas y diez salidas reconstruidas](assets/cms/autoencoder_network.svg)

El autoencoder comprime las diez entradas a un espacio latente de dos dimensiones e intenta reconstruirlas. Se entrena exclusivamente con las muestras del Modelo Estándar, minimizando el error cuadrático medio (MSE) con Adam. El escalado se ajusta con los eventos de entrenamiento.

El **codificador** reduce las entradas a dos coordenadas latentes. El **decodificador** intenta recuperar las diez variables. Las diez salidas corresponden a reconstrucciones de las entradas, no a etiquetas de señal y fondo.

El error se calcula sobre las variables escaladas. Una reconstrucción muy distinta del evento de entrada genera un MSE alto. Por eso el escalado, la composición del entrenamiento y el tamaño del espacio latente influyen en la respuesta.

??? info "Ejecución de la demostración"
    Con la configuración CMS preparada, estos comandos muestran sus archivos y ejecutan la referencia:

    ```bash
    python workshop/student.py files
    python workshop/student.py train --task autoencoder --role baseline
    ```

    Se utiliza el YAML CMS, con sus entradas y carpeta de salida propias. No se utiliza el YAML ni el ejecutable del Higgs Challenge. El [procedimiento técnico CMS](https://castaned.github.io/ML-integration-CMSSW/open-data/05_autoencoder/) detalla su preparación.

## Benchmark alcanzado {#benchmark-cms}

Este benchmark recoge los resultados ya obtenidos con la configuración inicial. En el taller se mostrará su desarrollo y la interpretación de sus productos. La referencia requiere conservar la selección, los archivos de entrada, las diez variables, el escalado y las particiones; no corresponde a cualquier conjunto de muestras CMS.

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
