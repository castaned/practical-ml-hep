---
hide:
  - navigation
  - toc
---

<div class="course-hero" markdown>

<div class="hero-copy" markdown>

<span class="course-kicker">Universidad de Sonora · Curso práctico</span>

# Practical Machine Learning for HEP Data Analysis

Análisis de datos abiertos de ATLAS y CMS con redes neuronales en Yuca.

<p class="course-affiliation">Yuca · ACARUS / UNISON · CPU y GPU</p>

<div class="course-links" markdown>

[Acceso y preparación](preparacion.md){ .md-button .md-button--primary }
[Ejercicio ATLAS](laboratorio.md){ .md-button .hero-secondary }
[Ejercicio CMS](autoencoder.md){ .md-button .hero-secondary }

</div>

</div>

<div class="hero-art" markdown>

![Del Higgs a un leptón, hadrones y tres neutrinos](assets/workshop/higgs_tautau_final_state.svg)

<span>Figura 1. Decaimiento H → ττ en el canal leptón–tau hadrónico.</span>

</div>

</div>

## El flujo de un análisis experimental

En el curso practicaremos las etapas de un análisis de física experimental de partículas: partir de una fuente de datos, procesarlos en un clúster, estudiar observables y extraer conclusiones. El entrenamiento de redes neuronales forma parte del recorrido de los dos ejercicios, con un énfasis diferente en cada uno.

### Arquitectura de los ejercicios {#aplicacion-a-los-ejercicios-del-curso}

![Arquitectura del análisis: CERN Open Data como fuente, Yuca como entorno de ejecución y marcos de énfasis ATLAS y CMS](assets/workshop/hep_framework_atlas_cms.svg)

El marco exterior representa **Yuca**. Dentro de él, el marco verde destaca el entrenamiento y la evaluación de **ATLAS**; el violeta incluye el procesamiento y el entrenamiento de **CMS**. Ambos utilizan el software **ML-integration-CMSSW**, con entradas de distinto formato procedentes de CERN Open Data.

[ATLAS: física y benchmark](fisica.md){ .md-button .md-button--primary }
[CMS: procesamiento y autoencoder](autoencoder.md){ .md-button }

## Datos, infraestructura y software de análisis

**CERN Open Data** proporciona las muestras con las que estudiaremos los procesos físicos. Su disponibilidad permite reproducir análisis y explorar herramientas utilizadas en física de partículas.

<div class="yuca-profile">
<div class="yuca-description">
<h3>Yuca · Cómputo de alto rendimiento en la UNISON</h3>
<p>El clúster Yuca, operado por el Área de Cómputo de Alto Rendimiento (ACARUS) de la Universidad de Sonora, aporta la infraestructura para procesar las muestras y entrenar los modelos del curso.</p>
<p>Un clúster reúne nodos de cómputo que permiten distribuir tareas. En un análisis de partículas, esto facilita procesar distintos archivos de eventos y comparar entrenamientos. Las CPU realizan tareas generales y las GPU pueden acelerar los cálculos de las redes neuronales.</p>
<dl class="yuca-capacity">
<div><dt>24 nodos CPU</dt><dd>Procesamiento de datos</dd></div>
<div><dt>6 nodos GPU · MI210</dt><dd>Cómputo acelerado</dd></div>
<div><dt>36.77 TB de RAM</dt><dd>Memoria total publicada</dd></div>
<div><dt>3.25 PB</dt><dd>Almacenamiento HDD y SSD</dd></div>
</dl>
<p class="yuca-source">Capacidades globales publicadas por ACARUS. <a href="https://acarus.unison.mx/hardware/">Ficha oficial de hardware de Yuca</a>.</p>
</div>
<figure>
<img src="assets/yuca/yuca-acarus.jpeg" alt="Gabinetes del clúster Yuca de ACARUS en la Universidad de Sonora" width="739" height="865" loading="lazy">
<figcaption>Clúster Yuca. Fotografía: <a href="https://acarus.unison.mx/hardware/">ACARUS · Universidad de Sonora</a>.</figcaption>
</figure>
</div>

**[ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW)** reúne las herramientas de análisis que conectan los datos con los resultados: selección de eventos, construcción de variables y entrenamiento de modelos. Una configuración documentada permite repetir el análisis y estudiar el efecto de sus cambios.

Los ejercicios de ATLAS y CMS muestran cómo se combinan estos componentes para responder una pregunta física. Las redes neuronales forman parte de las herramientas disponibles; sus resultados deben interpretarse a partir del proceso estudiado y de las condiciones del análisis.

<div class="course-facts" markdown>

<div><strong>30</strong><span>variables para explorar</span></div>
<div><strong>250 mil</strong><span>eventos para desarrollar el modelo</span></div>
<div><strong>CPU ↔ GPU</strong><span>comparación de tiempos de entrenamiento</span></div>
<div><strong>1 YAML</strong><span>por experimento; una carpeta por resultado</span></div>

</div>

!!! info "Primer paso: preparar tu acceso y tu cuenta"
    La [preparación inicial en Yuca](preparacion.md) explica el primer SSH, la doble verificación, cómo trabajar desde Open OnDemand o JupyterLab y cómo solicitar recursos de ACARUS. Esta preparación es necesaria antes de iniciar los ejercicios.

## Dos ejercicios con CERN Open Data

Los dos ejercicios siguen el esquema anterior. En ATLAS comenzamos con variables ya calculadas; en CMS realizamos también la selección de eventos y la extracción de observables desde NanoAOD.

| | Ejercicio 1 · ATLAS Higgs Challenge | Ejercicio 2 · Autoencoder CMS |
| --- | --- | --- |
| Datos de origen | Tabla CSV comprimida (`.csv.gz`) del challenge | Archivos ROOT en formato NanoAOD (`.root`) |
| Contenido | Una fila por evento, con 30 variables físicas ya calculadas | Colecciones de partículas reconstruidas y propiedades del evento |
| Procesamiento | Lectura de la tabla, tratamiento de valores ausentes y estandarización | Selección de eventos, reconstrucción de candidatos W/Z, cálculo de observables y conversión a HDF5 |
| Modelo | Red completamente conectada de clasificación supervisada | Autoencoder entrenado con eventos del Modelo Estándar |
| Objetivo | Distinguir Higgs → ττ de los procesos de fondo | Estudiar eventos con errores de reconstrucción elevados |
| Evaluación | Curva ROC, AUC y AMS interna | Pérdidas y distribuciones del error de reconstrucción; W′ como referencia de evaluación |
| Lugar en el curso | Actividad principal del miércoles | Extensión para mostrar el análisis desde NanoAOD |

**ATLAS · Higgs:** tabla de variables → preparación en Yuca → clasificador de señal y fondo → comparación de entrenamientos y conclusiones.

**CMS · Anomalías:** NanoAOD → selección y extracción de variables en Yuca → HDF5 → autoencoder → estudio del error de reconstrucción y conclusiones.

[Ejercicio 1: ATLAS Higgs Challenge](fisica.md){ .md-button .md-button--primary }
[Ejercicio 2: autoencoder CMS](autoencoder.md){ .md-button }

En ambos ejercicios se comienza reproduciendo una configuración de referencia. Sus conteos, figuras y métricas se revisan antes de introducir cambios; esa ejecución se conserva para comparar las variaciones.

## Objetivos del ejercicio ATLAS

El ejercicio principal consiste en distinguir la señal **Higgs → ττ** de los procesos de fondo mediante el **ATLAS Higgs Challenge**, un conjunto de simulaciones disponible en CERN Open Data.

Se estudiará el efecto de la arquitectura y de los parámetros de entrenamiento sobre la discriminación entre señal y fondo, el sobreajuste y el tiempo de cómputo. Cada configuración se conservará junto con sus resultados para comparar los experimentos.

<div class="journey-grid">
<a class="journey-card" href="fisica/">
<span class="step-number">01 / MOTIVACIÓN FÍSICA</span>
<h3>Procesos y observables</h3>
<p>Producción y decaimiento del Higgs, procesos de fondo y variables de entrada.</p>
<span class="card-link">Consultar la física →</span>
</a>
<a class="journey-card" href="laboratorio/">
<span class="step-number">02 / BENCHMARK</span>
<h3>Entrenamiento de referencia</h3>
<p>Arquitectura inicial, ejecución en Yuca y revisión de los archivos de resultados.</p>
<span class="card-link">Reproducir el benchmark →</span>
</a>
<a class="journey-card" href="variaciones/">
<span class="step-number">03 / EXPERIMENTOS</span>
<h3>Variaciones e interpretación</h3>
<p>Modificaciones del YAML por grupo, registro de métricas y comparación de los entrenamientos.</p>
<span class="card-link">Realizar las variaciones →</span>
</a>
<a class="journey-card" href="conclusiones/">
<span class="step-number">04 / CONCLUSIONES</span>
<h3>Discusión de resultados</h3>
<p>Síntesis de la comparación, evidencia de las figuras y limitaciones de las conclusiones.</p>
<span class="card-link">Preparar la discusión →</span>
</a>
</div>

## Durante la sesión

Trabajaremos individualmente o en grupos cercanos, según la disposición del salón. Todos partimos de una referencia y probamos al menos una variación. Si hay tiempo, exploramos una segunda idea.

<div class="session-strip" markdown>

**Miércoles · 3 horas**<br>Dos horas de configuración, introducción y benchmark. Una hora de [variaciones por grupos y discusión](variaciones.md).

**Jueves · 1 hora**<br>Comparación de resultados y exploración de un autoencoder CMS.

</div>

<div class="closing-callout" markdown>

### Presentación de resultados

Cada grupo presentará la configuración estudiada, su comparación con la referencia y las conclusiones sustentadas por los resultados.

[Preparar mi cuenta](preparacion.md){ .md-button }
[Manual técnico de la herramienta](https://castaned.github.io/ML-integration-CMSSW/){ .text-link }

</div>

El código de entrenamiento y los YAML se mantienen en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop). Este sitio reúne el material docente. Cómputo en **ACARUS / Yuca, Universidad de Sonora**. Figuras publicadas y fuentes identificadas en el [capítulo de física](fisica.md#procedencia-de-las-imagenes).
