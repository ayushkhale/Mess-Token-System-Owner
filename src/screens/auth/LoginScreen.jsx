import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import networkConfig from '../../networkconfig';
import logo from '../../assets/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../utils/color';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [ mess_id, setmess_id] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password || !mess_id) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${networkConfig.BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, mess_id, role }), 
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || 'Invalid credentials');
        return;
      }

      // Store both token and username
      await AsyncStorage.multiSet([
        ['authToken', result.token],
        ['username', username],
        ['isLoggedIn', 'true']
      ]);
      
      navigation.navigate('Main');
    } catch (error) {
      setError('Network error. Please try again later');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Mess ID"
          placeholderTextColor="#6B7280"
          value={mess_id}
          onChangeText={setmess_id}
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
          placeholder="Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Forgot Your Password?{' '}
          <Text style={styles.signUpText} onPress={() => navigation.navigate('forgotpass')}>
            Reset
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY || '#f4f4f4', // ✅ Added fallback color
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 50,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 45,
    color: '#000',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
    marginBottom: 15,
  },
  signInButton: {
    width: '100%',
    backgroundColor: colors.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    color: '#333',
    fontSize: 14,
  },
  signUpText: {
    color: colors.PRIMARY,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
