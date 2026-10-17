# Comparación y presentación de resultados

Cada grupo presentará la configuración estudiada, los resultados respecto a la referencia y su interpretación.

## 1. Selección de la comparación

Comparen la red inicial con una variación que les parezca interesante. Puede haber mejorado, empeorado o dado prácticamente lo mismo: los tres resultados sirven para discutir.

## 2. Registro en la tabla de resultados

Completar la [tabla interactiva de resultados](variaciones.md#registro) con la referencia y la variación. Descargar el CSV del grupo y entregarlo junto con las figuras. Durante la puesta en común, reunir los CSV en esa misma página para visualizar las métricas de todos los grupos.

Los números están en `metrics.json`, dentro de cada carpeta de resultados. Mantengan los mismos datos para comparar las redes. La AMS del curso es de validación interna; no equivale todavía a la evaluación privada del challenge.

## 3. Figuras y archivos de configuración

En la carpeta compartida indicada en clase, suban:

- **Una o dos figuras** `training_summary.png` que permitan explicar la comparación.
- **Los dos YAML** utilizados, para poder repetirla.
- **La fila de resultados y su conclusión.** Pueden añadir los `metrics.json` para conservar los números.

Cada grupo usa su propio espacio, sin modificar las entregas de los demás. No hace falta subir datos originales, modelos completos, todos los registros ni preparar un archivo comprimido.

## 4. Discusión de los resultados

Completen estas tres frases:

1. **Esperábamos que…**
2. **Al cambiar… observamos…**
3. **Por eso concluimos…; para comprobarlo mejor haríamos…**

Para conversar entre todos: ¿una red más grande siempre ayudó? ¿AUC y AMS mejoraron juntas? ¿La GPU cambió la calidad de la clasificación o principalmente el tiempo? ¿Las curvas muestran que entrenar más dejó de ayudar?

!!! tip "Lo importante es la explicación"
    Una comparación bien interpretada vale aunque el número no mejore. Diferencias pequeñas en una sola corrida no bastan para declarar un ganador.

La práctica principal es **ATLAS Higgs Challenge**. Tras la demostración del autoencoder, comenten qué cambió en su objetivo y en el significado de la salida; no mezclen sus métricas en la tabla de clasificación.

[Anterior: variaciones y tabla de resultados](variaciones.md){ .md-button }
[Autoencoder CMS desde NanoAOD](autoencoder.md){ .md-button }

[Bitácora del grupo](bitacora.md) · [Referencias y benchmarks publicados](referencia.md#benchmarks-publicados-del-higgs-challenge)

[Preguntas adicionales para ampliar la discusión](preguntas-extra.md).
