# Acceso y configuración del entorno en Yuca

Las prácticas se realizarán en **Yuca, el clúster de alto rendimiento de la Universidad de Sonora, operado por ACARUS**. En esta sección prepararás el acceso y el entorno para procesar los datos y entrenar las redes con el software [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW).

## 1. Primer acceso: antes de Open OnDemand

[Consultar cuenta asignada](https://docs.google.com/spreadsheets/d/1Bg-fwwj3Lxm3iRCQGzOcIHAbl4OHoVv12B9ttB509-Q/preview){ .md-button .md-button--primary target="_blank" rel="noopener" }

La primera conexión se hace por **SSH desde tu computadora**. En ella se prepara tu directorio personal y se activa la doble verificación de la cuenta. Completa esta etapa antes de entrar a Open OnDemand.

### Paso 1. Conectarse a Yuca y activar la doble verificación

En el primer acceso, entra con **el usuario y la contraseña proporcionados** y después **escanea el QR personal de Yuca desde Google Authenticator en tu teléfono**. Elige tu sistema operativo y completa la activación en cuanto Yuca muestre el código QR.

**Selecciona tu sistema operativo y sigue únicamente esa opción:**

=== "Windows"

    #### PowerShell · Opción preferida

    Abre el menú Inicio, busca **PowerShell** y abre la aplicación. Ejecuta el siguiente comando, sustituyendo `TU_USUARIO` por el nombre de usuario que se te proporcionó para el curso:

    ```powershell
    ssh TU_USUARIO@yuca.unison.mx
    ```

    Cuando aparezca `Password:`, escribe **la contraseña que se te proporcionó para el curso** y pulsa **Enter**. La contraseña no muestra caracteres ni asteriscos mientras la escribes.

    ![Conexión SSH a Yuca desde Windows PowerShell y solicitud de contraseña](assets/yuca/00-powershell-ssh.png)

    *La captura utiliza la cuenta de ejemplo `docente_07`. Debes escribir tu propio usuario asignado.*

    #### Activar Google Authenticator cuando aparezca el QR {#registrar-qr}

    **En cuanto Yuca muestre el código QR**, completa la activación antes de continuar:

    1. Abre **Google Authenticator** en tu teléfono (instala la app si aún no la tienes).
    2. Pulsa **+ → Escanear un código QR** y apunta al QR que aparece en tu computadora.
    3. Introduce en la terminal el **código vigente de seis dígitos** de la app cuando Yuca lo solicite y completa las indicaciones.

    Conserva la cuenta en Authenticator: usarás sus códigos en los siguientes accesos. Después continúa con **Open OnDemand**.

    #### PuTTY · Alternativa

    Si no cuentas con PowerShell o el comando `ssh` no está disponible, **descarga e instala PuTTY**:

    [Descargar PuTTY · Sitio oficial](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html){ .md-button }

    Abre el programa y completa los campos como en la imagen:

    - **Host Name:** `yuca.unison.mx`.
    - **Port:** `22`.
    - **Connection type:** `SSH`.

    Pulsa **Open**. Cuando aparezca `login as:`, escribe **el nombre de usuario que se te proporcionó para el curso** y pulsa **Enter**. Después introduce la contraseña proporcionada cuando aparezca `Password:` y pulsa **Enter**.

    ![Configuración de PuTTY: servidor yuca.unison.mx, puerto 22 y conexión SSH](assets/yuca/00-putty-ssh.png){ width="580" }

    Si utilizas PuTTY, cuando aparezca el QR sigue el mismo procedimiento de **Google Authenticator** explicado arriba.

=== "Linux / macOS"

    Abre la terminal del sistema y utiliza el mismo comando SSH, con tu usuario asignado:

    ```bash
    ssh TU_USUARIO@yuca.unison.mx
    ```

    Cuando aparezca `Password:`, escribe **la contraseña que se te proporcionó para el curso** y pulsa **Enter**. La contraseña no muestra caracteres ni asteriscos mientras la escribes.

    Cuando aparezca el QR, realiza el mismo procedimiento explicado para Windows: **Google Authenticator → + → Escanear un código QR**. Introduce el código de seis dígitos cuando lo solicite la terminal y completa la activación antes de entrar a **Open OnDemand**.

## 2. Terminales de Open OnDemand y JupyterLab

### Paso 1. Iniciar sesión en Open OnDemand

Abre **Open OnDemand de Yuca**: [https://yucaood.acarus.unison.mx/](https://yucaood.acarus.unison.mx/).

Introduce el nombre de usuario y la contraseña que se te proporcionaron para el curso. Completa la verificación con el código de Google Authenticator cuando se solicite.

![Pantalla de acceso a Open OnDemand de Yuca](assets/yuca/01-acceso.png)

### Paso 2. Seleccionar JupyterLab

En el panel principal, abrir **Interactive Apps** y seleccionar **JupyterLab**. 

![Panel principal de Open OnDemand y menú Interactive Apps](assets/yuca/02-panel.png)

### Paso 3. Solicitar la sesión interactiva

Completar el formulario y seleccionar **Launch**:

![Formulario para solicitar recursos de una sesión JupyterLab](assets/yuca/03-recursos-jupyter.png)

### Paso 4. Conectarse a JupyterLab

Esperar a que la sesión indique **Running** y seleccionar **Connect to Jupyter**. La asignación puede tardar según la disponibilidad de recursos. No es necesario crear otra sesión mientras la primera permanece en espera.

![Sesión JupyterLab en ejecución y botón Connect to Jupyter](assets/yuca/04-conectar-jupyter.png)

### Paso 5. Abrir la terminal

En JupyterLab, abrir **File → New → Terminal**, o utilizar **+** para abrir el Launcher y seleccionar **Terminal**. 

![Terminal de Yuca abierta dentro de JupyterLab](assets/yuca/05-terminal.png)

Mantén abierta esta terminal para ejecutar los comandos de las siguientes secciones.

## 3. Clonación y preparación del entorno · Solo la primera vez {#3-clonacion-y-preparacion-del-entorno-de-analisis}

**Realiza estos pasos una sola vez en tu cuenta de Yuca:** clonar el repositorio e instalar el ambiente de entrenamiento. En las sesiones posteriores basta con [activar el ambiente y entrar al repositorio](#4-inicio-de-una-sesion-de-trabajo).

El código de procesamiento y entrenamiento está en [ML-integration-CMSSW](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev).

### Clonación del repositorio · solo la primera vez {#clonar-repositorio}

Ejecuta estos comandos **una sola vez en tu cuenta de Yuca** para descargar la herramienta y preparar tus carpetas personales:

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

## 4. Inicio de una sesión de trabajo

**Cada vez que inicies una nueva sesión de JupyterLab y abras la terminal, ejecuta estos comandos.** Repítelos también si abres otra terminal: activan el ambiente de trabajo y te sitúan en el repositorio.

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

## Verificación del entorno

<ul class="environment-checks">
<li>Puedo entrar a Yuca y abrir una terminal.</li>
<li>Mi terminal muestra <code>(ml-hep-gpu)</code> y estoy en <code>ML-integration-CMSSW</code>.</li>
<li>Puedo ver el archivo compartido del challenge.</li>

</ul>

[Continuar con ATLAS Higgs Challenge](atlas.md){ .md-button .md-button--primary }
