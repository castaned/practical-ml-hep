---
hide:
  - navigation
  - toc
---

<div class="course-hero" markdown>

<div class="event-presentation">
<img src="assets/event/dpyc-smf.png" alt="División de Partículas y Campos de la Sociedad Mexicana de Física" width="100" height="120">
<div class="event-presentation-copy">
<p class="event-name">XXI Mexican School on Particles and Fields</p>
<p class="event-details"><strong>19–23 de octubre de 2026</strong><span> · Puebla, México</span></p>
<p class="event-venue">Edificio Carolino · Ciudad Universitaria 2</p>
<a href="https://indico.nucleares.unam.mx/event/2675/timetable/">Agenda oficial del evento</a>
</div>
</div>

<div class="hero-copy" markdown>

<span class="course-kicker">Taller práctico</span>

# Practical Machine Learning for HEP Data Analysis

Análisis de datos abiertos de ATLAS y CMS con redes neuronales.



</div>

<div class="hero-art" markdown>

![Ilustración conceptual de un detector de partículas conectado mediante datos y una red neuronal a un centro de supercómputo](assets/workshop/hep_ml_supercomputing_hero.webp)

<span>Física de partículas · Ciencia de datos · Supercómputo</span>

</div>

</div>

<div class="open-data-intro">
<a class="open-data-brand" href="https://opendata.cern.ch/" aria-label="Visitar el portal CERN Open Data">
<img src="assets/cern-open-data/logo-blue.png" alt="CERN Open Data" width="196" height="64">
<span>Portal de datos abiertos</span>
</a>
<div class="open-data-copy">
<h2>CERN Open Data</h2>
<p>El portal reúne datos de experimentos de física de partículas, software y documentación para su análisis. Este acceso permite trabajar con muestras abiertas y reproducir estudios de procesos físicos.</p>
<p>En el taller utilizaremos simulaciones de <strong>ATLAS y CMS</strong> para recorrer las etapas del análisis, desde los datos de origen hasta la interpretación de los resultados.</p>
<a href="https://opendata.cern.ch/">Explorar el portal oficial →</a>
<p class="open-data-credit">Logotipo: CERN Open Data.</p>
</div>
</div>

## El flujo de un análisis experimental

En el curso practicaremos las etapas de un análisis de física experimental de partículas: partir de una fuente de datos, procesarlos en un clúster, estudiar observables y extraer conclusiones. El entrenamiento de redes neuronales forma parte del recorrido de los dos ejercicios, con un énfasis diferente en cada uno.

### Arquitectura de los ejercicios {#aplicacion-a-los-ejercicios-del-curso}

[![Flujo de datos, procesamiento, entrenamiento, evaluación y almacenamiento de resultados en Yuca para ATLAS y CMS](assets/workshop/hep_framework_atlas_cms_v2.svg)](assets/workshop/hep_framework_atlas_cms_v2.svg)

## Datos, infraestructura y software de análisis

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

## Programa del taller

**20, 21 y 23 de octubre de 2026 · Sala de Proyecciones, Edificio Carolino, Puebla.** Horarios en hora local de Puebla.

<div class="workshop-agenda workshop-agenda-three">
<article class="agenda-day">
<header class="agenda-day-header"><h3>Martes 20</h3><span class="agenda-duration">1 h 15 min</span></header>
<ol class="agenda-stages">
<li><span class="agenda-time">11:45–13:00</span><h4>Introducción y preparación</h4><p>Flujo de análisis, acceso a Yuca, física del Higgs y variables de entrada.</p></li>
</ol>
</article>
<article class="agenda-day">
<header class="agenda-day-header"><h3>Miércoles 21</h3><span class="agenda-duration">2 h 45 min</span></header>
<ol class="agenda-stages">
<li><span class="agenda-time">15:30–16:45 · 1 h 15 min</span><h4>Benchmark ATLAS</h4><p>Entrenamiento de la red inicial, seguimiento de su avance y revisión de figuras y métricas.</p></li>
<li><span class="agenda-time">17:00–18:30 · 1 h 30 min</span><h4>Variaciones del entrenamiento</h4><p>Cambios en el YAML por estudiante o grupo y comparación con la referencia.</p></li>
</ol>
</article>
<article class="agenda-day agenda-day-second">
<header class="agenda-day-header"><h3>Viernes 23</h3><span class="agenda-duration">1 h 15 min</span></header>
<ol class="agenda-stages">
<li><span class="agenda-time">11:45–13:00</span><h4>Discusión y análisis CMS</h4><p>Comparación de resultados ATLAS y recorrido CMS: procesamiento NanoAOD, variables y autoencoder.</p></li>
</ol>
</article>
</div>

[Comenzar con el acceso y la preparación](preparacion.md){ .md-button .md-button--primary }
