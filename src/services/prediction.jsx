// /**
//  * Récupère la prédiction pour un workorder donné.
//  * @param {number} workorderid - L'identifiant du workorder (en minuscules).
//  * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
//  */
// export const fetchPredictionByWorkorderId = async (
//     workorderid: number
//   ): Promise<{ success: boolean; data?: any; error?: string }> => {
//     try {
//       const apiUrl = `http://localhost:3000/predict/${workorderid}`;
//       console.log(`[Prediction] Appel API : ${apiUrl}`);
  
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       console.log(`[Prediction] Status de la réponse : ${response.status}`);
  
//       if (!response.ok) {
//         throw new Error(`Erreur HTTP ${response.status}`);
//       }
  
//       const data = await response.json();
//       console.log(`[Prediction] Données reçues :`, data);
  
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
//       console.error('[Prediction] Erreur :', errorMessage);
//       return {
//         success: false,
//         error: errorMessage,
//       };
//     }
//   };
  