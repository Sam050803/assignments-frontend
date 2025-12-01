# Génération des données de test avec Mockaroo

Ce fichier explique comment générer le fichier `assignments.json` avec 500 assignments en utilisant Mockaroo.

## Étapes pour générer les données

1. **Aller sur https://mockaroo.com/**
2. **Configurer les champs** (3 champs seulement, pas besoin d'id) :
   - **nom** : Type "Custom List" ou "Job Title" ou "Course Name" (vous pouvez créer votre propre liste de noms de devoirs)
   - **dateDeRendu** : Type "Date", Format: ISO 8601 (ex: 2024-01-15T00:00:00.000Z)
   - **rendu** : Type "Boolean"
   
   **Note** : Ne pas inclure le champ "id" dans Mockaroo, il sera généré automatiquement par le service

3. **Définir le nombre de lignes** : 500
4. **Format** : JSON
5. **Cliquer sur "Download"** pour télécharger le fichier
6. **Renommer le fichier** en `assignments.json`
7. **Remplacer** le fichier `public/assignments.json` dans ce projet

## Format attendu du JSON

```json
[
  {
    "nom": "Nom du devoir",
    "dateDeRendu": "2024-01-15T00:00:00.000Z",
    "rendu": true
  },
  {
    "nom": "Autre devoir",
    "dateDeRendu": "2024-02-20T00:00:00.000Z",
    "rendu": false
  }
]
```

**Note** : Le champ "id" n'est pas nécessaire dans le JSON, il sera généré automatiquement lors de l'insertion.

## Notes importantes

- **Les IDs sont générés automatiquement** par le service lors de l'insertion (pas besoin de les inclure dans le JSON)
- Le service évite les doublons en vérifiant les noms (insensible à la casse)
- Les dates doivent être au format ISO 8601 pour être correctement parsées
- Si vous cliquez plusieurs fois sur "Peupler BD", seuls les nouveaux assignments seront ajoutés (pas de doublons)

