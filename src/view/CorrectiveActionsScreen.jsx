// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Header from '../components/Header';

// export default function CorrectiveActionsScreen({ route, navigation }) {
//   const {
//     wo_description,
//     assetnum,
//     location,
//     failurecode,
//     worktype,
//   } = route.params || {};

//   const [loading, setLoading] = useState(true);
//   const [prediction, setPrediction] = useState(null);
//   const [error, setError] = useState(null);
//   console.log('🧭 route.params =', route.params);

//   const BASE_URL = 'http://192.168.43.71:3000';

//   useEffect(() => {
//     const fetchPrediction = async () => {
//       setLoading(true);
//       console.log('🔍 Début de la prédiction...');
//       try {
//         console.log('📦 Données reçues depuis route.params:', {
//           wo_description,
//           assetnum,
//           location,
//           failurecode,
//           worktype,
//         });

//         if (!wo_description || !assetnum || !location || !worktype) {
//           const missing = [];
//           if (!wo_description) missing.push('wo_description');
//           if (!assetnum) missing.push('assetnum');
//           if (!location) missing.push('location');
//           if (!worktype) missing.push('worktype');
//           const msg = `Champs requis manquants: ${missing.join(', ')}`;
//           console.error('❌ ' + msg);
//           setError(msg);
//           setLoading(false);
//           return;
//         }

//         const payload = {
//           wo_description,
//           assetnum,
//           location,
//           failurecode: failurecode || "",
//           worktype,
//         };

//         console.log('📤 Envoi de la requête POST à :', `${BASE_URL}/predict`);
//         console.log('📨 Payload :', payload);

//         const response = await fetch(`${BASE_URL}/predict`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error('⚠️ Erreur HTTP :', response.status, errorData);
//           throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('✅ Réponse reçue :', data);

//         setPrediction(data);
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
//         console.error('🚨 Erreur de prédiction :', errorMessage);
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//         console.log('🔚 Fin de prédiction.');
//       }
//     };

//     fetchPrediction();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Header title="Corrective Actions" navigation={navigation} />
//       {loading ? (
//         <ActivityIndicator size="large" color="#007BFF" />
//       ) : error ? (
//         <View style={styles.centeredContainer}>
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Erreur</Text>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         </View>
//       ) : (
//         <ScrollView contentContainerStyle={styles.centeredContainer}>
//           <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
//             <Text style={styles.cardTitle}>Résultat de prédiction</Text>

//             <View style={styles.resultRow}>
//               <Ionicons name="alert-circle-outline" size={20} color="#FF5733" style={styles.icon} />
//               <Text style={styles.resultKey}>Failure Code :</Text>
//               <Text style={styles.resultValue}>{prediction.predicted_failurecode}</Text>
//             </View>

//             <Text style={[styles.cardTitle, { fontSize: 16, marginTop: 20 }]}>
//               Activités recommandées :
//             </Text>
//             {prediction.recommended_activities.map((activity, index) => (
//               <View key={index} style={styles.resultRow}>
//                 <Ionicons name="checkmark-circle-outline" size={20} color="#007BFF" style={styles.icon} />
//                 <Text style={styles.resultValue}>{activity}</Text>
//               </View>
//             ))}
//           </Animatable.View>
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f1f5f9',
//   },
//   centeredContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   card: {
//     width: '90%',
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#007BFF',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//     textAlign: 'center',
//   },
//   resultRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   icon: {
//     marginRight: 8,
//   },
//   resultKey: {
//     fontWeight: '600',
//     color: '#555',
//     fontSize: 14,
//     marginRight: 6,
//   },
//   resultValue: {
//     fontSize: 14,
//     color: '#000',
//     flexShrink: 1,
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

export default function CorrectiveActionsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const simulatedPrediction = {
        predicted_cost: '1200 TND',
        predicted_failurecode: 'Overheating Motor',
        recommended_activities: [
          'Check the cooling system and clean the air filters.',
          'Inspect for any blocked ventilation paths.',
          'Ensure ambient temperature is within safe range.',
        ],
        required_materials: [
          'Cooling Fan (Model CF-200)',
          'Air Filter Replacement Kit',
          'Thermal Paste',
        ],
      };
      setPrediction(simulatedPrediction);
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="AI Asset Diagnosis" navigation={navigation} />
      {loading ? (
        <View style={styles.centeredContainer}>
          <Animatable.View animation="pulse" iterationCount="infinite">
            <Ionicons name="robot-outline" size={60} color="#007BFF" />
          </Animatable.View>
          <Text style={styles.loadingText}>AI is analyzing your asset...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.centeredContainer}>
          {/* Cost Prediction Card */}
          <Animatable.View animation="fadeInUp" delay={200} duration={700} style={[styles.card, { borderLeftColor: '#00b894' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="cash-outline" size={24} color="#00b894" />
              <Text style={styles.cardTitle}>Estimated Maintenance Cost</Text>
            </View>
            <Text style={styles.cardContentText}>
              💰 <Text style={styles.highlight}>{prediction.predicted_cost}</Text>
            </Text>
          </Animatable.View>

          {/* Problem Diagnosis Card */}
          <Animatable.View animation="fadeInUp" delay={400} duration={700} style={[styles.card, { borderLeftColor: '#e17055' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="alert-circle-outline" size={24} color="#e17055" />
              <Text style={styles.cardTitle}>Detected Problem</Text>
            </View>
            <Text style={styles.cardContentText}>
              ⚠️ <Text style={styles.highlight}>{prediction.predicted_failurecode}</Text>
            </Text>
          </Animatable.View>

          {/* Recommended Actions Card */}
         

          {/* Required Materials Card */}
          <Animatable.View animation="fadeInUp" delay={800} duration={700} style={[styles.card, { borderLeftColor: '#6c5ce7' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="cube-outline" size={24} color="#6c5ce7" />
              <Text style={styles.cardTitle}>Required Materials</Text>
            </View>
            {prediction.required_materials.map((material, index) => (
              <View key={index} style={styles.actionRow}>
                <Ionicons name="ellipsis-horizontal-circle-outline" size={20} color="#6c5ce7" style={styles.actionIcon} />
                <Text style={styles.actionText}>{material}</Text>
              </View>
            ))}
          </Animatable.View>
          <Animatable.View animation="fadeInUp" delay={1000} duration={700} style={[styles.card, { borderLeftColor: '#0984e3' }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="construct-outline" size={24} color="#0984e3" />
              <Text style={styles.cardTitle}>Recommended Actions</Text>
            </View>
            {prediction.recommended_activities.map((activity, index) => (
              <View key={index} style={styles.actionRow}>
                <Ionicons name="checkmark-done-outline" size={20} color="#0984e3" style={styles.actionIcon} />
                <Text style={styles.actionText}>{activity}</Text>
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
    backgroundColor: '#f0f4f8',
  },
  centeredContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '500',
  },
  card: {
    width: '95%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2d3436',
  },
  cardContentText: {
    fontSize: 16,
    color: '#333',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#d63031',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  actionIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  actionText: {
    fontSize: 15,
    color: '#2d3436',
    flex: 1,
  },
});
