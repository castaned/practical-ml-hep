# ATLAS · Preparar el entorno

Realiza esta preparación **cuando vayas a comenzar el ejercicio ATLAS**, después de [acceder a JupyterLab en Yuca](preparacion.md). Aquí se descarga el software y se instala el ambiente de entrenamiento GPU; no es necesario hacerlo para entrar a Open OnDemand ni para el taller ROOT.

## 1. Clonar e instalar · Solo la primera vez

**Realiza estos pasos una sola vez en tu cuenta de Yuca:** clonar el repositorio e instalar el ambiente de entrenamiento. En las sesiones posteriores basta con [activar el ambiente y entrar al repositorio](#2-iniciar-una-sesion-atlas).

El código de procesamiento y entrenamiento está en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev).

### Clonación del repositorio · solo la primera vez {#clonar-repositorio}

Ejecuta estos comandos **una sola vez en tu cuenta de Yuca** para descargar la herramienta y preparar tus carpetas personales:

**Puedes copiar el bloque completo de comandos** con el botón de la esquina superior derecha, pegarlo en la terminal de JupyterLab y pulsar **Enter**. Sigue los bloques en el orden indicado y sustituye los datos que se señalen en cada paso.

```bash
cd "$HOME"
git clone --branch opendata_dev https://github.com/castaned/ML-integration-CMSSW.git
cd ML-integration-CMSSW
mkdir -p "$HOME/hep-workshop/configs" "$HOME/hep-workshop/logs"
```

Si ya clonaste el repositorio, entra a esa carpeta y actualiza con `git pull --ff-only origin opendata_dev`; no necesitas otra copia.

### Creación del ambiente de entrenamiento · solo la primera vez {#crear-ambiente}

Para las GPU AMD MI210 de Yuca usamos el ambiente personal `ml-hep-gpu`. **Créalo e instala sus paquetes una sola vez en tu cuenta** con estos comandos:

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
module load rocm/6.4.3
conda create -n ml-hep-gpu python=3.10 pip -y
conda activate ml-hep-gpu
python -m pip install torch==2.8.0 --index-url https://download.pytorch.org/whl/rocm6.4
python -m pip install numpy pandas scikit-learn matplotlib pyyaml h5py
```

En las siguientes sesiones, utiliza los comandos de **Inicio de una sesión de trabajo**, más abajo: solo necesitas activar el ambiente y entrar al repositorio. Esta combinación de PyTorch y ROCm fue probada en una MI210 de Yuca. El ambiente de procesamiento CMS `ml-open-data`, si ya lo tienes, es independiente.

## 2. Iniciar una sesión ATLAS

Si vienes de CMS o del taller ROOT, utiliza la pestaña **ATLAS** de [Cambiar de taller](ambientes.md). Si abres una terminal nueva para continuar en ATLAS, ejecuta el siguiente bloque.

**Cada vez que inicies una nueva sesión de JupyterLab y abras la terminal, ejecuta estos comandos.** Repítelos también si abres otra terminal: activan el ambiente de trabajo y te sitúan en el repositorio.

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
module load rocm/6.4.3
conda activate ml-hep-gpu
cd "$HOME/ML-integration-CMSSW"
git pull --ff-only origin opendata_dev
```

El último comando actualiza el repositorio **si hay cambios disponibles**; si ya está actualizado, mostrará `Already up to date.`. Tus YAML personales en `hep-workshop/configs` se conservan.

La terminal debe mostrar `(ml-hep-gpu)`. Ya puedes seguir el laboratorio con tu YAML.

Los datos originales estarán en la carpeta compartida:

```bash
ls -lh /lustre/cursos/curso07/datos/ATLAS_HiggsChallenge/
```

No necesitas descargarlos ni modificarlos. Tus YAML, registros y resultados se guardan en `hep-workshop` dentro de tu cuenta.

Con el ambiente `ml-hep-gpu` activo y los datos accesibles, continúa con el entrenamiento de referencia.

[Anterior: procesos y variables](fisica.md){ .md-button }
[Continuar: benchmark](laboratorio.md){ .md-button .md-button--primary }
