import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Header from '../components/Header';

export default function TechnicianIntelligentScreen({ navigation, route }) {
  const { workorder } = route.params || {};

  const workorderData = {
    wo_description: workorder?.description,
    assetnum: workorder?.assetnum,
    location: workorder?.location,
    failurecode: workorder?.failurecode || "",
    worktype: workorder?.worktype,
    workorderid: workorder?.workorderid,
  };

  const features = [
    {
      key: 'AI Asset Diagnosis',
      label: 'AI Asset Diagnosis',
      icon: 'build',
      screen: 'CorrectiveActionsScreen',
    },
    {
      key: 'askGPT',
      label: 'Ask GPT',
      icon: 'smart-toy',
      screen: 'AskGPTScreen',
    },
  ];

  const renderFeatureCard = (item) => (
    <TouchableOpacity
      key={item.key}
      style={styles.card}
      onPress={() =>
        navigation.navigate(item.screen, {
          ...workorderData,
        })
      }
    >
      <MaterialIcons name={item.icon} size={40} color="#007BFF" />
      <Text style={styles.cardText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Technical Assistant" navigation={navigation} />

      <View style={styles.introContainer}>
        <Text style={styles.introText}>
          Explore AI tools to assist with your maintenance task.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {features.map(renderFeatureCard)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  introContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  introText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 2,
    borderColor: '#007BFF', // 🔵 Couleur de bordure
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});
