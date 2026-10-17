# Comandos de apoyo para el ejercicio ATLAS

Consultar esta página para una operación concreta y regresar después al ejercicio correspondiente. El recorrido principal es [preparación](preparacion.md) → [física y variables](fisica.md) → [benchmark](laboratorio.md) → [variaciones](variaciones.md) → [conclusiones](conclusiones.md).

## Generar las distribuciones de las variables {#3-mira-las-variables-antes-de-entrenar}

Desde la raíz del repositorio, con el YAML de referencia ya preparado:

Activa el ambiente y genera las comparaciones con **el mismo YAML**:

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
module load rocm/6.4.3
conda activate ml-hep-gpu
python workshop/plot_atlas.py -f "$HOME/hep-workshop/configs/atlas_baseline01.yaml"
```

En el explorador de JupyterLab, abre `hep-workshop/plots/atlas_inputs01/variables_01.png`. Hay ocho paneles, con hasta cuatro variables cada uno, y un PDF con las treinta variables. Las ocho variables representativas también se exportan como gráficos individuales PNG, PDF y SVG. La carpeta y el número de intervalos se controlan en el bloque `plots` del YAML. Para regenerar, elige una carpeta nueva en `plots.directory`.

Las distribuciones se normalizan a área uno para comparar formas y se amplía la zona central para que las colas largas no oculten sus diferencias. Por defecto se muestra hasta el percentil 99.5 de cada clase; `plots.upper_quantile: 1.0` permite ver el rango completo. El área se normaliza antes del recorte visual. Los valores ausentes se omiten en las gráficas; su frecuencia se guarda en `variable_summary.csv`. No representan cantidades físicas esperadas de señal y fondo.

[Consultar las distribuciones ampliadas y sus etiquetas físicas](fisica.md#distribuciones-de-las-variables).

*Ejemplo real del conjunto de entrenamiento: no se emplean eventos del conjunto privado. Los nombres y unidades de cada variable se explican en el registro oficial.*

Antes de seguir, completa la [tabla de exploración de variables](bitacora.md#antes-de-entrenar-que-informacion-tenemos). ¿Dónde se parecen señal y fondo? ¿Qué variables podrían ayudar a separarlos?

## Consultar un entrenamiento

```bash
squeue -u "$USER"
```

`PD` indica espera de recursos y `R` indica ejecución. Cuando el trabajo salga de la cola, sustituir `NUMERO_JOB` por el número asignado al envío:

```bash
sacct -j NUMERO_JOB --format=JobID,State,ExitCode,Elapsed -X
tail -40 "$HOME/hep-workshop/logs/atlas_NUMERO_JOB.out"
```

Los scripts ATLAS conservan la salida y los mensajes de error en el registro indicado por `--output`. `COMPLETED` y `0:0` indican finalización correcta. Ante un error, revisar ese registro antes de repetir el envío. Los resultados se consultan en la carpeta definida por `output.directory` en el YAML utilizado.

## Comparación opcional CPU y GPU

Crear una copia del YAML de referencia:

```bash
cp -n "$HOME/hep-workshop/configs/atlas_baseline01.yaml" "$HOME/hep-workshop/configs/atlas_cpu01.yaml"
```

En `atlas_cpu01.yaml`, cambiar `training.device` a `cpu` y `output.directory` a `$HOME/hep-workshop/results/atlas_cpu01`. Conservar la arquitectura, los datos, la semilla y los demás parámetros. Enviar desde la raíz del repositorio:

```bash
sbatch --output="$HOME/hep-workshop/logs/atlas_cpu_%j.out" \
  workshop/run_atlas_cpu.slurm "$HOME/hep-workshop/configs/atlas_cpu01.yaml"
```

Comparar `fit_seconds` en los dos `metrics.json` y registrar las épocas realmente ejecutadas. Para comparar el tiempo de una cantidad fija de trabajo, ambas corridas deben ejecutar el mismo número de épocas; una parada temprana diferente modifica esa comparación. El tiempo de espera en cola no forma parte de `fit_seconds`.

Los cuatro escenarios de variación están definidos en [Variaciones y resultados](variaciones.md#1-escenarios-por-grupo). Utilizar esa tabla común para asignar y registrar los experimentos.

[Volver al benchmark](laboratorio.md){ .md-button }
[Volver a las variaciones](variaciones.md){ .md-button }
