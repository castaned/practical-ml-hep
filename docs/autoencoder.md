# Ejercicio 2 · Autoencoder CMS desde NanoAOD

Este ejercicio presenta el análisis desde los archivos de eventos hasta el entrenamiento de una red de reconstrucción. Es una extensión independiente del ejercicio ATLAS: utiliza otras muestras, otro formato de origen y un objetivo de aprendizaje distinto.

El procesamiento y el entrenamiento utilizan el código del repositorio principal [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev). Los YAML de cada etapa indican los archivos de entrada, los parámetros disponibles y las carpetas de salida. Durante el ejercicio se trabaja con esos archivos de configuración y se revisan los productos generados en las carpetas personales, sin modificar los scripts de Python.

En el [flujo general del curso](index.md#el-flujo-de-un-analisis-experimental), este ejercicio comienza antes de la extracción de observables. La selección y el procesamiento de NanoAOD permiten construir las entradas del autoencoder y seguir su origen hasta los eventos simulados.

## Características del ejercicio

| Aspecto | Autoencoder CMS |
| --- | --- |
| Datos de origen | Archivos ROOT en formato NanoAOD (`.root`) |
| Contenido | Colecciones de partículas reconstruidas y propiedades del evento |
| Procesamiento | Selección de eventos, reconstrucción de candidatos W/Z, cálculo de observables y conversión a HDF5 |
| Modelo | Autoencoder entrenado con eventos del Modelo Estándar |
| Objetivo | Estudiar eventos con errores de reconstrucción elevados |
| Evaluación | Pérdidas y distribuciones del error de reconstrucción; W′ como referencia de evaluación |
| Lugar en el curso | Extensión para mostrar el análisis desde NanoAOD |

## 1. Muestras y formato de origen

Se utilizan simulaciones CMS disponibles en CERN Open Data, en formato **NanoAOD dentro de archivos ROOT**. Cada evento contiene colecciones de electrones, muones y jets, además de otras cantidades reconstruidas, como el momento transversal faltante.

Las muestras del Modelo Estándar son **DYJets HT 70–100, WZ y ZZ**. La muestra **W′ → WZ → 3ℓν**, de masa 1 TeV, se reserva para evaluación. W′ no participa en el entrenamiento del autoencoder.

En el Higgs Challenge las treinta variables ya vienen calculadas en una tabla. Aquí es necesario seleccionar los eventos y construir las variables a partir de las ramas NanoAOD.

## 2. Selección y extracción de variables

**NanoAOD (ROOT) → selección multileptónica → candidatos W/Z y observables → gráficos de control → HDF5**

La selección de eventos con al menos tres leptones está implementada en `example_files/main_process/filterNanoAOD.py`, dentro del repositorio principal. El archivo puede consultarse para entender la selección; no es necesario editarlo. El procesamiento construye candidatos Z y W y calcula las cantidades que recibirá la red. El cutflow permite seguir cuántos eventos sobreviven a cada selección.

La [guía de procesamiento CMS](https://castaned.github.io/ML-integration-CMSSW/open-data/03_procesamiento/) contiene el procedimiento de ejecución. Los archivos originales se leen de la carpeta compartida; los productos del procesamiento se guardan en la cuenta personal.

| Producto | Función en el análisis |
| --- | --- |
| ROOT procesado | Eventos seleccionados y observables calculados |
| Cutflow y gráficos | Revisión de la selección y las distribuciones |
| HDF5 | Variables de los eventos seleccionados, preparadas para lectura durante el entrenamiento |
| Mapa de datasets | Asociación entre identificadores y procesos físicos |

HDF5 es un producto del análisis; los archivos de origen de este ejercicio son los NanoAOD. Se puede reutilizar una extracción ya preparada para estudiar el entrenamiento, conservando la trazabilidad hasta los archivos ROOT y la selección utilizada.

## 3. Variables de entrada

La referencia utiliza diez variables:

| Grupo | Variables |
| --- | --- |
| Momento transversal faltante | `MET_pt` |
| Sistema de tres leptones | `M3l`, `Lep_pt_sum` |
| Candidato Z | `Z_mass`, `Z_pt`, `Z_deltaR` |
| Leptones de los candidatos | `Lep1Z_pt`, `Lep2Z_pt`, `Lep3W_pt` |
| Candidato W | `W_mt` |

`Dataset_ID` identifica el proceso de origen y permite separar las muestras. No es una variable de entrada de la red.

## 4. Red y entrenamiento

**10 → 16 → 8 → 2 → 8 → 16 → 10**

El autoencoder comprime las diez entradas a un espacio latente de dos dimensiones e intenta reconstruirlas. Se entrena exclusivamente con las muestras del Modelo Estándar, minimizando el error cuadrático medio (MSE) con Adam. El escalado se ajusta con los eventos de entrenamiento.

A diferencia del clasificador ATLAS, la salida no es una puntuación aprendida para distinguir Higgs de fondo. Son diez valores reconstruidos; el error entre entradas y reconstrucciones se utiliza para estudiar eventos poco compatibles con lo aprendido.

Con los YAML personales de este ejemplo ya preparados, consultar sus rutas y ejecutar la referencia:

```bash
python workshop/student.py files
python workshop/student.py train --task autoencoder --role baseline
```

Estos comandos corresponden a la configuración del ejercicio CMS. No se utiliza `atlas_baseline01.yaml` ni el script de entrenamiento ATLAS. Consultar el [procedimiento de configuración CMS](https://castaned.github.io/ML-integration-CMSSW/open-data/05_autoencoder/) para preparar el ejemplo antes de ejecutar.

## 5. Reproducir y comparar la referencia {#benchmark-cms}

La primera ejecución utiliza el YAML de referencia completo, antes de estudiar cambios de arquitectura. Reproducir la selección y la extracción con los archivos de entrada de esa referencia, comprobar las diez variables y ejecutar el entrenamiento. Conservar el YAML y los productos de esa primera corrida.

### Benchmark inicial del ejercicio

El benchmark adoptado para este ejercicio es la configuración inicial de diez variables y arquitectura **10 → 16 → 8 → 2 → 8 → 16 → 10**. Su ejecución en Yuca el 9 de octubre de 2026 produjo los siguientes resultados con DYJets HT 70–100, WZ y ZZ, semilla 16 y una muestra W′ de 320 eventos para evaluación:

| Magnitud | Benchmark inicial | Tu ejecución |
| --- | ---: | --- |
| Entradas de la red | 10 | Registrar |
| Eventos SM de entrenamiento | 4 019 | Registrar |
| Eventos SM de validación | 1 340 | Registrar |
| Eventos SM de prueba | 1 340 | Registrar |
| Eventos W′ de evaluación | 320 | Registrar |
| Percentil de validación SM | 99 | Registrar |
| Umbral de MSE | 3.19375 | Registrar |
| Fracción SM seleccionada en prueba | 2.09 % | Registrar |
| Fracción SM seleccionada, promediada por proceso | 1.07 % | Registrar |
| Eficiencia W′ al umbral de referencia | 34.69 % | Registrar |
| AUC de evaluación | 0.97041 | Registrar |

[Descargar las métricas del benchmark inicial](assets/benchmarks/cms_10features_pilot.json).

Para reproducir este benchmark, conservar los archivos de entrada, la selección, las variables, el escalado, las particiones y los parámetros del YAML de referencia. Comparar primero los conteos de eventos: si no coinciden, revisar la extracción antes de interpretar las diferencias en las métricas.

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

### Antes de realizar una variación

Comparar primero los conteos y las variables, después las pérdidas y las distribuciones del error. Registrar la corrida inicial y conservarla. Una modificación posterior utilizará una copia del YAML y una carpeta de salida diferente, con los mismos eventos y particiones.

La reproducción del benchmark incluye su evaluación W′. Para estudiar cambios del modelo, utilizar la validación SM; las cifras W′ no se emplean como objetivo para seleccionar la arquitectura.

## 6. Interpretación de los resultados

Abrir las curvas de pérdida de entrenamiento y validación y las distribuciones de MSE por proceso. Identificar en el YAML la carpeta de salida del autoencoder y conservarla separada de las corridas ATLAS.

| ATLAS: clasificación | CMS: reconstrucción |
| --- | --- |
| Aprende usando etiquetas de señal y fondo | Aprende a reconstruir eventos del Modelo Estándar |
| La puntuación favorece señal o fondo | El MSE cuantifica el error de reconstrucción |
| Se comparan AUC, AMS interna y tiempo | Se comparan pérdidas, errores por proceso y tiempo |
| Higgs aparece durante el entrenamiento | W′ se utiliza únicamente para evaluación |

Un error elevado puede deberse a un evento diferente de la referencia, a una descripción insuficiente del fondo o a problemas de reconstrucción. No constituye por sí mismo evidencia de nueva física. Las muestras del piloto tienen tamaños distintos; los pesos iguales por proceso no representan tasas físicas por luminosidad.

La muestra W′ permite ilustrar la respuesta del modelo. Si se consulta repetidamente para decidir arquitectura o variables, el resultado debe considerarse exploratorio. Sus métricas no se mezclan con la tabla de clasificación ATLAS.

**Preguntas de análisis:** ¿en qué paso se construyen las variables? ¿Qué información se necesita para entrenar cada red? ¿Por qué un error alto y una puntuación alta de clasificación tienen significados diferentes?

[Inicio: comparación de los dos ejercicios](index.md#dos-ejercicios-con-cern-open-data) · [Ejercicio 1: ATLAS](laboratorio.md)
