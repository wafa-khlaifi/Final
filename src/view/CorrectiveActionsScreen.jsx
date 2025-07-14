import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ Pour les icônes
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ajoute cette ligne en haut


export default function CorrectiveActionsScreen({ route, navigation }) {
  const { workorderid } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://192.168.43.71:3000';

  // useEffect(() => {
  //   const fetchPrediction = async () => {
  //     setLoading(true);
  //     try {
  //       const apiUrl = `${BASE_URL}/predict/${workorderid}`;
  //       console.log(`[API] Fetching: ${apiUrl}`);

  //       const response = await fetch(apiUrl, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (response.status === 404) {
  //         const data = await response.json();
  //         setError(data.message || 'Workorder introuvable.');
  //         return;
  //       }

  //       if (!response.ok) {
  //         throw new Error(`Erreur HTTP ${response.status}`);
  //       }

  //       const data = await response.json();
  //       console.log('[API] Data received:', data);
  //       setPrediction(data);
  //     } catch (err) {
  //       const errorMessage =
  //         err instanceof Error ? err.message : 'Erreur inconnue';
  //       console.error('[API] Error:', errorMessage);
  //       setError(errorMessage);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (workorderid) {
  //     fetchPrediction();
  //   } else {
  //     setError("Aucun workorderid fourni.");
  //     setLoading(false);
  //   }
  // }, [workorderid]);


  useEffect(() => {
    const fetchPrediction = async () => {
      console.log('🚀 Démarrage de fetchPrediction');
      setLoading(true);
      try {
        console.log('🔍 Récupération du token depuis AsyncStorage...');
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString || '{}');
        const token = userData?.jwtToken;
  
        console.log('🪪 Token récupéré :', token);
  
        if (!token) {
          console.warn("⚠️ Token manquant !");
          setError("Token d'authentification manquant.");
          setLoading(false);
          return;
        }
  
        const apiUrl = `${BASE_URL}/predict/${workorderid}`;
        console.log(`[🌐] URL appelée : ${apiUrl}`);
        console.log(`[🔐] En-tête Authorization : Bearer ${token}`);
  
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        console.log('[📥] Statut de la réponse :', response.status);
  
        if (response.status === 404) {
          const data = await response.json();
          console.warn('⚠️ Workorder introuvable :', data);
          setError(data.message || 'Workorder introuvable.');
          return;
        }
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
  
        const data = await response.json();
        console.log('[✅] Données reçues :', data);
        setPrediction(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erreur inconnue';
        console.error('[💥] Erreur attrapée :', errorMessage);
        setError(errorMessage);
      } finally {
        console.log('🔚 Fin de fetchPrediction');
        setLoading(false);
      }
    };
  
    if (workorderid) {
      console.log('📌 Workorder ID fourni :', workorderid);
      fetchPrediction();
    } else {
      console.warn("⚠️ Aucun workorderid fourni.");
      setError("Aucun workorderid fourni.");
      setLoading(false);
    }
  }, [workorderid]);
  
  return (
    <View style={styles.container}>
      <Header title="Corrective Actions" navigation={navigation} />
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : error ? (
        <View style={styles.centeredContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Erreur</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.centeredContainer}>
          <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
            <Text style={styles.cardTitle}>Résultat de prédiction</Text>
            {Object.entries(prediction).map(([key, value]) => (
              <View key={key} style={styles.resultRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#007BFF" style={styles.icon} />
                <Text style={styles.resultKey}>{key}:</Text>
                <Text style={styles.resultValue}>{String(value)}</Text>
              </View>
            ))}
          </Animatable.View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  centeredContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  resultKey: {
    fontWeight: '600',
    color: '#555',
    fontSize: 14,
    marginRight: 6,
  },
  resultValue: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
  },
});
