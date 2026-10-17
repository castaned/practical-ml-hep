---
hide:
  - navigation
  - toc
---

<div class="course-hero" markdown>

<div class="hero-copy" markdown>

<span class="course-kicker">Universidad de Sonora · Curso práctico</span>

# Aprendizaje automático en física de partículas

Análisis de datos de física de partículas con CERN Open Data y el clúster Yuca: desde la preparación de los datos hasta la interpretación de resultados.

<p class="course-affiliation">Cómputo en CPU y GPU del clúster Yuca<br>ACARUS · Universidad de Sonora</p>

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

En el curso practicaremos las etapas de un análisis de física experimental de partículas: partir de una fuente de datos, procesarlos en un clúster, estudiar observables y extraer conclusiones. Las redes neuronales son una herramienta opcional dentro de este flujo; en los dos ejercicios las utilizaremos con objetivos distintos.

![Flujo de análisis: datos, procesamiento en Yuca, observables e interpretación, con entrenamiento de redes neuronales como etapa opcional](assets/workshop/experimental_analysis_flow.svg)

El recorrido directo permite analizar distribuciones y selecciones. La rama inferior incorpora el entrenamiento y la evaluación de una red. En ambos casos, las conclusiones se sustentan en los resultados y sus limitaciones. Trabajaremos con **simulaciones abiertas de ATLAS y CMS**, disponibles en CERN Open Data.

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

## Software y archivos de configuración

El software del curso está disponible en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW). Mediante archivos **YAML** podrás configurar el procesamiento de los datos, definir la arquitectura y los parámetros de entrenamiento de las redes, y elegir dónde guardar tus resultados.

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
