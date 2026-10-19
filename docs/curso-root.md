# Curso de ROOT en Yuca

Ejecutaremos los notebooks del [curso de ROOT para estudiantes](https://github.com/root-project/student-course) con **ROOT 6.36 y Python 3.11**, en un ambiente independiente del taller de machine learning. En Yuca ya se probaron ROOT 6.36.14, el kernel y el comando `rootls`.

## 1. Instalar y descargar · Solo la primera vez

**Si ya tienes el ambiente, el kernel y el repositorio, pasa al paso 2.** Para una primera prueba con Dask puedes reservar 4 cores CPU y 8 GB de memoria, sin GPU.

Abre una terminal de JupyterLab y sitúate en tu **carpeta personal (`$HOME`)** antes de crear el ambiente. El curso ROOT se prepara desde allí, separado del repositorio `ML-integration-CMSSW`. El primer comando del bloque te lleva a esa ubicación:

```bash
cd "$HOME"
source /apps/miniconda3/etc/profile.d/conda.sh
conda deactivate
module unload root/6.24.08 rocm/6.4.3
unset PYTHONPATH PYTHONHOME ROOTSYS ROOT_INCLUDE_PATH
conda create -n root-student-course \
  --override-channels -c conda-forge --strict-channel-priority \
  python=3.11 'root>=6.36,<6.37' \
  numpy matplotlib mplhep dask distributed \
  jupyterlab ipykernel ipywidgets metakernel -y
conda activate root-student-course
```

Registra el kernel. La opción `PATH` permite que las celdas `%%bash` encuentren herramientas como `rootls`:

```bash
python -m ipykernel install --user \
  --name root-student-course \
  --display-name "Python (ROOT student-course)" \
  --env PATH "$CONDA_PREFIX/bin:$PATH" \
  --env PYTHONPATH ""
```

Desde **`$HOME`**, descarga el repositorio completo **si todavía no lo tienes**. Se creará **`$HOME/student-course`**, al mismo nivel que `$HOME/ML-integration-CMSSW`:

```bash
cd "$HOME"
git clone https://github.com/root-project/student-course.git
```

Conserva la estructura de carpetas: los notebooks buscan los datos mediante rutas relativas.

## 2. Iniciar una sesión o cambiar de taller

Abre [Elegir taller y cambiar de ambiente](ambientes.md), selecciona la pestaña **Curso de ROOT** y ejecuta su bloque en la terminal. Usa esa misma página para volver a **Machine learning · ATLAS** o **Machine learning · CMS**.

**En este curso usamos el ROOT del ambiente Conda; no cargues el módulo `root/6.24.08` de CMS.** Activar el ambiente en una terminal no cambia el kernel de los notebooks.

## 3. Abrir el notebook y elegir el kernel

En el explorador izquierdo abre **student-course → course → notebooks → core**. Comienza con `00-root-intro.ipynb` y sigue con `01-histograms-and-graphs.ipynb`.

En cada notebook selecciona **Kernel → Change Kernel → Python (ROOT student-course)** y pulsa **Select**. También puedes pulsar el nombre del kernel en la esquina superior derecha.

![Seleccionar Python (ROOT student-course) en JupyterLab](assets/root-course/select-root-kernel.png)

Comprueba en una celda Python:

```python
import ROOT
import shutil
print("ROOT:", ROOT.gROOT.GetVersion())
print("rootls:", shutil.which("rootls"))
```

Debes ver **ROOT 6.36.x** y una ruta de `rootls` dentro de **`root-student-course/bin`**. Después ejecuta las celdas en orden con **Shift+Enter**.

??? info "Si aparece ROOT 6.24 o no se encuentra rootls"

    Vuelve a [Elegir taller y cambiar de ambiente](ambientes.md) y ejecuta el bloque del curso ROOT. Si falta `rootls` solo en el notebook, repite el registro del kernel del paso 1. Cierra el kernel anterior, selecciona nuevamente **Python (ROOT student-course)** y ejecuta el notebook desde el principio.

    No es necesario reinstalar el ambiente ni modificar los notebooks para corregir las rutas.

??? info "Lecciones avanzadas y archivos remotos"

    Algunos ejemplos leen datos de CERN por HTTPS/XRootD. Dask trabaja dentro del nodo asignado y no solicita nodos adicionales. Limita `ROOT.EnableImplicitMT()` a los cores reservados, por ejemplo `ROOT.EnableImplicitMT(2)`.

    Los ejercicios extra con ROOT C++ o metadata antigua de Python 2 requieren revisión aparte. Hay también celdas con errores didácticos y ejercicios por completar.

[Elegir taller y cambiar de ambiente](ambientes.md){ .md-button .md-button--primary }
