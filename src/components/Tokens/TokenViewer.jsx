import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkconfig from '../../networkconfig';
import TokenCoin from './TokenCoin';

import SimpleAlert from "../../components/Missleanous/SimpleAlert";

const TokenViewer = () => {
  const [tokenCount, setTokenCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  


  const fetchTokenData = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        setAlertMessage(`Authentication Required. Please Log In.`);
        setAlertType('error');
        setIsAlertVisible(true);
        return { success: false, message: 'Unauthorized: No auth token found.' };
      }

      const response = await fetch(`${networkconfig.BASE_URL}/student/token-data`, {
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
          throw new Error(`failed fetching token data.Try again later.`);
        }
      }
      
      const data = await response.json();
      
      if (!data.tokens || !Array.isArray(data.tokens)) {
        throw new Error('Invalid response format. Tokens not found.Try again later.');
      }
          
      await AsyncStorage.setItem('tokens', JSON.stringify(data.tokens));
      setTokenCount(data.tokens.length);
     
    } catch (error) {
      setAlertMessage(`${error.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const loadTokenData = async () => {
      try {
        const storedTokens = await AsyncStorage.getItem('tokens');
        if (storedTokens) {
          const parsedTokens = JSON.parse(storedTokens);
          setTokenCount(parsedTokens.length);
        } else {
          fetchTokenData();
        }
        
      } catch (error) {
        setAlertMessage('Failed to fetch tokens. Try again later');
        setAlertType('error');
        setIsAlertVisible(true);
      }
    };

    loadTokenData();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.circle}>
          <TokenCoin tokenCount={tokenCount} />
        </View>
      </View>
      <TouchableOpacity 
        style={styles.redeemButton}
        onPress={fetchTokenData}
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
    backgroundColor: '#D3D3D3', 
    borderRadius: 15, 
    marginHorizontal: 20,
    margin: 10,
    overflow: 'hidden', 
    height: 200, 
    justifyContent: "center",
    alignItems: "center"
  },
  circle: {
    width: 250, 
    height: 250, 
    borderRadius: 150, 
    backgroundColor: '#c4c4c4',
  },
  redeemButton: {
    backgroundColor: '#333', 
    padding: 15,
    margin: 10,
    marginHorizontal: 20,
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1, 
  },
});

export default TokenViewer;
