import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import networkConfig from '../../networkconfig';  // Ensure networkConfig contains your base URL
import logo from '../../assets/logo.png';  // Assuming you have a logo for this screen
import { colors } from '../../utils/color';  // Ensure this is defined in your utils

const RemoveStudentScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [messid, setMessid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveStudent = async () => {
    if (!username || !messid) {
      Alert.alert('Error', 'Both Username and Mess ID are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${networkConfig.BASE_URL}/remove-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          messid,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message || 'Student removed successfully');
        navigation.goBack(); // Navigate back or reset the form
      } else {
        Alert.alert('Error', result.message || 'An error occurred while removing the student');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.header}>Remove Student</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Mess ID"
          placeholderTextColor="#6B7280"
          value={messid}
          onChangeText={setMessid}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#6B7280"
          value={username}
          onChangeText={setUsername}
        />

        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveStudent} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.removeButtonText}>Remove Student</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.graydark,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.PRIMARYDARK,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 45,
    color: '#000',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    marginBottom: 15,
  },
  removeButton: {
    width: '100%',
    backgroundColor: '#a82424',  // Red for removal action
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RemoveStudentScreen;
