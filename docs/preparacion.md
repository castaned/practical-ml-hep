# Preparación inicial: tu cuenta, tu terminal y Yuca

**Este es el primer paso del curso.** Al terminar podrás abrir una terminal, activar tu ambiente y enviar un entrenamiento a los recursos de ACARUS.

<div class="grid cards" markdown>

- **Una sola vez**

    Activar tu cuenta y la doble verificación. Clonar la herramienta. Crear tu ambiente personal.

- **Cada sesión**

    Entrar a Open OnDemand, abrir una terminal, activar el ambiente y entrar al repositorio.

- **Cada experimento**

    Copiar el YAML, cambiar una idea y su carpeta de salida, enviar el entrenamiento y revisar resultados.

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

## 2. Abre una terminal dentro de Yuca

Durante el curso puedes trabajar desde una **terminal de Open OnDemand** o desde una **terminal dentro de una sesión JupyterLab de Yuca**. En ambos casos los comandos deben ejecutarse en el clúster, no en la terminal de tu computadora personal.

| Desde dónde trabajas | Qué puedes hacer |
| --- | --- |
| Terminal de Open OnDemand | Preparar archivos y enviar trabajos de entrenamiento |
| Terminal de JupyterLab en Yuca | Usar los mismos comandos desde tu sesión interactiva |
| Explorador Files de Open OnDemand | Editar el YAML y abrir las figuras que produjo la red |

Para comprobar en qué cuenta y carpeta estás:

```bash
whoami
hostname
pwd
```

Una sesión JupyterLab tiene sus propios recursos. Abrir su terminal **no asigna automáticamente una GPU** al entrenamiento. El trabajo enviado con el script del curso solicitará la GPU por separado.

## 3. Prepara tu cuenta una sola vez

### Clona la herramienta

En la terminal de Yuca:

```bash
cd "$HOME"
git clone --branch opendata_dev https://github.com/castaned/ML-integration-CMSSW.git
cd ML-integration-CMSSW
mkdir -p "$HOME/hep-workshop/configs" "$HOME/hep-workshop/logs"
```

Si ya clonaste el repositorio, entra a esa carpeta y actualiza con `git pull --ff-only origin opendata_dev`; no necesitas otra copia.

### Crea el ambiente de entrenamiento

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

## 4. Al iniciar cada sesión

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

## 5. Cómo usamos los recursos de ACARUS

**Yuca organiza los trabajos con una cola.** Nosotros elegimos la red en el YAML y el script del curso solicita los recursos para ejecutarla.

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

### Esperar, observar y terminar

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

## Antes de pasar al laboratorio

- [ ] Puedo entrar a Yuca y abrir una terminal.
- [ ] Mi terminal muestra `(ml-hep-gpu)` y estoy en `ML-integration-CMSSW`.
- [ ] Puedo ver el archivo compartido del challenge.
- [ ] Mi cuenta tiene el proyecto del curso y entiendo cómo consultar un trabajo.

[Continuar: entender la física](fisica.md){ .md-button .md-button--primary }
[Ir al laboratorio](laboratorio.md){ .md-button }

Los detalles generales de la herramienta permanecen en su [manual técnico](https://castaned.github.io/ML-integration-CMSSW/). Este capítulo reúne los pasos necesarios para empezar la práctica en ACARUS.
