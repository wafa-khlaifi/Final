import React, { useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { createWorkOrder } from '../services/workOrders';
import { getErrorMessage } from '../constants/errors';
import Header from '../components/Header';

const AddWorkOrderScreen = () => {
  const [wonum, setWonum] = useState('');
  const [description, setDescription] = useState('');
  const [siteid, setSiteid] = useState('BEDFORD');
  const [location, setLocation] = useState('BR300');
  const [status, setStatus] = useState('WAPPR');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const handleSubmit = async () => {
    if (!wonum.trim() || !description.trim()) {
      if (isFocused) {
        Alert.alert(
          'Error',
          getErrorMessage('work_orders', 'missing_fields') || 'Please fill in all required fields.'
        );
      }
      return;
    }

    setLoading(true);
    const response = await createWorkOrder({ wonum, description, siteid, location, status });
    setLoading(false);

    if (isFocused) {
      setTimeout(() => {
        if (response.success) {
          Alert.alert('Success', 'Work Order created successfully!');
          navigation.goBack();
        } else {
          Alert.alert('Error', response.error || getErrorMessage('work_orders', 'fetch_error'));
        }
      }, 100);
    }
  };

  const renderField = (label, value, setValue, placeholder) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#A0AEC0"
        style={styles.input}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="New Work Order" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.form}>
        {renderField('Work Order Number', wonum, setWonum, 'WO12345')}
        {renderField('Description', description, setDescription, 'HVAC Maintenance')}
        {renderField('Site ID', siteid, setSiteid, 'BEDFORD')}
        {renderField('Location', location, setLocation, 'BR300')}
        {renderField('Status', status, setStatus, 'WAPPR')}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddWorkOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
