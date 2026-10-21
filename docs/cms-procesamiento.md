# CMS · De NanoAOD a HDF5 y gráficas

## 1. Activar CMS

Copia este bloque en una terminal de JupyterLab, aunque vengas de ATLAS o ROOT:

```bash
source /apps/miniconda3/etc/profile.d/conda.sh
conda deactivate
module unload root/6.24.08 rocm/6.4.3
unset PYTHONPATH PYTHONHOME ROOTSYS ROOT_INCLUDE_PATH
conda activate ml-open-data
module load root/6.24.08
cd "$HOME/ML-integration-CMSSW"
git pull --ff-only origin opendata_dev
export PYTHONPATH="$PWD:$(root-config --libdir)"
export CONDA_SETUP_SCRIPT=/apps/miniconda3/etc/profile.d/conda.sh
export SBATCH_QOS=qoscurso07
```

## 2. Preparar la ejecución

Define la etiqueta **solo aquí**. Si `baseline02` ya existe, usa otra, como `baseline03`. Se guardará para reutilizarla al entrenar.

```bash
export CMS_TAG=baseline02
python workshop/setup_cms.py \
  --inputs /lustre/cursos/curso07/datos/autoencoder \
  --tag "$CMS_TAG" &&
  printf 'export CMS_TAG=%q\n' "$CMS_TAG" > "$HOME/hep-workshop/cms-session.sh"
```

Mantén la misma terminal durante estos pasos. Si abres otra, activa CMS y ejecuta `source "$HOME/hep-workshop/cms-session.sh"`.

Se crean los tres YAML necesarios en **hep-workshop → configs**. Los datos compartidos se leen sin copiarlos.

## 3. Procesar los NanoAOD

```bash
cd "$HOME/ML-integration-CMSSW/data_processing"
python execute_data_processing.py \
  -f "$HOME/hep-workshop/configs/cms_processing_${CMS_TAG}.yaml"
```

Anota el número del trabajo y comprueba su estado:

```bash
sacct -j NUMERO_DEL_TRABAJO --format=JobID,State,ExitCode
```

Sustituye `NUMERO_DEL_TRABAJO` por el recibido. **Espera a que todas las tareas indiquen `COMPLETED` y `0:0` antes de continuar.** Si alguna falla, revisa **data_processing → logs**.

## 4. Convertir a HDF5

```bash
cd "$HOME/ML-integration-CMSSW/data_processing/convert_h5"
python -m pip install tables
python execute_convert_root2h5.py \
  -f "$HOME/hep-workshop/configs/cms_root2h5_${CMS_TAG}.yaml" \
  --skip-empty-trees
```

Comprueba el **nuevo número de trabajo**:

```bash
sacct -j NUMERO_DEL_TRABAJO --format=JobID,State,ExitCode
```

**Espera de nuevo a que todas las tareas indiquen `COMPLETED` y `0:0`.** Los HDF5 quedan en **hep-workshop → cms → tu etiqueta → h5**. Si alguna falla, revisa **data_processing → convert_h5 → logs**.

## 5. Generar y abrir las gráficas

```bash
cd "$HOME/ML-integration-CMSSW"
python scripts/check_dyjets_ht_pilot.py \
  -f "$HOME/hep-workshop/configs/cms_autoencoder_${CMS_TAG}.yaml" \
  --plots "$HOME/hep-workshop/cms/${CMS_TAG}/plots"
```

En el explorador de JupyterLab abre **hep-workshop → cms → tu etiqueta → plots**:

- **`variables_selected.png`**: MET, masa de tres leptones, momento de Z y masa transversal de W.
- **`variables_all.png`**: las diez variables de entrada.

Las gráficas comparan las formas de DYJets, WZ, ZZ y W′, normalizadas por proceso. **Todavía no se entrena la red.** Para repetir solo las gráficas, cambia la carpeta final `plots` por `plots02`.

[Anterior: Física y objetivo](cms-fisica.md){ .md-button }
[Continuar: Autoencoder y benchmark](cms-autoencoder.md){ .md-button .md-button--primary }
