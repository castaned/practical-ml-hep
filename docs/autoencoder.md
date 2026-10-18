# CMS · Búsqueda de anomalías desde NanoAOD

Este ejemplo recorre un análisis desarrollado con **simulaciones públicas de CMS en CERN Open Data**: selección de eventos NanoAOD, extracción de variables, entrenamiento de un autoencoder e interpretación de su respuesta ante W′.

El autoencoder utiliza diez variables y aprende a reconstruir eventos del Modelo Estándar. La muestra W′ permite evaluar su respuesta ante una señal que no participó en el entrenamiento.

<div class="journey-grid">
<a class="journey-card" href="../cms-fisica/"><span class="step-number">01 / FÍSICA</span><h3>Procesos y variables</h3><p>La señal W′, los procesos conocidos y las entradas del autoencoder.</p><span class="card-link">Consultar sección →</span></a>
<a class="journey-card" href="../cms-procesamiento/"><span class="step-number">02 / DATOS</span><h3>Procesamiento NanoAOD</h3><p>Desde los eventos públicos hasta la selección y las variables en HDF5.</p><span class="card-link">Consultar sección →</span></a>
<a class="journey-card" href="../cms-autoencoder/"><span class="step-number">03 / RED</span><h3>Autoencoder y benchmark</h3><p>Compresión, reconstrucción y resultados de la configuración inicial.</p><span class="card-link">Consultar sección →</span></a>
<a class="journey-card" href="../cms-resultados/"><span class="step-number">04 / INTERPRETACIÓN</span><h3>Resultados y perspectivas</h3><p>Qué significa un error alto y qué mejoras se podrían explorar.</p><span class="card-link">Consultar sección →</span></a>
</div>

## Características del ejercicio

| Aspecto | Autoencoder CMS |
| --- | --- |
| Datos de origen | Archivos ROOT en formato NanoAOD (`.root`) |
| Contenido | Colecciones de partículas reconstruidas y propiedades del evento |
| Procesamiento | Selección de eventos, reconstrucción de candidatos W/Z, cálculo de observables y conversión a HDF5 |
| Modelo | Autoencoder entrenado con eventos del Modelo Estándar |
| Objetivo | Estudiar eventos con errores de reconstrucción elevados |
| Evaluación | Pérdidas y distribuciones del error de reconstrucción; W′ como referencia de evaluación |

[Continuar: Física y variables](cms-fisica.md){ .md-button .md-button--primary }
