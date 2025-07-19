import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ title, navigation, onPressLeft }) => {
  return (
    <View style={styles.header}>
      {/* 🔙 Bouton gauche personnalisé ou retour par défaut */}
      {navigation?.canGoBack() || onPressLeft ? (
        <TouchableOpacity
          style={styles.sideButton}
          onPress={onPressLeft || (() => navigation.goBack())}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.sidePlaceholder} />
      )}

      {/* 🏷️ Titre de l'écran */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* 📷 Image logo à droite */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../constants/logoAssistQ.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sideButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidePlaceholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 65, height: 65, borderRadius: 15 

  },
});

export default Header;
