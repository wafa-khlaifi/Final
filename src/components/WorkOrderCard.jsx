import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WorkOrderCard = ({ workOrder, onPress, onStatusPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getStatusColor(workOrder.status) }]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.wonum}>WO: {workOrder.wonum}</Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onStatusPress();
          }}
          style={[styles.statusBadge, { backgroundColor: getStatusColor(workOrder.status) }]}
        >
          <Text style={styles.statusText}>{workOrder.status}</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {workOrder.description || 'Pas de description'}
      </Text>

      {/* Ligne de séparation */}
      <View style={styles.separator} />

      {/* Détails */}
      <View style={styles.detailsContainer}>
      <Detail icon="person-outline" label="Reported By" value={workOrder.reportedby} />

        <Detail icon="location-outline" label="Emplacement" value={workOrder.location} />
        <Detail icon="pricetag-outline" label="Asset" value={workOrder.assetnum} />
        <Detail icon="alert-circle-outline" label="Priorité" value={workOrder.calcpriority} />

      </View>
    </TouchableOpacity>
  );
};

const Detail = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <Ionicons name={icon} size={18} color="#444" />
    <View style={{ marginLeft: 8 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  </View>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'WAPPR': return '#0085FF';   // Orange vif (Présentation)
    case 'APPR': return '#00B1B1';    // Vert vif (Tableau blanc)
    case 'WSCH': return '#00B853';    // Bleu vif (Feuille de calcul)
    case 'WMATL': return '#FF6D00';   // Bleu turquoise (Canva Doc)
    case 'WPCOND': return '#FF4F5E';  // Rose corail (Réseaux)
    case 'INPRG': return '#FF2D87';   // Rose fuchsia (Éditeur photo)
    case 'COMP': return '#D350FF';    // Violet fluo (Vidéos)
    case 'CLOSE': return '#FF2D87';  // Bleu foncé saturé (Site Web)
    case 'CAN': return '#38b6ff';     // Rose doux (option intermédiaire)
    default: return '#FF2D87';        // Gris clair (par défaut neutre)
  }
  
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 10,
    borderLeftWidth: 5, // Bande à gauche
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wonum: {
    fontSize: 16,
    //fontWeight: 'bold',
    color: '#222',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 70,                      // ✅ largeur minimale du badge
    justifyContent: 'center',         // ✅ centrer verticalement
    alignItems: 'center',             // ✅ centrer horizontalement
  },
  
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginTop: 10,
    marginBottom: 12,
    lineHeight: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#777',
  },
  detailValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
});

export default WorkOrderCard;
