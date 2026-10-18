# CMS · Interpretación y perspectivas

## Lectura de las gráficas

Revisa las pérdidas de entrenamiento y validación, las distribuciones de MSE por proceso y la ROC frente a W′.

| ATLAS: clasificación | CMS: reconstrucción |
| --- | --- |
| Aprende usando etiquetas de señal y fondo | Aprende a reconstruir eventos del Modelo Estándar |
| La puntuación favorece señal o fondo | El MSE cuantifica el error de reconstrucción |
| Se comparan AUC, AMS interna y tiempo | Se comparan pérdidas, errores por proceso y tiempo |
| Higgs aparece durante el entrenamiento | W′ se utiliza únicamente para evaluación |

Un error elevado puede deberse a un evento diferente de la referencia, a una descripción insuficiente del fondo o a problemas de reconstrucción. No constituye por sí mismo evidencia de nueva física. Las muestras del piloto tienen tamaños distintos; los pesos iguales por proceso no representan tasas físicas por luminosidad.

Si W′ presenta errores mayores que los procesos SM, un umbral de MSE puede enriquecer una selección en esa señal. Para convertirlo en una búsqueda física harían falta las normalizaciones e incertidumbres del fondo y una evaluación estadística. La AUC de este ejemplo resume la separación frente a esta muestra W′; no mide una capacidad universal de descubrir cualquier anomalía.

La muestra W′ permite ilustrar la respuesta del modelo. Si se consulta repetidamente para decidir arquitectura o variables, el resultado debe considerarse exploratorio.

### Posibles mejoras para una exploración posterior

| Variación posible | Qué permitiría investigar |
| --- | --- |
| Anchura de las capas y dimensión latente | Si cambia la reconstrucción SM y la capacidad de distinguir eventos diferentes |
| Variables de entrada | Qué información física añade cada observable y cómo influye su escala |
| Duración, tasa de aprendizaje y tamaño de lote | Si el entrenamiento converge y generaliza de forma estable |
| Más simulación y composición del fondo | Si la respuesta se mantiene con mayor estadística y mejor representación de los procesos |

Cada estudio requeriría conservar su configuración y una carpeta de resultados propia. Las decisiones se apoyarían primero en la validación SM; una evaluación independiente permitiría comprobar después si la mejora se mantiene frente a W′.

**Preguntas para la discusión:** ¿en qué paso se construyen las variables? ¿Qué información se necesita para entrenar cada red? ¿Por qué un error alto y una puntuación alta de clasificación tienen significados diferentes?

[Anterior: Autoencoder y benchmark](cms-autoencoder.md){ .md-button }
