# CMS · Interpretación y perspectivas

## ¿Qué observamos?

Las pérdidas de entrenamiento y validación SM disminuyen: la red aprende a reconstruir los eventos. W′ presenta una cola de errores mayores, aunque buena parte de sus eventos se solapa con el SM.

| Resultado de esta corrida | Interpretación |
| --- | --- |
| **AUC = 0.918** | Hay separación SM–W′ al recorrer los distintos umbrales |
| **Umbral MSE = 2.564** | Corte fijado con el percentil 99 de validación SM balanceada |
| **WZ de prueba: 2.76 % seleccionado** | Una fracción del fondo también supera el corte |
| **W′ de evaluación: 17.95 % seleccionado** | El corte retiene parte de la señal, pero rechaza la mayoría |

**Una AUC alta no implica una eficiencia alta en cualquier corte.** Bajar el umbral recuperaría más W′, a costa de aceptar más fondo. El 2.76 % corresponde solo a WZ; no es la aceptación conjunta del SM ni la aceptación balanceada usada en la ROC.

## ¿Qué concluimos?

El autoencoder, entrenado únicamente con SM, selecciona una fracción mayor de W′ que de WZ al mismo umbral. Esto ilustra su utilidad para buscar eventos poco habituales. **Un evento seleccionado no queda identificado como nueva física.** Las muestras y sus normalizaciones no permiten deducir una pureza o significancia física a partir de estos porcentajes.

A diferencia del clasificador ATLAS, aquí W′ no participa en el entrenamiento: la puntuación es el **error de reconstrucción**, no una probabilidad de señal.

## ¿Qué comprobaríamos después?

- Recorrer el umbral y comparar eficiencia W′ con aceptación SM.
- Repetir con otras semillas para comprobar la estabilidad.
- Estudiar las variables y el espacio latente usando validación SM; reservar muestras independientes para la evaluación final.

[Volver a las gráficas del benchmark](cms-autoencoder.md#benchmark-cms){ .md-button }
