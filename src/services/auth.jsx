// services/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { Buffer } from 'buffer';
import { getErrorMessage } from '../utils/getErrorMessage';
import { getLoginUrl } from './apiConfig';

export const loginUser = async (username, password) => {
  try {
    // Vérification des champs vides
    if (!username || !password) {
      console.log("❌ Username ou mot de passe manquant");
      return { success: false, error: getErrorMessage("auth", "missing_credentials") };
    }

    // Nettoyage des anciennes données
    console.log("🔄 Nettoyage des anciennes données...");
    await AsyncStorage.removeItem('userData');
    await CookieManager.clearAll();

    // Appeler la fonction pour récupérer l'URL de login
    const loginUrl = await getLoginUrl();
    console.log("🌐 URL de login construite:", loginUrl);

    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    console.log("🔑 Tentative de connexion avec Basic Auth...");
    console.log("🔑 Credentials (base64):", credentials);

    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'maxauth': credentials,
        'Accept': 'application/json',
      }
    });
    console.log("📥 Réponse reçue, status:", loginResponse.status);

    const responseText = await loginResponse.text();
    console.log("📄 Texte de la réponse:", responseText);

    let errorMessage = getErrorMessage("auth", "server_error");

    if (loginResponse.status === 200) {
      console.log("✅ Connexion réussie !");
      const cookies = await CookieManager.get(loginUrl);
      console.log("🍪 Cookies récupérés:", cookies);
      const sessionCookie = cookies.JSESSIONID?.value;
      console.log("🔍 Session cookie:", sessionCookie);

      if (!sessionCookie) {
        console.log("❌ Session cookie manquant");
        return { success: false, error: getErrorMessage("auth", "session_expired") };
      }

      // Sauvegarder les informations de session
      const userData = JSON.stringify({ username, password, sessionCookie });
      await AsyncStorage.setItem('userData', userData);
      console.log("💾 Identifiants sauvegardés:", { username, sessionCookie });

      return { success: true, sessionCookie };
    }

    // Gestion des erreurs renvoyées par l'API
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log("⚠️ Réponse JSON d'erreur:", jsonResponse);
      if (jsonResponse["oslc:Error"] && jsonResponse["oslc:Error"]["oslc:message"]) {
        errorMessage = jsonResponse["oslc:Error"]["oslc:message"];
        console.log("🔍 Message d'erreur spécifique:", errorMessage);
      }
    } catch (parseError) {
      console.error("❌ Impossible de parser l'erreur API:", parseError);
    }

    console.error(`❌ Erreur API (${loginResponse.status}):`, errorMessage);
    return { success: false, error: errorMessage };

  } catch (error) {
    console.error("❌ Erreur inattendue :", error);

    if (error.message.includes("Network request failed")) {
      return { success: false, error: getErrorMessage("api", "network_error") };
    } else if (error.message.includes("timeout")) {
      return { success: false, error: getErrorMessage("api", "timeout") };
    } else if (error.message.includes("unauthorized")) {
      return { success: false, error: getErrorMessage("api", "unauthorized") };
    } else {
      return { success: false, error: "Une erreur inattendue est survenue. Veuillez réessayer." };
    }
  }
};



// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CookieManager from '@react-native-cookies/cookies';
// import { Buffer } from 'buffer';
// import { getErrorMessage } from '../utils/getErrorMessage';
// import { getLoginUrl } from './apiConfig';

// export const loginUser = async (username, password) => {
//   try {
//     console.log("🚀 DÉMARRAGE DU LOGIN UTILISATEUR");

//     // 1. Vérification des champs
//     if (!username || !password) {
//       console.log("❌ Username ou mot de passe manquant");
//       return { success: false, error: getErrorMessage("auth", "missing_credentials") };
//     }

//     // 2. Nettoyage des anciennes données
//     console.log("🧹 Nettoyage des données précédentes...");
//     await AsyncStorage.removeItem('userData');
//     await AsyncStorage.removeItem('jwtToken');
//     await CookieManager.clearAll();

//     // 3. Construction de l'URL de Maximo
//     const loginUrl = await getLoginUrl();
//     console.log("🌍 URL de connexion Maximo :", loginUrl);

//     // 4. Construction des credentials (Basic Auth)
//     const credentials = Buffer.from(`${username}:${password}`).toString('base64');
//     console.log("🔐 Encodage Base64 des identifiants :", credentials);

//     // 5. Requête de login à Maximo
//     const loginResponse = await fetch(loginUrl, {
//       method: 'POST',
//       headers: {
//         'maxauth': credentials,
//         'Accept': 'application/json',
//       }
//     });
//     console.log("📥 Réponse de Maximo, statut :", loginResponse.status);

//     const responseText = await loginResponse.text();
//     console.log("📄 Contenu brut de la réponse Maximo :", responseText);

//     // 6. Vérification du succès Maximo
//     if (loginResponse.status === 200) {
//       console.log("✅ Authentification Maximo réussie");

//       const cookies = await CookieManager.get(loginUrl);
//       const sessionCookie = cookies.JSESSIONID?.value;
//       console.log("🍪 Cookie de session récupéré :", sessionCookie);

//       if (!sessionCookie) {
//         console.log("❌ Cookie de session introuvable");
//         return { success: false, error: getErrorMessage("auth", "session_expired") };
//       }

//       // 7. Authentification auprès du backend Express pour obtenir le JWT
//       console.log("🔁 Envoi des identifiants au backend Express...");
//       const tokenResponse = await fetch('http://192.168.43.71:3000/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const tokenData = await tokenResponse.json();
//       console.log("🪙 Réponse backend Express :", tokenData);

//       if (!tokenData.token) {
//         console.log("❌ Token JWT non reçu !");
//         return { success: false, error: "Échec de l'authentification Express." };
//       }

//       const jwtToken = tokenData.token;

//       // 8. Sauvegarde dans AsyncStorage
//       const userData = JSON.stringify({ username, password, sessionCookie ,jwtToken,});
//       await AsyncStorage.setItem('userData', userData);

//       console.log("💾 Données sauvegardées localement :", { username, sessionCookie, jwtToken });

//       // 9. Fin
//       return { success: true, sessionCookie, jwtToken };
//     }

//     // 10. Gestion d'erreur Maximo
//     try {
//       const jsonResponse = JSON.parse(responseText);
//       if (jsonResponse["oslc:Error"]?.["oslc:message"]) {
//         const errorMessage = jsonResponse["oslc:Error"]["oslc:message"];
//         console.log("⚠️ Message d'erreur Maximo :", errorMessage);
//         return { success: false, error: errorMessage };
//       }
//     } catch (errParse) {
//       console.error("❌ Échec du parsing de l'erreur Maximo :", errParse);
//     }

//     console.error("❌ Authentification Maximo échouée");
//     return { success: false, error: getErrorMessage("auth", "server_error") };

//   } catch (error) {
//     console.error("💥 Erreur inattendue pendant login :", error.message);
//     return { success: false, error: "Erreur inattendue. Veuillez réessayer." };
//   }
// };


// 📌 Fonction pour déconnecter l'utilisateur
export const logoutUser = async () => {
    try {
      console.log("🚪 Déconnexion en cours...");
      await AsyncStorage.removeItem('userData'); // Supprimer les données de connexion
      await CookieManager.clearAll(); // Supprimer les cookies
      console.log("✅ Déconnexion réussie !");
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion :", error);
      return { success: false, error: error.message };
    }
  };
 
 