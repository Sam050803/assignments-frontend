/**
 * Configuration de l'application
 * Modifiez ces valeurs selon votre environnement
 */

export const APP_CONFIG = {
  // URL de l'API backend
  // Pour développement local: 'http://localhost:8010/api/assignments'
  // Pour production (Render.com): 'https://assignments-api-tx4d.onrender.com/api/assignments'
  API_URL: 'https://assignments-api-tx4d.onrender.com/api/assignments',
  
  // Mode développement (true = localhost, false = production)
  // Changez cette valeur pour basculer entre dev et prod
  USE_LOCAL_API: false,
  
  // URL locale pour le développement
  LOCAL_API_URL: 'http://localhost:8010/api/assignments',
  
  // URL de production
  PRODUCTION_API_URL: 'https://assignments-api-tx4d.onrender.com/api/assignments'
};

/**
 * Retourne l'URL de l'API selon la configuration
 */
export function getApiUrl(): string {
  return APP_CONFIG.USE_LOCAL_API ? APP_CONFIG.LOCAL_API_URL : APP_CONFIG.PRODUCTION_API_URL;
}

