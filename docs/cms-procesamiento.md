# CMS · Procesamiento desde NanoAOD

Partimos de **muestras públicas de simulación del experimento CMS, disponibles en [CERN Open Data](https://opendata.cern.ch/)**. Los archivos originales están en formato **NanoAOD (ROOT)** y ya se descargaron en Yuca: este es el punto de inicio del ejercicio.

Usaremos los siguientes procesos:

| Muestra | Proceso físico | Papel en el análisis |
| --- | --- | --- |
| **DYJets** | Producción Drell–Yan de pares de leptones acompañados de jets | Muestra del Modelo Estándar; el benchmark histórico utiliza el intervalo HT 70–100 |
| **WZ** | Producción conjunta de un bosón W y un Z | Proceso SM que puede producir tres leptones y momento transversal faltante |
| **ZZ** | Producción de dos bosones Z | Otro proceso SM que contribuye a la muestra multileptónica |
| **W′ → WZ** | Resonancia hipotética de 1 TeV que decae en W y Z | Señal simulada reservada para evaluación; no participa en el entrenamiento |

A partir de las colecciones y ramas NanoAOD, **el código selecciona leptones, aplica filtros por evento, construye candidatos W/Z y calcula variables físicas**. Al terminar tendremos **archivos HDF5 con las cantidades seleccionadas para preparar las diez entradas del autoencoder**, separados por proceso. Sus distribuciones permiten revisar qué información física llega a la red y cómo difieren los procesos SM de W′.

| Punto de partida | Procesamiento | Producto para machine learning |
| --- | --- | --- |
| NanoAOD originales de CMS Open Data, ya descargados | Filtros de eventos, reconstrucción de candidatos y cálculo de observables | HDF5 con variables seleccionadas e identificadores de proceso; diez entradas físicas para la red |

Los NanoAOD compartidos se conservan como fuente. Los ROOT seleccionados y los HDF5 se generan en tu cuenta; la lista exacta de archivos de entrada queda registrada para comparar ejecuciones.

## 1. Localizar los datos y preparar el ambiente

Los NanoAOD están en **`/lustre/cursos/curso07/datos/autoencoder/`**, en las carpetas `DYjets`, `WZ`, `ZZ` y `Wprime`. En Open OnDemand puedes encontrarlos en **Files → Curso: curso07 → datos → autoencoder**. No necesitas copiarlos a tu cuenta.

Desde una terminal de JupyterLab:

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
conda activate ml-open-data
cd "$HOME/ML-integration-CMSSW"
git pull --ff-only origin opendata_dev
export CONDA_SETUP_SCRIPT=/apps/miniconda3/etc/profile.d/conda.sh
export SBATCH_QOS=qoscurso07
python -c "import ROOT, uproot, h5py, torch, onnx, yaml; print('Ambiente CMS disponible')"
```

CMS utiliza **`ml-open-data`**, con ROOT para leer y seleccionar los NanoAOD. Es un ambiente distinto al utilizado para ATLAS. Actívalo cada vez que abras una terminal para trabajar en CMS.

??? info "Solo si todavía no tienes el ambiente CMS"

    Créalo una sola vez en tu cuenta y luego vuelve a la comprobación anterior:

    ```bash
    conda create -n ml-open-data -c conda-forge python=3.11 root pip -y
    conda activate ml-open-data
    python -m pip install -r workshop/requirements-yuca.txt
    python -m pip install torch --index-url https://download.pytorch.org/whl/cpu
    ```

## 2. Crear los tres YAML personales

Ejecuta **una sola vez para esta reproducción**:

```bash
python workshop/setup_cms.py \
  --inputs /lustre/cursos/curso07/datos/autoencoder \
  --tag baseline01
```

El preparador utiliza las plantillas de `workshop/configs/`, comprueba que existan archivos ROOT en los cuatro procesos y crea configuraciones conectadas entre sí. También guarda la lista exacta de entradas en `cms_inputs_baseline01.json`. No procesa eventos ni envía trabajos todavía.

En el explorador izquierdo de JupyterLab, abre **hep-workshop → configs**:

| YAML personal | Etapa | Qué revisar |
| --- | --- | --- |
| `cms_processing_baseline01.yaml` | NanoAOD → ROOT seleccionado | `data_processing.datasets`: archivos y procesos; `eos_output_dir`: salida personal ROOT |
| `cms_root2h5_baseline01.yaml` | ROOT seleccionado → HDF5 | `convertion.input_dirs`, `branches` y `eos_output_dir` |
| `cms_autoencoder_baseline01.yaml` | HDF5 → entrenamiento y evaluación | `data.normal_input_paths`, `anomaly_input_paths`, `features`, `output_path`, `model` y `anomaly_detection` |

Haz doble clic en cada YAML para abrirlo como texto. Conserva las rutas generadas y guarda con **Ctrl+S** si editas algún campo. La clave `convertion` conserva la escritura utilizada por el programa.

Las plantillas originales están en [workshop/configs del repositorio](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop/configs): `cms_processing.yaml`, `cms_root2h5.yaml` y `cms_autoencoder.yaml`. Usa las copias personales generadas: ya contienen las rutas completas de tu cuenta.

## 3. Enviar la selección NanoAOD

Desde la misma terminal:

```bash
cd "$HOME/ML-integration-CMSSW/data_processing"
python execute_data_processing.py \
  -f "$HOME/hep-workshop/configs/cms_processing_baseline01.yaml"
```

**Este comando ya envía un array a Slurm**, con una tarea por archivo ROOT. No lo envuelvas en otro `sbatch`. Anota el número del trabajo que aparece al enviarlo.

La **lógica de selección de eventos está en [`example_files/main_process/filterNanoAOD.py`](https://github.com/castaned/ML-integration-CMSSW/blob/opendata_dev/example_files/main_process/filterNanoAOD.py)**, dentro del software del análisis. Allí se definen los requisitos sobre los leptones, los filtros por evento, la construcción de candidatos W/Z y las variables de cada canal.

El YAML indica qué muestras procesar, qué script ejecutar y dónde guardar los resultados; **los criterios físicos de selección están actualmente en el código Python**. Para otro análisis, se puede adaptar ese archivo o crear otro módulo de selección e indicarlo en `data_processing.processing_script`. Así se reutiliza el flujo NanoAOD → ROOT seleccionado → HDF5 con una selección y observables distintos. Para reproducir este benchmark, conserva el script y sus criterios originales.

 Los identificadores son **DYJets: 4, WZ: 5, ZZ: 6 y Wprime: 1**; `Dataset_ID` identifica el proceso y no es una entrada de la red.

### Monitorear el procesamiento

```bash
squeue -u "$USER"
```

Los registros de cada tarea están en **ML-integration-CMSSW → data_processing → logs**, como `job_<número>_<tarea>.out` y `.err`. Abre el `.out` para revisar el **cutflow**: cuántos eventos entran y cuántos superan las selecciones. El `.err` permite localizar errores.

Al terminar, comprueba el array con su número real:

```bash
sacct -j NUMERO_DEL_TRABAJO --format=JobID,State,ExitCode -X
```

**Continúa cuando todas las tareas terminen correctamente (`COMPLETED`, `0:0`).** Los ROOT seleccionados estarán en **hep-workshop → cms → baseline01 → root**, separados por proceso. No vuelvas a enviar la selección mientras el primer array esté pendiente o activo: comparte su mapa de procesos dentro de tu copia del repositorio.

## 4. Convertir los ROOT seleccionados a HDF5

Después de completar la selección:

```bash
cd "$HOME/ML-integration-CMSSW/data_processing/convert_h5"
python execute_convert_root2h5.py \
  -f "$HOME/hep-workshop/configs/cms_root2h5_baseline01.yaml" \
  --skip-empty-trees
```

Este comando envía otro array a Slurm. Anota su número y comprueba su estado con `squeue` y `sacct`, como en el paso anterior. Sus registros están en **data_processing → convert_h5 → logs**. Se omiten los ROOT sin eventos seleccionados.

Los resultados se guardan en **hep-workshop → cms → baseline01 → h5**, en `DYJets`, `WZ`, `ZZ` y `Wprime`. Cada archivo `.h5` contiene las variables seleccionadas y `Dataset_ID`; las ramas por canal permiten construir las diez entradas físicas del autoencoder.

### Producto del procesamiento: variables listas para el autoencoder

Los HDF5 reúnen las cantidades seleccionadas de cada proceso. Al leerlos, el programa obtiene una fila de diez variables por evento; las cantidades dependientes del canal se toman de los leptones asignados a W/Z y `W_mt` se calcula con el leptón de W y el momento faltante. `Dataset_ID` se conserva para identificar la muestra, sin incorporarlo a las entradas de la red.

### Variables construidas para la red

El código combina las ramas NanoAOD de los leptones y del momento faltante para construir candidatos W/Z y sus observables. Las diez entradas describen la energía transversal del evento, los candidatos W/Z y la geometría de sus decaimientos. Las cantidades de momento y masa se expresan en **GeV**; `Z_deltaR` es adimensional.

| Variable en el YAML | Significado físico |
| --- | --- |
| `MET_pt` | Magnitud del momento transversal faltante: desequilibrio asociado, entre otras contribuciones, al neutrino |
| `M3l` | Masa invariante de los tres leptones cargados; no incluye el neutrino y no es la masa completa de W′ |
| `Lep_pt_sum` | Suma escalar de los momentos transversales de los tres leptones |
| `Z_mass` | Masa invariante del par de leptones asignado al candidato Z |
| `Z_pt` | Momento transversal del candidato Z |
| `Z_deltaR` | Separación angular entre los dos leptones del candidato Z; describe cuán próximos están |
| `Lep1Z_pt`, `Lep2Z_pt` | Momentos transversales de los dos leptones asignados a Z |
| `Lep3W_pt` | Momento transversal del leptón asignado a W |
| `W_mt` | Masa transversal construida con el leptón de W y el momento transversal faltante |

Una resonancia pesada puede producir bosones con mayor momento transversal y modificar la geometría de sus decaimientos. Las variables permiten explorar esas diferencias y sus correlaciones; ninguna por sí sola identifica una nueva partícula.

`Dataset_ID` identifica el proceso de origen y permite separar las muestras. No es una variable de entrada de la red.

### Distribuciones de las variables

El siguiente panel, recuperado del análisis de referencia, muestra **cuatro variables representativas de las diez entradas**: MET, masa de tres leptones, momento transversal de Z y masa transversal de W. Se comparan DYJets, WZ y ZZ de entrenamiento con W′ de evaluación, antes del escalado. Cada proceso está normalizado a área uno; no son rendimientos por luminosidad.

[![Distribuciones reales del análisis previo: MET, masa de tres leptones, momento de Z y masa transversal de W](assets/cms/input_variables_reference.png)](assets/cms/input_variables_reference.png)

Pulsa la imagen para ampliarla. Los números de la leyenda corresponden a 49 eventos DYJets, 3 151 WZ y 819 ZZ de entrenamiento, y 320 W′ de evaluación. W′ no se utiliza para ajustar la red ni el escalado.

**Para interpretar:** en esta muestra, W′ presenta diferencias claras en MET, masa de tres leptones y momento transversal de Z. Otras variables pueden parecerse más a los procesos SM. La red utiliza conjuntamente las entradas y sus correlaciones; estas curvas no demuestran por sí solas una nueva señal.

Estas distribuciones ilustran el producto físico de la selección y construcción de variables. El panel corresponde al análisis previo; no se genera automáticamente al enviar el filtrado. Los ROOT seleccionados y sus HDF5 conservan las cantidades necesarias para inspeccionar las distribuciones de tu propia ejecución.

<div class="image-credits" markdown>

Distribuciones: material del análisis proporcionado por el autor; no son figuras oficiales de CMS.

</div>

## 5. Comprobar los datos antes de entrenar

Cuando la conversión termine correctamente:

```bash
cd "$HOME/ML-integration-CMSSW"
python scripts/check_dyjets_ht_pilot.py \
  -f "$HOME/hep-workshop/configs/cms_autoencoder_baseline01.yaml"
```

La comprobación lee los HDF5, valida las diez variables e identificadores y muestra los conteos **SM de entrenamiento, validación y prueba**, además de los eventos W′ de evaluación. Si falta un proceso, una rama o los datos no son válidos, corrige el procesamiento antes de entrenar.

Para reproducir los números históricos deben coincidir también los archivos de entrada. El manifiesto conserva los de tu ejecución; compara los conteos con la referencia de la página siguiente. No cambies las variables ni descartes comprobaciones para forzar una coincidencia.

Para una nueva extracción independiente, utiliza otro identificador, por ejemplo `--tag prueba02`; se generan tres YAML nuevos y salidas separadas. El preparador conserva las configuraciones existentes.

[Anterior: Física y objetivo del análisis](cms-fisica.md){ .md-button }
[Continuar: Autoencoder y benchmark](cms-autoencoder.md){ .md-button .md-button--primary }
