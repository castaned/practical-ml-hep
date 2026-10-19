# Activación de la consulta de cuentas

1. Abre la hoja de asignaciones y selecciona **Extensiones → Apps Script**.
2. Sustituye el contenido de `Código.gs` por `Code.gs` de esta carpeta y guarda.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: **yo**. Acceso: **cualquier persona**. Autoriza el acceso a la hoja con tu cuenta.
4. Copia la URL de implementación terminada en `/exec` y envíala para añadirla a `docs/assets/account-lookup.json`.

La hoja permanece privada. El servicio busca una coincidencia exacta del nombre (ignorando mayúsculas, acentos y espacios) y devuelve solo usuario y contraseña de una cuenta `estudiante_XXX`. Excluye docentes y no devuelve listas. Los nombres duplicados requieren intervención del instructor.

Esta consulta por nombre no autentica a la persona: quien conozca el nombre puede obtener sus credenciales. El instructor ha aceptado esta limitación para las cuentas del curso. No reutilizar este esquema para otros sistemas. Las contraseñas nunca deben copiarse al repositorio o al JavaScript de la página.
