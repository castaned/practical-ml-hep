# CMS · Procesamiento desde NanoAOD

Aquí reproducirás el procesamiento multileptónico que alimenta al autoencoder: **NanoAOD → selección de eventos → ROOT seleccionado → HDF5**. Los datos originales se leen de la carpeta compartida; los productos se guardan en tu cuenta.

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

Se aplica la selección multileptónica de `filterNanoAOD.py`, con al menos tres leptones, candidatos W/Z y las variables de cada canal. Los identificadores son **DYJets: 4, WZ: 5, ZZ: 6 y Wprime: 1**; `Dataset_ID` identifica el proceso y no es una entrada de la red.

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

[Anterior: Física y variables](cms-fisica.md){ .md-button }
[Continuar: Autoencoder y benchmark](cms-autoencoder.md){ .md-button .md-button--primary }
