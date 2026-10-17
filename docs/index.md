---
hide:
  - navigation
  - toc
---

<div class="course-hero" markdown>

<div class="hero-copy" markdown>

<span class="eyebrow">CERN OPEN DATA · FÍSICA · EXPERIMENTACIÓN</span>

# Aprendizaje automático<br>en física de partículas

Curso práctico de clasificación de eventos del ATLAS Higgs Challenge con redes neuronales.

**Entrenamiento en CPU y GPU del clúster Yuca de ACARUS, Universidad de Sonora.**

[Explorar la física](fisica.md){ .md-button .md-button--primary }
[Ir al laboratorio](laboratorio.md){ .md-button .hero-secondary }

</div>

<div class="hero-art" markdown>

![Del Higgs a un leptón, hadrones y tres neutrinos](assets/workshop/higgs_tautau_final_state.svg)

<span>Canal de estudio: H → ττ, con un leptón y un tau hadrónico en el estado final visible.</span>

</div>

</div>

<div class="course-facts" markdown>

<div><strong>30</strong><span>variables para explorar</span></div>
<div><strong>250 mil</strong><span>eventos para desarrollar el modelo</span></div>
<div><strong>CPU ↔ GPU</strong><span>comparación de tiempos de entrenamiento</span></div>
<div><strong>1 YAML</strong><span>por experimento; una carpeta por resultado</span></div>

</div>

!!! info "Primer paso: preparar tu acceso y tu cuenta"
    La [preparación inicial en Yuca](preparacion.md) explica el primer SSH, la doble verificación, cómo trabajar desde Open OnDemand o JupyterLab y cómo solicitar recursos de ACARUS. Esta preparación es necesaria antes de iniciar los ejercicios.

## Objetivos del curso

El ejercicio principal consiste en distinguir la señal **Higgs → ττ** de los procesos de fondo mediante el **ATLAS Higgs Challenge**, un conjunto de simulaciones disponible en CERN Open Data.

Se estudiará el efecto de la arquitectura y de los parámetros de entrenamiento sobre la discriminación entre señal y fondo, el sobreajuste y el tiempo de cómputo. Cada configuración se conservará junto con sus resultados para comparar los experimentos.

<div class="journey-grid" markdown>

<a class="journey-card" href="fisica/">
<span class="step-number">01 / ENTENDER</span>
<h3>Procesos y observables</h3>
<p>Descripción de la señal, los procesos de fondo y las 30 variables de entrada.</p>
<span class="card-link">Explorar el proceso →</span>
</a>

<a class="journey-card" href="laboratorio/">
<span class="step-number">02 / EXPERIMENTAR</span>
<h3>Entrenamiento de la red</h3>
<p>Configuración de capas, neuronas y parámetros de entrenamiento mediante archivos YAML.</p>
<span class="card-link">Entrar al laboratorio →</span>
</a>

<a class="journey-card" href="bitacora/">
<span class="step-number">03 / INTERPRETAR</span>
<h3>Registro de resultados</h3>
<p>Comparación de curvas de aprendizaje, métricas de clasificación y tiempos de ejecución.</p>
<span class="card-link">Abrir la bitácora →</span>
</a>

<a class="journey-card" href="conclusiones/">
<span class="step-number">04 / DISCUTIR</span>
<h3>Análisis y conclusiones</h3>
<p>Discusión de las diferencias observadas y de las limitaciones de cada configuración.</p>
<span class="card-link">Compartir conclusiones →</span>
</a>

</div>

## Configuración de la arquitectura

<div class="network-explorer" data-network-explorer>
<div class="explorer-intro">
<span class="eyebrow">ARQUITECTURAS DE REFERENCIA</span>
<h3>Capas y parámetros entrenables</h3>
<p>El selector muestra el número de parámetros de cada arquitectura y el fragmento YAML correspondiente. El entrenamiento se ejecuta en Yuca.</p>
<label for="network-choice">Arquitectura</label>
<select id="network-choice">
<option value="baseline">Referencia · cuatro capas</option>
<option value="wide">Más ancha · cuatro capas</option>
<option value="deep">Más profunda · ocho capas</option>
</select>
<label for="dropout-choice">Dropout <output id="dropout-value">0.1</output></label>
<input id="dropout-choice" type="range" min="0" max="0.5" step="0.1" value="0.1">
<p class="explorer-hint">El aumento del número de parámetros puede modificar el tiempo de entrenamiento y el sobreajuste. Su efecto sobre la clasificación se evaluará con las mismas particiones de datos.</p>
</div>
<div class="explorer-result">
<div class="network-layers" id="network-layers" aria-label="Capas de la red elegida"></div>
<p class="parameter-count"><strong id="parameter-count">14 849</strong> parámetros entrenables</p>
<pre><code id="network-yaml">model:
  hidden_dims: [128, 64, 32, 16]
  dropout: 0.1</code></pre>
<button type="button" id="copy-network">Copiar fragmento YAML</button>
<p id="copy-status" role="status">Conserva el resto de tu YAML y elige una carpeta nueva para cada corrida.</p>
</div>
</div>

## Distribuciones de las variables

<div class="figure-story" markdown>

<div markdown>

<span class="eyebrow">DEL EVENTO AL APRENDIZAJE</span>

### Comparación entre señal y fondo

Las distribuciones permiten identificar diferencias entre señal y fondo. La red utiliza además las correlaciones entre las variables para realizar la clasificación.

Antes del entrenamiento se revisará el significado físico de las variables y su capacidad de discriminación.

[Conocer las 30 variables](fisica.md#las-30-variables-organizadas-por-su-significado){ .text-link }

</div>

![Ejemplos reales de seis variables del conjunto de entrenamiento](assets/workshop/atlas_variables_01.png)

</div>

## Durante la sesión

Trabajaremos individualmente o en grupos cercanos, según la disposición del salón. Todos partimos de una referencia y probamos al menos una variación. Si hay tiempo, exploramos una segunda idea.

<div class="session-strip" markdown>

**Miércoles · 3 horas**<br>Introducción física, entrenamiento de referencia, variaciones del YAML y discusión por grupos. [Consultar el programa](laboratorio.md#programa-del-miercoles-tres-horas).

**Jueves · 1 hora**<br>Comparación de resultados y exploración de un autoencoder CMS.

</div>

<div class="closing-callout" markdown>

### Presentación de resultados

Cada grupo presentará la configuración estudiada, su comparación con la referencia y las conclusiones sustentadas por los resultados.

[Preparar mi cuenta](preparacion.md){ .md-button }
[Manual técnico de la herramienta](https://castaned.github.io/ML-integration-CMSSW/){ .text-link }

</div>

El código de entrenamiento y los YAML se mantienen en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop). Este sitio reúne el material docente. Cómputo en **ACARUS / Yuca, Universidad de Sonora**. Figuras publicadas y fuentes identificadas en el [capítulo de física](fisica.md#procedencia-de-las-imagenes).
