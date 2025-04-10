import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import networkConfig from '../../networkconfig';
import logo from '../../assets/logo.png'
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import SimpleAlert from '../../components/Missleanous/SimpleAlert';


const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  

  const navigation = useNavigation();

  const roles = ['student', 'owner'];

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword || !role) {
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
      const response = await fetch(`${networkConfig.BASE_URL}/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(response.status)
        if(response.status === 400){
          throw new Error(`${result.message}`);
        }
        else if(response.status === 500){
          throw new Error(`Server Side Problem.Try again later.`);
        }else{
          throw new Error(`failed .Try again later.`);
        }
      }

      navigation.navigate('OTP', { email: email });

      setAlertMessage(`OTP sent successfully.`);
      setAlertType('error');
      setIsAlertVisible(true);
     
    } catch (error) {
      setAlertMessage(`${error.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.logoContainer}>
              <Image
                source={logo}  // URL of the logo image
                style={styles.logo}
              />
            </View> */}
      <Text style={styles.header}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#aaa" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      
      <Button title={isLoading ? 'Signing Up...' : 'Sign Up'} onPress={handleSignUp} disabled={isLoading} color="#1A78C2" />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?  
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
        <SimpleAlert
          visible={isAlertVisible}
          message={alertMessage}
          type={alertType}
          onClose={() => setIsAlertVisible(false)}
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
    marginBottom: 40, 
  },
  logo: {
    width: 250,  
    height: 100, 
    resizeMode: 'contain',  
    marginBottom:40
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
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
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#888',
  },
  link: {
    color: '#1A78C2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
