# Cambiar de taller

**Elige tu actividad y pega su bloque completo en la terminal de JupyterLab.** Úsalo al iniciar una sesión o cambiar de taller, una vez instalados los ambientes.

| Taller | Actividad | Ambiente | ROOT |
| --- | --- | --- | --- |
| Machine learning | ATLAS | `ml-hep-gpu` | No utiliza ROOT |
| Machine learning | CMS | `ml-open-data` | ROOT 6.24.08 de Yuca |
| ROOT | Notebooks | `root-student-course-640` | ROOT 6.40 de Conda |

=== "ATLAS"

    ```bash
    source /apps/miniconda3/etc/profile.d/conda.sh
    conda deactivate
    module unload root/6.24.08 rocm/6.4.3
    unset PYTHONPATH PYTHONHOME ROOTSYS ROOT_INCLUDE_PATH
    module load rocm/6.4.3
    conda activate ml-hep-gpu
    cd "$HOME/ML-integration-CMSSW"
    ```

    [Continuar con ATLAS](laboratorio.md).

=== "CMS"

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
    ```

    [Continuar con CMS](cms-procesamiento.md).

=== "ROOT"

    ```bash
    source /apps/miniconda3/etc/profile.d/conda.sh
    conda deactivate
    module unload root/6.24.08 rocm/6.4.3
    unset PYTHONPATH PYTHONHOME ROOTSYS ROOT_INCLUDE_PATH
    conda activate root-student-course-640
    cd "$HOME/student-course"
    ```

    En el notebook selecciona el kernel **Python (ROOT 6.40)**.


**Terminal y notebook se cambian por separado:** los bloques activan el ambiente de la terminal; para el taller ROOT debes elegir además su kernel en el notebook. No mezcles el módulo ROOT de CMS con el ROOT de Conda. Los trabajos Slurm ya enviados continúan aunque cambies de ambiente.
