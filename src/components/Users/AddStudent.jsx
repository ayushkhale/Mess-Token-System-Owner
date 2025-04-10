import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import networkConfig from '../../networkconfig';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import SimpleAlert from '../../components/Missleanous/SimpleAlert';
import { colors } from '../../utils/color';

const CreateStudent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('ayush@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [messid, setMessid] = useState('');  
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  
  const navigation = useNavigation();

  const handleCreateStudent = async () => {
    if (!username || !email || !password || !confirmPassword || !messid) {
      setAlertMessage('All fields are required');
      setAlertType('error');
      setIsAlertVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords do not match');
      setAlertType('error');
      setIsAlertVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${networkConfig.BASE_URL}/create-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username, 
          email, 
          password, 
          confirmPassword, 
          messid,  
          role: 'student'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create student. Try again later.');
      }

      setAlertMessage('Student created successfully.');
      setAlertType('success');
      setIsAlertVisible(true);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertType('error');
      setIsAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Enter Student Details</Text>

        {isAlertVisible && (
          <SimpleAlert
            visible={isAlertVisible}
            message={alertMessage}
            type={alertType}
            onClose={() => setIsAlertVisible(false)}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Mess ID"
          placeholderTextColor="#6B7280"
          value={messid}
          onChangeText={setMessid} 
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#6B7280"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.signInButton} onPress={handleCreateStudent} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInButtonText}>Create Student</Text>}
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
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.PRIMARYDARK,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 45,
    color: "#000",
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    marginBottom: 15,
  },
  signInButton: {
    width: '100%',
    backgroundColor: '#00796B',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateStudent;
