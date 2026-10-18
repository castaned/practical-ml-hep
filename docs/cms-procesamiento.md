# CMS · Procesamiento desde NanoAOD

## Datos públicos como punto de partida

Los archivos originales son **simulaciones NanoAOD de CMS**, disponibles públicamente en [CERN Open Data](https://opendata.cern.ch/). Cualquier persona puede buscar las muestras y descargarlas desde el portal. En este taller ya están disponibles en la carpeta compartida de Yuca.

El repositorio [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev) contiene el código que procesa esos eventos; los YAML definen las entradas y las carpetas de salida personales.

| Etapa | Qué ocurre |
| --- | --- |
| NanoAOD / ROOT | Se leen colecciones de partículas y propiedades de cada evento simulado |
| Selección | Se identifican eventos con al menos tres leptones y candidatos W/Z |
| Observables | Se calculan masas, momentos y separaciones angulares |
| Gráficos y cutflow | Se revisan los eventos seleccionados y las distribuciones |
| HDF5 y mapa de datasets | Se guardan las variables y la identificación de cada proceso para el entrenamiento |

En ATLAS recibimos una tabla de variables ya calculadas. **Aquí construimos esas entradas a partir de los eventos**: este paso permite entender cómo las decisiones del análisis físico llegan a la red neuronal.

## Selección y extracción de variables

**NanoAOD (ROOT) → selección multileptónica → candidatos W/Z y observables → gráficos de control → HDF5**

La selección de eventos con al menos tres leptones está implementada en `example_files/main_process/filterNanoAOD.py`, dentro del repositorio principal. El procesamiento construye candidatos Z y W y calcula las cantidades que recibirá la red. El cutflow permite seguir cuántos eventos sobreviven a cada selección.

La [guía de procesamiento CMS](https://castaned.github.io/ML-integration-CMSSW/open-data/03_procesamiento/) contiene el procedimiento de ejecución. Los archivos originales se leen de la carpeta compartida; los productos del procesamiento se guardan en la cuenta personal.

| Producto | Función en el análisis |
| --- | --- |
| ROOT procesado | Eventos seleccionados y observables calculados |
| Cutflow y gráficos | Revisión de la selección y las distribuciones |
| HDF5 | Variables de los eventos seleccionados, preparadas para lectura durante el entrenamiento |
| Mapa de datasets | Asociación entre identificadores y procesos físicos |

HDF5 es un producto del análisis; los archivos de origen de este ejercicio son los NanoAOD. Se puede reutilizar una extracción ya preparada para estudiar el entrenamiento, conservando la trazabilidad hasta los archivos ROOT y la selección utilizada.

[Anterior: Física y variables](cms-fisica.md){ .md-button }
[Continuar: Autoencoder y benchmark](cms-autoencoder.md){ .md-button .md-button--primary }
