import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Titre */}
      <Text style={styles.title}>Mon Profil</Text>

      {/* Informations de l'utilisateur */}
      <View style={styles.infoCard}>
        <Ionicons name="person-outline" size={20} color="#007BFF" />
        <Text style={styles.infoText}>Nom : Wafa Khlaifi</Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="mail-outline" size={20} color="#007BFF" />
        <Text style={styles.infoText}>Email : wafa.khlaifi@example.com</Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="call-outline" size={20} color="#007BFF" />
        <Text style={styles.infoText}>Téléphone : +216 55 123 456</Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="briefcase-outline" size={20} color="#007BFF" />
        <Text style={styles.infoText}>Poste : Technicienne</Text>
      </View>

      {/* Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
