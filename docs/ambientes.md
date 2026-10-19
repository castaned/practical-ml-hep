# Elegir taller y cambiar de ambiente

**El taller de machine learning tiene dos ejercicios: ATLAS y CMS. El curso de ROOT es una actividad independiente.** Antes de trabajar, elige la actividad y activa sus herramientas en la terminal.

| Actividad | Ambiente Conda | ¿Utiliza ROOT? | Cómo se ejecuta |
| --- | --- | --- | --- |
| **Machine learning · ATLAS** | `ml-hep-gpu` | **No**; parte de una tabla CSV | Comandos y trabajos Slurm; ROCm para GPU |
| **Machine learning · CMS** | `ml-open-data` | **Sí**, ROOT 6.24.08 de Yuca y `mini_nanotools` para procesar NanoAOD | Comandos y trabajos Slurm |
| **Curso de ROOT** | `root-student-course` | **Sí**, ROOT 6.36 instalado en Conda | Notebooks con kernel **Python (ROOT student-course)** |

## Cada sesión o cambio de actividad

Selecciona una pestaña y **copia el bloque completo en la terminal de JupyterLab**. El bloque desactiva el ambiente anterior, retira los módulos y rutas que podrían mezclarse y activa únicamente los del destino. No reinstala nada. Los ambientes deben haberse creado previamente en [Preparación](preparacion.md), [CMS](cms-procesamiento.md) o [Curso ROOT](curso-root.md), según corresponda.

=== "Machine learning · ATLAS"

    ```bash
    source /apps/miniconda3/etc/profile.d/conda.sh
    conda deactivate
    module unload root/6.24.08 rocm/6.4.3
    unset PYTHONPATH PYTHONHOME ROOTSYS ROOT_INCLUDE_PATH
    module load rocm/6.4.3
    conda activate ml-hep-gpu
    cd "$HOME/ML-integration-CMSSW"
    ```

    Continúa con el [benchmark ATLAS](laboratorio.md). Ejecuta el entrenamiento mediante Slurm para reservar la GPU.

=== "Machine learning · CMS"

    ```bash
    source /apps/miniconda3/etc/profile.d/conda.sh
    conda deactivate
    module unload root/6.24.08 rocm/6.4.3
    unset PYTHONPATH PYTHONHOME ROOTSYS ROOT_INCLUDE_PATH
    conda activate ml-open-data
    module load root/6.24.08
    cd "$HOME/ML-integration-CMSSW"
    export PYTHONPATH="$PWD:$(root-config --libdir):${PYTHONPATH:-}"
    export CONDA_SETUP_SCRIPT=/apps/miniconda3/etc/profile.d/conda.sh
    export SBATCH_QOS=qoscurso07
    python -c "import ROOT; from mini_nanotools import PostProcessor, Module, Collection; print('ROOT CMS:', ROOT.gROOT.GetVersion())"
    ```

    Continúa con el [procesamiento CMS](cms-procesamiento.md). Prepara estas variables antes de enviar los trabajos.

=== "Curso de ROOT"

    ```bash
    source /apps/miniconda3/etc/profile.d/conda.sh
    conda deactivate
    module unload root/6.24.08 rocm/6.4.3
    unset PYTHONPATH PYTHONHOME ROOTSYS ROOT_INCLUDE_PATH
    conda activate root-student-course
    cd "$HOME/student-course"
    python -c "import ROOT; print('ROOT:', ROOT.gROOT.GetVersion())"
    ```

    En el notebook elige **Python (ROOT student-course)**. Si el kernel ya estaba abierto con otra configuración, cámbialo o reinícialo y vuelve a comprobar la versión.

## Terminal y notebook: dos elecciones distintas

- **Terminal:** el nombre entre paréntesis indica el ambiente activo. Usa la pestaña anterior al abrir una terminal nueva o cambiar de actividad.
- **Notebook del curso ROOT:** selecciona **Python (ROOT student-course)** en el menú del kernel. Cambiar Conda en una terminal **no cambia** el kernel de un notebook abierto.
- **ATLAS y CMS:** sigue sus comandos de envío a Slurm. No uses el kernel del curso ROOT para ejecutar sus scripts.

**No cargues `root/6.24.08` dentro de `root-student-course`.** ATLAS no necesita ninguna versión de ROOT. Dentro del taller de machine learning, ROOT se utiliza en CMS para el procesamiento de NanoAOD.

Al terminar un notebook, cierra su kernel desde **Running Terminals and Kernels** si ya no lo usarás. Cambiar el ambiente de terminal no detiene kernels ni trabajos Slurm que ya estén ejecutándose.
