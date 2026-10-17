# Practical Machine Learning in HEP

Material docente del taller con CERN Open Data y el clúster Yuca (ACARUS, Universidad de Sonora).

**Página del curso:** https://castaned.github.io/practical-ml-hep/

## Separación entre curso y herramienta

Este repositorio contiene explicaciones, figuras, prácticas y preguntas. El código y los YAML que ejecutan los estudiantes se mantienen en [ML-integration-CMSSW, rama opendata_dev](https://github.com/castaned/ML-integration-CMSSW/tree/opendata_dev/workshop). Los datos se leen desde la carpeta compartida de Yuca; no se almacenan aquí.

Se migró el material del curso sin eliminar ni modificar la documentación anterior. Las figuras publicadas conservan sus fuentes y créditos en el capítulo de física. El curso no representa una publicación ni un aval de ATLAS, CMS o CERN.

## Editar y previsualizar

```bash
python -m pip install -r requirements.txt
python -m mkdocs serve
```

Editar los capítulos Markdown en `docs/`. El estilo visual está en `docs/stylesheets/course.css` y el explorador de arquitecturas en `docs/javascripts/explorer.js`.

```bash
python -m mkdocs build --strict
```

## Publicar

En Settings → Pages seleccionar GitHub Actions. El workflow publica los cambios de `main` después de comprobar la construcción. No es necesario subir `site/` al repositorio.

## Ruta de aprendizaje

Física → variables → diseño mediante YAML → entrenamiento en Yuca → interpretación → discusión colectiva. ATLAS Higgs Challenge es la práctica principal; el autoencoder CMS, una extensión exploratoria.
