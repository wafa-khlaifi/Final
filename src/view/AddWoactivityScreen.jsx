import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import Header from '../components/Header';
import { createWoactivity } from '../services/woactivity';
import NetInfo from '@react-native-community/netinfo';
import { saveOfflineWoactivity } from '../services/offlineQueue';

const AddWoactivityScreen = ({ route, navigation }) => {
  const { workorderid } = route.params;

  const [description, setDescription] = useState('');
  const [assetnum, setAssetnum] = useState('');
  const [location, setLocation] = useState('BR300');
  const [status, setStatus] = useState('WAPPR');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // 🔄 Écoute de la connexion réseau
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("📶 Connexion changée :", state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleAddWoactivity = async () => {
    console.log("🟡 Bouton 'Ajouter' cliqué");
    
    if (!description.trim()) {
      console.warn("❌ Description vide !");
      Alert.alert('Erreur', 'Veuillez entrer une description.');
      return;
    }

    const woactivityData = {
      workorderid,
      activity: {
        description: description.trim(),
        assetnum,
        location,
        status,
      },
      timestamp: Date.now()
    };

    console.log("📋 Données à traiter :", woactivityData);

    setLoading(true);

    try {
      const netState = await NetInfo.fetch();
      console.log("🌐 Connexion internet détectée ?", netState.isConnected);

      if (!netState.isConnected) {
        console.log("📴 Hors ligne : sauvegarde en local...");
        await saveOfflineWoactivity(woactivityData);
        Alert.alert('Mode hors ligne', 'Tâche sauvegardée localement. Elle sera envoyée dès que vous serez en ligne.');
        navigation.goBack();
        return;
      }

      const payload = [{
        description: woactivityData.activity.description,
        woactivity: [{
          assetnum: woactivityData.activity.assetnum,
          location: woactivityData.activity.location,
          status: woactivityData.activity.status,
        }]
      }];

      console.log("📡 Envoi de la tâche à Maximo avec payload :", payload);
      const response = await createWoactivity(workorderid, payload);

      if (response.success) {
        console.log("✅ Tâche ajoutée avec succès sur Maximo");
        Alert.alert('Succès', 'Woactivity ajouté avec succès.');
        navigation.goBack();
      } else {
        console.warn("⚠️ Erreur API :", response.error);
        Alert.alert('Erreur', response.error || "Une erreur s'est produite.");
      }

    } catch (error) {
      console.error("❌ Exception lors de l'ajout :", error.message);
      Alert.alert('Erreur', error.message);
    } finally {
      console.log("🔚 Fin de traitement, loading = false");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Ajouter Woactivity" navigation={navigation} />

      {/* 🔌 État de la connexion */}
      {!isConnected ? (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>🔌 Hors ligne — les tâches seront stockées localement</Text>
        </View>
      ) : (
        <View style={styles.onlineBanner}>
          <Text style={styles.onlineText}>✅ En ligne</Text>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Description :</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Entrez la description..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Asset :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le asset..."
          value={assetnum}
          onChangeText={setAssetnum}
        />
        <Text style={styles.label}>Location :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez la Location..."
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Status :</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le Status..."
          value={status}
          onChangeText={setStatus}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddWoactivity}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.addButtonText}>Ajouter</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  offlineBanner: {
    backgroundColor: '#FFCDD2',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: '#B71C1C',
    fontWeight: 'bold',
  },
  onlineBanner: {
    backgroundColor: '#C8E6C9',
    padding: 10,
    alignItems: 'center',
  },
  onlineText: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
});

export default AddWoactivityScreen;
