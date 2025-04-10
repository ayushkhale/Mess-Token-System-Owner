import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../utils/color';

const TokenSettings = ({ onSave }) => {
  const [settings, setSettings] = useState({
    pricePerToken: '',
    expirationDays: '',
  });

  const handleInputChange = (field, value) => {
    if (/^\d*$/.test(value)) {
      setSettings((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    const { pricePerToken, expirationDays } = settings;
    if (!pricePerToken || !expirationDays || pricePerToken <= 0 || expirationDays <= 0) {
      alert('Please enter valid values.');
      return;
    }
    onSave({ pricePerToken, expirationDays });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Token Configuration</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={settings.pricePerToken}
          onChangeText={(value) => handleInputChange('pricePerToken', value)}
          placeholder="Set price"
          placeholderTextColor={colors.graymid}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={settings.expirationDays}
          onChangeText={(value) => handleInputChange('expirationDays', value)}
          placeholder="Set duration"
          placeholderTextColor={colors.graymid}
        />
      </View>

      <View style={styles.btnconfig}>


      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => setSettings({ pricePerToken: '', expirationDays: '' })}
        >
        <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>
      
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#e4e4e4',
    shadowColor: '#999',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal:20
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.PRIMARYDARK,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#e4e4e4',
  },
  saveButton: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: "center",
    width:"60%",
  },
  cancelButton:{
    backgroundColor: 'rgba(83, 83, 83, 0.81)',
    padding: 15,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: "center",
    width:"40%",
    marginRight:2
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign:"center",
    fontWeight: 'bold',
  },
  btnconfig:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10, 
  }
});

export default TokenSettings;
