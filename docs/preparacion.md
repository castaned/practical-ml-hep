# Acceso y configuración del entorno en Yuca

Esta sección describe el acceso al clúster Yuca, la configuración del ambiente de trabajo y el envío de entrenamientos a los recursos de ACARUS. Debe completarse antes del laboratorio.

<div class="grid cards" markdown>

- **Una sola vez**

    Activar tu cuenta y la doble verificación. Clonar la herramienta. Crear tu ambiente personal.

- **Cada sesión**

    Entrar a Open OnDemand, abrir una terminal, activar el ambiente y entrar al repositorio.

- **Cada experimento**

    Preparar una copia del YAML, modificar los parámetros de estudio y definir una carpeta de salida independiente.

</div>

## 1. Primer acceso: antes de Open OnDemand

La primera conexión se hace por **SSH**, para crear tu directorio personal y activar la doble verificación.

- **Windows:** abre PowerShell o PuTTY. En PuTTY utiliza el servidor `yuca.unison.mx`, conexión SSH y puerto 22.
- **Linux o macOS:** abre la terminal del sistema.

Con tu usuario asignado, ejecuta (sustituye `TU_USUARIO`):

```bash
ssh TU_USUARIO@yuca.unison.mx
```

Sigue las indicaciones de Yuca para registrar el QR en Google Authenticator y activar la doble verificación. Después ya podrás acceder a [Open OnDemand de Yuca](http://yucaood.acarus.unison.mx) con las credenciales y el código que se soliciten.

[Guía técnica del primer acceso](https://castaned.github.io/ML-integration-CMSSW/yuca-course/00_acceso/).

## 2. Terminales de Open OnDemand y JupyterLab

### Paso 1. Iniciar sesión en Open OnDemand

Acceder al [portal de Yuca](http://yucaood.acarus.unison.mx) e introducir el usuario y la contraseña asignados. Completar la verificación adicional cuando se solicite. Utiliza tu cuenta asignada.

![Pantalla de acceso a Open OnDemand de Yuca](assets/yuca/01-acceso.png)

### Paso 2. Seleccionar JupyterLab

En el panel principal, abrir **Interactive Apps** y seleccionar **JupyterLab**. 

![Panel principal de Open OnDemand y menú Interactive Apps](assets/yuca/02-panel.png)

### Paso 3. Solicitar la sesión interactiva

Completar el formulario y seleccionar **Launch**:

| Campo | Valor para la sesión del taller |
| --- | --- |
| Proyecto | `curso07` |
| Tipo de Nodo | `CPU` |
| Número de cores | `1` |
| Número de horas | `3`, para la sesión del miércoles |

En **Número de horas**, introduce `3`, aunque la captura muestre `8`.

![Formulario para solicitar recursos de una sesión JupyterLab](assets/yuca/03-recursos-jupyter.png)

### Paso 4. Conectarse a JupyterLab

Esperar a que la sesión indique **Running** y seleccionar **Connect to Jupyter**. La asignación puede tardar según la disponibilidad de recursos. No es necesario crear otra sesión mientras la primera permanece en espera.

![Sesión JupyterLab en ejecución y botón Connect to Jupyter](assets/yuca/04-conectar-jupyter.png)

### Paso 5. Abrir la terminal

En JupyterLab, abrir **File → New → Terminal**, o utilizar **+** para abrir el Launcher y seleccionar **Terminal**. 

![Terminal de Yuca abierta dentro de JupyterLab](assets/yuca/05-terminal.png)

Mantén abierta esta terminal para ejecutar los comandos de las siguientes secciones.

## 3. Configuración inicial de la cuenta

### Clonación del repositorio

En la terminal de Yuca:

```bash
cd "$HOME"
git clone --branch opendata_dev https://github.com/castaned/ML-integration-CMSSW.git
cd ML-integration-CMSSW
mkdir -p "$HOME/hep-workshop/configs" "$HOME/hep-workshop/logs"
```

Si ya clonaste el repositorio, entra a esa carpeta y actualiza con `git pull --ff-only origin opendata_dev`; no necesitas otra copia.

### Creación del ambiente de entrenamiento

Para las GPU AMD MI210 de Yuca usamos el ambiente personal `ml-hep-gpu`. Estos comandos crean una instalación en tu cuenta:

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
module load rocm/6.4.3
conda create -n ml-hep-gpu python=3.10 pip -y
conda activate ml-hep-gpu
python -m pip install torch==2.8.0 --index-url https://download.pytorch.org/whl/rocm6.4
python -m pip install numpy pandas scikit-learn matplotlib pyyaml h5py
```

Si el ambiente ya existe, actívalo en lugar de crearlo otra vez. Esta combinación de PyTorch y ROCm fue probada en una MI210 de Yuca. El ambiente de procesamiento CMS `ml-open-data`, si ya lo tienes, es independiente.

## 4. Inicio de una sesión de trabajo

Después de abrir una terminal en Yuca, ejecuta:

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
module load rocm/6.4.3
conda activate ml-hep-gpu
cd "$HOME/ML-integration-CMSSW"
```

La terminal debe mostrar `(ml-hep-gpu)`. Ya puedes seguir el laboratorio con tu YAML.

Los datos originales estarán en la carpeta compartida:

```bash
ls -lh /lustre/cursos/curso07/datos/ATLAS_HiggsChallenge/
```

No necesitas descargarlos ni modificarlos. Tus YAML, registros y resultados se guardan en `hep-workshop` dentro de tu cuenta.

## 5. Uso de los recursos de ACARUS

Yuca administra los trabajos mediante Slurm. La arquitectura y los parámetros de entrenamiento se definen en el archivo YAML; el script del curso solicita los recursos de cómputo necesarios.

| Recurso o acción | Para qué lo usamos |
| --- | --- |
| CPU | Preparación y comparación de tiempos de entrenamiento |
| GPU AMD MI210 | Entrenamiento de redes neuronales |
| Proyecto o cuenta de Slurm | Identifica a qué proyecto se carga el trabajo |
| Cola | Esperar hasta que los recursos estén disponibles |
| Carpeta personal | Conservar la configuración y salida de cada experimento |

Consulta el proyecto autorizado para tu cuenta:

```bash
misproyectos
```

En las pruebas del curso se utiliza **`curso07`** y la QOS **`qoscurso07`**. Los scripts ya incluyen esos valores. Si tu cuenta no muestra ese proyecto, revísalo con el docente antes de enviar trabajos; no utilices el proyecto de otra persona.

Para el primer entrenamiento, con el YAML ya preparado en el [laboratorio](laboratorio.md):

```bash
sbatch --output="$HOME/hep-workshop/logs/atlas_%j.out" \
  workshop/run_atlas_gpu.slurm "$HOME/hep-workshop/configs/atlas_baseline01.yaml"
```

El script solicita **una GPU, cuatro CPU, 16 GB de memoria y hasta 30 minutos**. No hace falta editar el script para variar la arquitectura de la red.

### Seguimiento de los trabajos

```bash
squeue -u "$USER"
```

- **PD:** está esperando recursos.
- **R:** está ejecutándose.
- Si desapareció, consulta su registro para verificar si terminó correctamente.

Sustituye `NUMERO_JOB` por el número que devolvió `sbatch`:

```bash
tail -30 "$HOME/hep-workshop/logs/atlas_NUMERO_JOB.out"
sacct -j NUMERO_JOB --format=JobID,State,ExitCode,Elapsed -X
```

`COMPLETED` con código `0:0` indica que terminó sin error. No es necesario enviar otra copia mientras la primera espera. Si necesitas cancelar una prueba, usa `scancel NUMERO_JOB` solo para el trabajo que deseas detener.

## Verificación del entorno

- [ ] Puedo entrar a Yuca y abrir una terminal.
- [ ] Mi terminal muestra `(ml-hep-gpu)` y estoy en `ML-integration-CMSSW`.
- [ ] Puedo ver el archivo compartido del challenge.
- [ ] Mi cuenta tiene el proyecto del curso y entiendo cómo consultar un trabajo.

[Continuar: entender la física](fisica.md){ .md-button .md-button--primary }
[Ir al laboratorio](laboratorio.md){ .md-button }

Los detalles generales de la herramienta permanecen en su [manual técnico](https://castaned.github.io/ML-integration-CMSSW/). Este capítulo reúne los pasos necesarios para empezar la práctica en ACARUS.
