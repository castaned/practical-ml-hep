# Activación de cuenta y acceso a Yuca

Las prácticas se realizarán en **Yuca, el clúster de alto rendimiento de la Universidad de Sonora, operado por ACARUS**. En esta sección activarás tu cuenta, configurarás la doble verificación y accederás a **Open OnDemand y JupyterLab**.

## 1. Primer acceso: antes de Open OnDemand

[Consultar cuenta asignada](https://docs.google.com/spreadsheets/d/1Bg-fwwj3Lxm3iRCQGzOcIHAbl4OHoVv12B9ttB509-Q/preview){ .md-button .md-button--primary target="_blank" rel="noopener" }

La primera conexión se hace por **SSH desde tu computadora**. En ella se prepara tu directorio personal y se activa la doble verificación de la cuenta. Completa esta etapa antes de entrar a Open OnDemand.

### Paso 1. Conectarse a Yuca y activar la doble verificación

En el primer acceso, entra con los datos **Username** y **Password** de la tabla de cuentas y después **escanea el QR personal de Yuca desde Google Authenticator en tu teléfono**. Elige tu sistema operativo y completa la activación en cuanto Yuca muestre el código QR.

**Selecciona tu sistema operativo y sigue únicamente esa opción:**

=== "Windows"

    #### PowerShell · Opción preferida

    Abre el menú Inicio, busca **PowerShell** y abre la aplicación. Ejecuta el siguiente comando, sustituyendo `Username` por el valor de la columna **Username** de la tabla de cuentas:

    ```powershell
    ssh Username@yuca.unison.mx
    ```

    Cuando aparezca `Password:`, escribe el valor de la columna **Password** de la tabla y pulsa **Enter**. La contraseña no muestra caracteres ni asteriscos mientras la escribes.

    ![Conexión SSH a Yuca desde Windows PowerShell y solicitud de contraseña](assets/yuca/00-powershell-ssh.png)

    *La captura utiliza la cuenta de ejemplo `docente_07`. Debes escribir tu propio **Username** de la tabla.*

    #### Activar Google Authenticator cuando aparezca el QR {#registrar-qr}

    Yuca requiere **autenticación en dos pasos**, una medida de seguridad habitual: tu contraseña y un código temporal de la app. El QR permite activar ese segundo paso.

    **En cuanto Yuca muestre el código QR**, completa la activación antes de continuar:

    1. Abre **Google Authenticator** en tu teléfono (instala la app si aún no la tienes).
    2. Pulsa **+ → Escanear un código QR** y apunta al QR que aparece en tu computadora.
    3. Introduce en la terminal el **código vigente de seis dígitos** de la app cuando Yuca lo solicite y completa las indicaciones.

    Conserva la cuenta en Authenticator: usarás sus códigos en los siguientes accesos. Después continúa con **Open OnDemand**.

    #### PuTTY · Alternativa

    Si no cuentas con PowerShell o el comando `ssh` no está disponible, **descarga PuTTY** para Windows de 64 bits (Intel/AMD):

    [Descargar PuTTY para Windows · Descarga directa oficial](https://the.earth.li/~sgtatham/putty/latest/w64/putty.exe){ .md-button }

    Abre el archivo **`putty.exe`** descargado; esta versión no requiere instalación. Completa los campos como en la imagen. Para otras arquitecturas, consulta el [sitio oficial de PuTTY](https://putty.software/).

    - **Host Name:** `yuca.unison.mx`.
    - **Port:** `22`.
    - **Connection type:** `SSH`.

    Pulsa **Open**. Cuando aparezca `login as:`, escribe tu **Username** de la tabla y pulsa **Enter**. Después introduce el valor de **Password** de la tabla cuando aparezca `Password:` y pulsa **Enter**.

    ![Configuración de PuTTY: servidor yuca.unison.mx, puerto 22 y conexión SSH](assets/yuca/00-putty-ssh.png){ width="580" }

    Si utilizas PuTTY, cuando aparezca el QR sigue el mismo procedimiento de **Google Authenticator** explicado arriba.

=== "Linux / macOS"

    Abre la terminal del sistema y utiliza el mismo comando SSH, sustituyendo `Username` por tu **Username** de la tabla:

    ```bash
    ssh Username@yuca.unison.mx
    ```

    Cuando aparezca `Password:`, escribe el valor de la columna **Password** de la tabla y pulsa **Enter**. La contraseña no muestra caracteres ni asteriscos mientras la escribes.

    Cuando aparezca el QR, realiza el mismo procedimiento explicado para Windows: **Google Authenticator → + → Escanear un código QR**. Introduce el código de seis dígitos cuando lo solicite la terminal y completa la activación antes de entrar a **Open OnDemand**.

## 2. Acceso al clúster mediante Open OnDemand {#2-terminales-de-open-ondemand-y-jupyterlab}

### Paso 1. Iniciar sesión en Open OnDemand

Abre **Open OnDemand de Yuca**: [https://yucaood.acarus.unison.mx/](https://yucaood.acarus.unison.mx/).

Introduce los valores **Username** y **Password** de la tabla de cuentas. Completa la verificación con el código de Google Authenticator cuando se solicite.

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

Desde esta terminal podrás seguir las instrucciones del taller que elijas.

## Acceso listo

Ya puedes entrar a Open OnDemand, abrir JupyterLab y utilizar su terminal. **La clonación del software y la instalación de ambientes se realizan al iniciar cada taller**, siguiendo su sección correspondiente.

[Continuar con ATLAS](atlas.md){ .md-button .md-button--primary }
[Ir al taller de ROOT](curso-root.md){ .md-button }
