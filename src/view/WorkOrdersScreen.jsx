import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import WorkOrderCard from '../components/WorkOrderCard';
import StatusPicker from '../components/StatusPicker';
import { useWorkOrdersViewModel } from '../viewModel/useWorkOrders';

const WorkOrdersScreen = ({ navigation }) => {
  const {
    workOrders,
    loading,
    loadingMore,
    modalVisible,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleStatusPress,
    updateStatus,
    handleLogout,
    loadWorkOrders,
    setModalVisible,
    page,
  } = useWorkOrdersViewModel(navigation);

  return (
    <View style={styles.container}>
      {/* 🔷 Header fusionné avec barre de recherche */}
      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleLogout} style={styles.sideButton}>
          <Ionicons name="log-out-outline" size={28} color="#007BFF" style={{ transform: [{ scaleX: -1 }] }} />
          </TouchableOpacity>

          <Text style={styles.title}>Work Orders</Text>

          <View style={styles.sideButton}>
  <Image
    source={require('../constants/logoAssistQ.jpg')}
    style={{ width: 65, height: 65, borderRadius: 15 }}
    resizeMode="contain"
  />
</View>
        </View>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search...."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
            <Ionicons name="search" size={22} color="#007BFF" />
          {/* </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('QRCodeScannerScreen')}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={22} color="#007BFF" /> */}
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔷 Liste des Work Orders */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={workOrders}
          keyExtractor={(item, index) => `wo-${item.workorderid}-${index}`}
          renderItem={({ item }) => (
            <WorkOrderCard
              workOrder={item}
              onStatusPress={() => handleStatusPress(item)}
              onPress={() => navigation.navigate('WorkorderSubScreen', { workOrder: item })}
            />
          )}
          onEndReached={() => loadWorkOrders(page)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#007BFF" />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* 🔷 Modal de changement de statut */}
      <StatusPicker
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={updateStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // 🔷 Header fusionné
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 1,
    paddingBottom: 10,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sideButton: {
    width: 32,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    flex: 1,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    paddingHorizontal: 1,
    height: 48,
    borderWidth: 1.5,             // épaisseur de la bordure
    borderColor: '#1E88E5',
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },

  iconButton: {
    paddingHorizontal: 11,
  },
});

export default WorkOrdersScreen;
