import NetInfo from '@react-native-community/netinfo';
import { getPendingWoactivities, clearPendingWoactivities } from './offlineQueue';
import { createWoactivity } from './woactivity';

/**
 * Tente de synchroniser les tâches WOActivity stockées hors ligne.
 * @param {string} sessionCookie - Le cookie de session pour l’authentification Maximo.
 */
export const syncOfflineWoactivities = async (sessionCookie) => {
  console.log("🔄 [syncOfflineWoactivities] Lancement de la synchronisation...");

  const netState = await NetInfo.fetch();
  console.log("🌐 [syncOfflineWoactivities] Connexion Internet :", netState.isConnected);

  if (!netState.isConnected) {
    console.log("📴 [syncOfflineWoactivities] Pas de connexion. Annulation de la synchronisation.");
    return;
  }

  const tasks = await getPendingWoactivities();
  if (!tasks.length) {
    console.log("📭 [syncOfflineWoactivities] Aucune tâche à synchroniser.");
    return;
  }

  console.log(`📤 [syncOfflineWoactivities] ${tasks.length} tâche(s) à synchroniser.`);

  for (const task of tasks) {
    const { workorderid, activity } = task;
    const payload = [{
      description: activity.description,
      woactivity: [{
        assetnum: activity.assetnum,
        location: activity.location,
        status: activity.status,
      }]
    }];
    try {
      console.log(`📡 [syncOfflineWoactivities] Envoi de la tâche "${activity.description}" pour le WO ${workorderid}`);
      await createWoactivity(workorderid, payload, sessionCookie);
      console.log("✅ [syncOfflineWoactivities] Tâche synchronisée avec succès :", activity.description);
    } catch (error) {
      console.warn("❌ [syncOfflineWoactivities] Échec de synchronisation :", error.message);
    }
  }

  await clearPendingWoactivities();
};
