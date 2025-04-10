import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import networkConfig from '../../networkconfig';
import logo from '../../assets/logo.png';  // Assuming you have a logo for this screen as well

const OTPScreen = () => {
  const route = useRoute(); // Hook to get route params
  const navigation = useNavigation(); // Hook to navigate between screens

  const { email } = route.params; // Get the email passed from the SignUp screen
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp) {
      console.log('Error: OTP is required');
      Alert.alert('Error', 'OTP is required');
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
        }),
      });
      const result = await response.json();

      if (response.ok) {
        console.log('OTP verified:', result.message);
        Alert.alert('Success', result.message);
        navigation.navigate('Login');
      } else {
        console.log('Error:', result.message || 'An error occurred');
        Alert.alert('Error', result.message || 'An error occurred');
        navigation.navigate('signup');
      }
    } catch (error) {
      console.log('Network error:', error);
      navigation.navigate('Register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Verify OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Button
        title={isLoading ? 'Verifying OTP...' : 'Verify OTP'}
        onPress={handleVerifyOTP}
        disabled={isLoading}
        color="#1A78C2"  // Adjusted color to match your login button style
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,  // Space between logo and form
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#000',
    backgroundColor: '#f7f7f7',
  },
});

export default OTPScreen;
