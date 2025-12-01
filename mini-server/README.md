# Mini Serveur Web

Ce mini serveur web sert les fichiers statiques de l'application Angular.

## Architecture

Pour que ce serveur fonctionne, les fichiers Angular compilés doivent être dans `dist/browser/`.

## Déploiement

1. Compiler le frontend Angular : `cd ../assignment-app && npm run build`
2. Copier les fichiers compilés : `cp -r dist/assignment-app/browser ../mini-server/dist/`
3. Déployer ce mini serveur sur Render.com

## Configuration Render.com

- **Build Command**: `npm run build` (ou un script qui copie les fichiers)
- **Start Command**: `npm run start`

