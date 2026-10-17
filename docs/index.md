---
hide:
  - navigation
  - toc
---

<div class="course-hero" markdown>

<div class="hero-copy" markdown>

<span class="eyebrow">CERN OPEN DATA · FÍSICA · EXPERIMENTACIÓN</span>

# De un evento<br>a una idea.

Aprende a reconocer señales de Higgs, diseña una red neuronal y descubre qué cambia cuando la entrenas de otra forma.

**Un laboratorio práctico en el clúster Yuca, con preguntas de física y resultados que puedes reproducir.**

[Explorar la física](fisica.md){ .md-button .md-button--primary }
[Ir al laboratorio](laboratorio.md){ .md-button .hero-secondary }

</div>

<div class="hero-art" markdown>

![Del Higgs a un leptón, hadrones y tres neutrinos](assets/workshop/higgs_tautau_final_state.svg)

<span>Una señal física. Varias pistas. Una red que aprende a combinarlas.</span>

</div>

</div>

<div class="course-facts" markdown>

<div><strong>30</strong><span>variables para explorar</span></div>
<div><strong>250 mil</strong><span>eventos para desarrollar el modelo</span></div>
<div><strong>CPU ↔ GPU</strong><span>misma pregunta, otro tiempo de cálculo</span></div>
<div><strong>1 YAML</strong><span>por experimento; una carpeta por resultado</span></div>

</div>

!!! info "Primer paso: preparar tu acceso y tu cuenta"
    La [preparación inicial en Yuca](preparacion.md) explica el primer SSH, la doble verificación, cómo trabajar desde Open OnDemand o JupyterLab y cómo solicitar recursos de ACARUS. Hazla una vez; después podrás concentrarte en los experimentos.

## No venimos a acumular entrenamientos. Venimos a entenderlos.

Buscamos distinguir **Higgs → ττ** de procesos que se parecen en el detector. Trabajaremos con el **ATLAS Higgs Challenge**: simulaciones abiertas, variables físicas y un reto de clasificación con referencias publicadas.

La red es nuestra herramienta de investigación. Tú propones un cambio, miras qué ocurrió y decides qué puedes concluir.

<div class="journey-grid" markdown>

<a class="journey-card" href="fisica/">
<span class="step-number">01 / ENTENDER</span>
<h3>Mira la física</h3>
<p>Señal, fondos, neutrinos y las 30 variables. ¿Qué información recibe la red?</p>
<span class="card-link">Explorar el proceso →</span>
</a>

<a class="journey-card" href="laboratorio/">
<span class="step-number">02 / EXPERIMENTAR</span>
<h3>Diseña y entrena</h3>
<p>Cambia capas, neuronas o aprendizaje desde un YAML. Ejecuta tu idea en Yuca.</p>
<span class="card-link">Entrar al laboratorio →</span>
</a>

<a class="journey-card" href="bitacora/">
<span class="step-number">03 / INTERPRETAR</span>
<h3>Registra lo que pasó</h3>
<p>Compara curvas, tiempo y métricas. Completa una tabla y contrasta tu hipótesis.</p>
<span class="card-link">Abrir la bitácora →</span>
</a>

<a class="journey-card" href="conclusiones/">
<span class="step-number">04 / DISCUTIR</span>
<h3>Cuenta qué aprendiste</h3>
<p>Una comparación, una figura y una conclusión. Un resultado sin mejora también enseña.</p>
<span class="card-link">Compartir conclusiones →</span>
</a>

</div>

## Una arquitectura, muchas preguntas

<div class="network-explorer" data-network-explorer>
<div class="explorer-intro">
<span class="eyebrow">EXPLORA ANTES DE ENTRENAR</span>
<h3>¿Qué cambia al ampliar la red?</h3>
<p>Elige una arquitectura y observa su tamaño. Después podrás probarla editando tu YAML en Yuca.</p>
<label for="network-choice">Arquitectura</label>
<select id="network-choice">
<option value="baseline">Referencia · cuatro capas</option>
<option value="wide">Más ancha · cuatro capas</option>
<option value="deep">Más profunda · ocho capas</option>
</select>
<label for="dropout-choice">Dropout <output id="dropout-value">0.1</output></label>
<input id="dropout-choice" type="range" min="0" max="0.5" step="0.1" value="0.1">
<p class="explorer-hint">Más parámetros no garantizan mejor clasificación. Esa es una hipótesis que vamos a poner a prueba.</p>
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

## Primero observa; después pregunta por qué

<div class="figure-story" markdown>

<div markdown>

<span class="eyebrow">DEL EVENTO AL APRENDIZAJE</span>

### No todas las variables cuentan la misma historia

Algunas muestran diferencias entre señal y fondo. Otras se parecen mucho. Una red puede aprovechar sus combinaciones y correlaciones.

Antes de entrenar, elige una variable y explica **qué mide** y **por qué podría ayudar**.

[Conocer las 30 variables](fisica.md#las-30-variables-organizadas-por-su-significado){ .text-link }

</div>

![Ejemplos reales de seis variables del conjunto de entrenamiento](assets/workshop/atlas_variables_01.png)

</div>

## Durante la sesión

Trabajaremos individualmente o en grupos cercanos, según la disposición del salón. Todos partimos de una referencia y probamos al menos una variación. Si hay tiempo, exploramos una segunda idea.

<div class="session-strip" markdown>

**Miércoles · 3 horas**<br>Física, variables, entrenamiento y experimentos por grupo.

**Jueves · 1 hora**<br>Comparación de resultados y exploración de un autoencoder CMS.

</div>

<div class="closing-callout" markdown>

### «Esperábamos esto. Cambiamos esto. Observamos esto otro.»

Esa es la historia que cada grupo compartirá al final.

[Preparar mi cuenta](preparacion.md){ .md-button }
[Manual técnico de la herramienta](https://castaned.github.io/ML-integration-CMSSW/){ .text-link }

</div>

El código de entrenamiento y los YAML se mantienen en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop). Este sitio reúne el material docente. Cómputo en **ACARUS / Yuca, Universidad de Sonora**. Figuras publicadas y fuentes identificadas en el [capítulo de física](fisica.md#procedencia-de-las-imagenes).
