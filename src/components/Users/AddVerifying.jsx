import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import networkConfig from '../../networkconfig';
import logo from '../../assets/logo.png'; // Assuming you have a logo for this screen
import { colors } from '../../utils/color';

const AddVerifying = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { email } = "route.params"; // Get the email passed from the SignUp screen
  const [otp, setOtp] = useState('');
  const [messid, setMessid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp || !messid) {
      Alert.alert('Error', 'OTP and Mess ID are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${networkConfig.BASE_URL}/sign-up/otp-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          messid,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', result.message || 'An error occurred');
        navigation.navigate('signup');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      navigation.navigate('Register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.header}>Verify OTP</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Mess ID"
          placeholderTextColor="#6B7280"
          value={messid}
          onChangeText={setMessid}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
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
  verifyButton: {
    width: '100%',
    backgroundColor: '#00796B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddVerifying;
