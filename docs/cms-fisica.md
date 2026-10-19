# CMS · Física y objetivo del análisis

## Motivación física: del sector electrodébil a una posible resonancia

Los bosones **W y Z** son mediadores de la interacción débil. Sus decaimientos pueden producir electrones, muones y neutrinos, dando lugar a estados finales multileptónicos que podemos estudiar en CMS.

Algunas extensiones del Modelo Estándar proponen un bosón cargado más pesado, **W′**, que podría decaer en W y Z. En este ejercicio usamos una simulación de W′ de **1 TeV y anchura estrecha** como señal de prueba. Es una hipótesis de evaluación, no una partícula observada en estos datos.

![Producción de una resonancia W′ y decaimiento a WZ, con tres leptones y un neutrino en el estado final](assets/cms/wprime_decay.png){ width="580" }

*W′ → WZ → 3ℓν. En el canal ilustrado, Z produce dos leptones de cargas opuestas y W un leptón y un neutrino; ℓ representa un electrón o un muón. Se considera también el canal conjugado de carga.*

En el detector esperamos **tres leptones cargados y momento transversal faltante**, relacionado con el neutrino que no se detecta directamente. La producción habitual de WZ puede producir el mismo estado final. La pregunta es si una red entrenada con procesos conocidos responde de forma diferente a eventos de la señal W′. Este estado final se utiliza también en [búsquedas de resonancias de CMS](https://cms-results.web.cern.ch/cms-results/public-results/publications/EXO-12-025/index.html).

## Qué buscamos con este ejercicio

Usaremos procesos conocidos del Modelo Estándar —**DYJets, WZ y ZZ**— para que el autoencoder aprenda los patrones habituales de eventos multileptónicos. Después evaluaremos la muestra simulada **W′ → WZ → 3ℓν**, sin utilizarla durante el entrenamiento.

Una resonancia pesada puede producir bosones con mayor momento transversal y modificar la geometría de sus decaimientos. Buscamos comprobar si esas diferencias dan lugar a errores de reconstrucción mayores que los de los procesos SM y permiten seleccionar una fracción de W′ conservando poco fondo.

El objetivo es estudiar una estrategia de **detección de anomalías**. Un error alto señala un evento poco habitual para la red; no demuestra por sí solo la existencia de W′ ni de nueva física.

El siguiente paso comienza con las muestras NanoAOD ya descargadas. Allí veremos cómo el código selecciona eventos y construye las variables que recibirá la red.

<div class="image-credits" markdown>

Diagrama W′: material del análisis proporcionado por el autor; no es una figura oficial de CMS.

</div>

[Anterior: introducción CMS](autoencoder.md){ .md-button }
[Continuar: Procesamiento NanoAOD](cms-procesamiento.md){ .md-button .md-button--primary }
