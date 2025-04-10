import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkconfig from '../../networkconfig';

const TokenScreen = () => {
  const [tokens, setTokens] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to Fetch Token from the Server
  const fetchToken = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('Error', 'Unauthorized! Please log in.');
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
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.tokens || !Array.isArray(data.tokens)) {
        throw new Error('Invalid response: Tokens not found.');
      }
      
      setTokens(data.tokens);

    } catch (error) {
      console.error('Error fetching token:', error);
      Alert.alert('Error',`Failed to fetch token. ${error}`);

    } finally {
      setLoading(false);
    }
  };

  // Fetch Token when Screen Loads
  useEffect(() => {
    fetchToken();
  }, []);

  const renderTokenItem = ({item}) => (
    <View style={styles.tokenItem}>
      <Text style={styles.tokenText}>Token ID: {item._id}</Text>
      <Text style={styles.redeemedText}>Redeemed: {item.redeemed ? 'Yes' : 'No'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Tokens</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : tokens.length > 0 ? (
        <FlatList
          data={tokens}
          keyExtractor={(item) => item._id} // Use _id as the unique key
          renderItem={renderTokenItem} // Render token details
        />
      ) : (
        <Text style={styles.noTokenText}>No tokens available</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={fetchToken}>
        <Text style={styles.buttonText}>Refresh Tokens</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TokenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  tokenItem: {
    backgroundColor: '#E0F7FA',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    width: '100%',
  },
  tokenText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  redeemedText: {
    fontSize: 14,
    color: '#555',
  },
  noTokenText: {
    fontSize: 16,
    color: '#888',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});