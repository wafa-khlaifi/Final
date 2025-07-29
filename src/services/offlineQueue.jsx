import AsyncStorage from '@react-native-async-storage/async-storage';

const TASK_QUEUE_KEY = 'pending_woactivities';

// 🔸 Ajouter une tâche hors ligne
export const saveOfflineWoactivity = async (task) => {
  try {
    const existing = await AsyncStorage.getItem(TASK_QUEUE_KEY);
    const tasks = existing ? JSON.parse(existing) : [];

    console.log("📥 [saveOfflineWoactivity] Tâches existantes récupérées:", tasks);
    tasks.push(task);
    await AsyncStorage.setItem(TASK_QUEUE_KEY, JSON.stringify(tasks));
    console.log("✅ [saveOfflineWoactivity] Nouvelle tâche sauvegardée localement:", task);
  } catch (error) {
    console.error("❌ [saveOfflineWoactivity] Erreur stockage offline :", error);
  }
};

// 🔸 Récupérer toutes les tâches en attente
export const getPendingWoactivities = async () => {
  try {
    const data = await AsyncStorage.getItem(TASK_QUEUE_KEY);
    const tasks = data ? JSON.parse(data) : [];
    console.log("📦 [getPendingWoactivities] Tâches en attente récupérées:", tasks);
    return tasks;
  } catch (error) {
    console.error("❌ [getPendingWoactivities] Erreur récupération des tâches:", error);
    return [];
  }
};

// 🔸 Nettoyer la file des tâches
export const clearPendingWoactivities = async () => {
  try {
    await AsyncStorage.removeItem(TASK_QUEUE_KEY);
    console.log("🗑️ [clearPendingWoactivities] Tâches hors ligne supprimées après synchronisation.");
  } catch (error) {
    console.error("❌ [clearPendingWoactivities] Erreur suppression des tâches:", error);
  }
};
