import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkconfig from '../../networkconfig';
import Coin from './Coin';
import { ScreenContainer } from 'react-native-screens';

import SimpleAlert from "../../components/Missleanous/SimpleAlert";

const TokenCounter = () => {

  const [tokenCount, setTokenCount] = useState(0);
  const [loading, setLoading] = useState(false);

   const [isAlertVisible, setIsAlertVisible] = useState(false);
   const [alertMessage, setAlertMessage] = useState('');
   const [alertType, setAlertType] = useState('info');
    

  const fetchTokenCount = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        setAlertMessage(`Authentication Required. Please Log In.`);
        setAlertType('error');
        setIsAlertVisible(true);
        return;
      }

      const response = await fetch(`${networkconfig.BASE_URL}/student/tokens`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, 
        },
      });

      if (!response.ok) {
        console.log(response.status)
        if(response.status === 401){
          throw new Error(`Authentication Required. Please Log In.`);
        }
        else if(response.status === 500){
          throw new Error(`Server Side Problem.Try again later.`);
        }else{
          throw new Error(`failed fetching token number..Try again later.`);
        }
      }

      const data = await response.json();

      if (data.totalTokens == null) {
        throw new Error('Invalid response.Tokens not found.');
      }

      setTokenCount(data.totalTokens);

    } catch (error) {
      setAlertMessage(`${error.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Token Count when Screen Loads
  useEffect(() => {
    fetchTokenCount();
  }, []);

  return (
    <View>
      {/* <Text style={styles.header}>{tokenCount}</Text> */}
      <View style={styles.container}>
        <View style={styles.circle}>
          <Coin tokenCount={tokenCount} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.redeemButton}
        onPress={fetchTokenCount}
      >
        <Text style={styles.buttonText}>{loading ? 'Refreshing...' : 'Refresh'}</Text>
      </TouchableOpacity>

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
    width: Dimensions.get('screen').width * 0.9,
    backgroundColor: '#D3D3D3',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: 'hidden',
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: "center",
  },
  circle: {
    width: 280,
    height: 280, // Circle height
    borderRadius: 150,
    backgroundColor: '#c4c4c4',
    justifyContent: "center",
    alignItems: "center"

  },
  text: {
    fontSize: 18, // Font size of the text
    color: '#333', // Dark gray text color
    textAlign: 'center', // Ensure text is centered inside the circle
  },
  redeemButton: {
    backgroundColor: '#333',
    padding: 15,
    margin: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // For Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1, // Spacing between letters
  },
});


export default TokenCounter;
