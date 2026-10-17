# Demostración CMS · Búsqueda de anomalías desde NanoAOD

Esta demostración presenta un análisis ya desarrollado con simulaciones de **CMS disponibles en CERN Open Data**: desde los eventos NanoAOD hasta el entrenamiento de un autoencoder y su evaluación frente a una posible señal de nueva física. El punto de partida es el benchmark alcanzado con diez variables.

El recorrido complementa al Higgs Challenge. En ATLAS entrenamos un clasificador con variables preparadas; aquí seguimos también la selección de eventos y la construcción de las entradas de una red que aprende a reconstruirlos. El procesamiento y el entrenamiento utilizan [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev), configurado mediante YAML.

## Motivación física: del sector electrodébil a una posible resonancia

Los bosones **W y Z** son mediadores de la interacción débil. Sus decaimientos pueden producir electrones, muones y neutrinos, dando lugar a estados finales multileptónicos que podemos estudiar en CMS.

Algunas extensiones del Modelo Estándar proponen un bosón cargado más pesado, **W′**, que podría decaer en W y Z. En esta demostración usamos una simulación de W′ de **1 TeV y anchura estrecha** como señal de prueba. Es una hipótesis de evaluación, no una partícula observada en estos datos.

![Producción de una resonancia W′ y decaimiento a WZ, con tres leptones y un neutrino en el estado final](assets/cms/wprime_decay.png){ width="580" }

*W′ → WZ → 3ℓν. En el canal ilustrado, Z produce dos leptones de cargas opuestas y W un leptón y un neutrino; ℓ representa un electrón o un muón. Se considera también el canal conjugado de carga.*

[Ampliar o descargar el diagrama PDF](assets/cms/wprime_decay.pdf).

En el detector esperamos **tres leptones cargados y momento transversal faltante**, relacionado con el neutrino que no se detecta directamente. La producción habitual de WZ puede producir el mismo estado final. La pregunta es si una red entrenada con procesos conocidos responde de forma diferente a eventos de la señal W′. Este estado final se utiliza también en [búsquedas de resonancias de CMS](https://cms-results.web.cern.ch/cms-results/public-results/publications/EXO-12-025/index.html).

## ¿Por qué utilizar un autoencoder?

El clasificador ATLAS aprende a distinguir dos clases usando ejemplos etiquetados de Higgs y fondo. El autoencoder CMS **aprende únicamente con eventos del Modelo Estándar**: comprime sus variables y trata de reconstruirlas.

Después comparamos cada evento con su reconstrucción. Un error grande puede señalar una configuración poco habitual para la red. La muestra W′ permite comprobar la respuesta ante una señal concreta, aunque el modelo no la haya utilizado para aprender. Esta estrategia motiva la búsqueda de anomalías sin entrenar un clasificador específico para W′.

## Características del ejercicio

| Aspecto | Autoencoder CMS |
| --- | --- |
| Datos de origen | Archivos ROOT en formato NanoAOD (`.root`) |
| Contenido | Colecciones de partículas reconstruidas y propiedades del evento |
| Procesamiento | Selección de eventos, reconstrucción de candidatos W/Z, cálculo de observables y conversión a HDF5 |
| Modelo | Autoencoder entrenado con eventos del Modelo Estándar |
| Objetivo | Estudiar eventos con errores de reconstrucción elevados |
| Evaluación | Pérdidas y distribuciones del error de reconstrucción; W′ como referencia de evaluación |
| Lugar en el curso | Demostración guiada de un análisis ya desarrollado desde NanoAOD |

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

Las diez entradas describen la energía transversal del evento, los candidatos W/Z y la geometría de sus decaimientos. Las cantidades de momento y masa se expresan en **GeV**; `Z_deltaR` es adimensional.

| Variable en el YAML | Significado físico |
| --- | --- |
| `MET_pt` | Magnitud del momento transversal faltante: desequilibrio asociado, entre otras contribuciones, al neutrino |
| `M3l` | Masa invariante de los tres leptones cargados; no incluye el neutrino y no es la masa completa de W′ |
| `Lep_pt_sum` | Suma escalar de los momentos transversales de los tres leptones |
| `Z_mass` | Masa invariante del par de leptones asignado al candidato Z |
| `Z_pt` | Momento transversal del candidato Z |
| `Z_deltaR` | Separación angular entre los dos leptones del candidato Z; describe cuán próximos están |
| `Lep1Z_pt`, `Lep2Z_pt` | Momentos transversales de los dos leptones asignados a Z |
| `Lep3W_pt` | Momento transversal del leptón asignado a W |
| `W_mt` | Masa transversal construida con el leptón de W y el momento transversal faltante |

Una resonancia pesada puede producir bosones con mayor momento transversal y modificar la geometría de sus decaimientos. Las variables permiten explorar esas diferencias y sus correlaciones; ninguna por sí sola identifica una nueva partícula.

`Dataset_ID` identifica el proceso de origen y permite separar las muestras. No es una variable de entrada de la red.

## 4. Red y entrenamiento

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

## 5. Benchmark alcanzado {#benchmark-cms}

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

## 6. Interpretación de los resultados

La demostración revisa las pérdidas de entrenamiento y validación, las distribuciones de MSE por proceso y la ROC frente a W′. Sus resultados se mantienen separados de las corridas ATLAS.

| ATLAS: clasificación | CMS: reconstrucción |
| --- | --- |
| Aprende usando etiquetas de señal y fondo | Aprende a reconstruir eventos del Modelo Estándar |
| La puntuación favorece señal o fondo | El MSE cuantifica el error de reconstrucción |
| Se comparan AUC, AMS interna y tiempo | Se comparan pérdidas, errores por proceso y tiempo |
| Higgs aparece durante el entrenamiento | W′ se utiliza únicamente para evaluación |

Un error elevado puede deberse a un evento diferente de la referencia, a una descripción insuficiente del fondo o a problemas de reconstrucción. No constituye por sí mismo evidencia de nueva física. Las muestras del piloto tienen tamaños distintos; los pesos iguales por proceso no representan tasas físicas por luminosidad.

Si W′ presenta errores mayores que los procesos SM, un umbral de MSE puede enriquecer una selección en esa señal. Para convertirlo en una búsqueda física harían falta las normalizaciones e incertidumbres del fondo y una evaluación estadística. La AUC de este ejemplo resume la separación frente a esta muestra W′; no mide una capacidad universal de descubrir cualquier anomalía.

La muestra W′ permite ilustrar la respuesta del modelo. Si se consulta repetidamente para decidir arquitectura o variables, el resultado debe considerarse exploratorio. Sus métricas no se mezclan con la tabla de clasificación ATLAS.

### Posibles mejoras para una exploración posterior

Estas propuestas quedan como continuación del estudio, no como una actividad de entrenamiento obligatoria del taller.

| Variación posible | Qué permitiría investigar |
| --- | --- |
| Anchura de las capas y dimensión latente | Si cambia la reconstrucción SM y la capacidad de distinguir eventos diferentes |
| Variables de entrada | Qué información física añade cada observable y cómo influye su escala |
| Duración, tasa de aprendizaje y tamaño de lote | Si el entrenamiento converge y generaliza de forma estable |
| Más simulación y composición del fondo | Si la respuesta se mantiene con mayor estadística y mejor representación de los procesos |

Cada estudio requeriría conservar su configuración y una carpeta de resultados propia. Las decisiones se apoyarían primero en la validación SM; una evaluación independiente permitiría comprobar después si la mejora se mantiene frente a W′.

**Preguntas para la discusión:** ¿en qué paso se construyen las variables? ¿Qué información se necesita para entrenar cada red? ¿Por qué un error alto y una puntuación alta de clasificación tienen significados diferentes?

[Inicio: comparación de los dos ejercicios](index.md#dos-ejercicios-con-cern-open-data) · [Ejercicio 1: ATLAS](laboratorio.md)


<div class="image-credits" markdown>

**Procedencia de las imágenes.** El diagrama W′ fue proporcionado para este taller y se conserva en PDF; la imagen de la página es una conversión de ese archivo. El esquema del autoencoder es una visualización didáctica de la arquitectura implementada en el repositorio principal. No son resultados oficiales de CMS. Los resultados numéricos proceden de la corrida del piloto recogida en el [archivo de métricas](assets/benchmarks/cms_10features_pilot.json).

</div>
