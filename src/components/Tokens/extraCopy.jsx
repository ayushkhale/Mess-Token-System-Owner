import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkconfig from "../../networkconfig";
import SimpleAlert from "../../components/Missleanous/SimpleAlert";
import { colors } from "../../utils/color";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);
  const [storedArray, setStoredArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [isModalVisible, setIsModalVisible] = useState(false); // Controls modal visibility
  const [securityCode, setSecurityCode] = useState(''); // Stores the entered security code
  const [isCodeValid, setIsCodeValid] = useState(false); // Flag to check if code is valid

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => Math.max(1, prev - 1));

  useEffect(() => {
    const fetchArrayFromStorage = async () => {
      try {
        const savedArray = await AsyncStorage.getItem('tokens');
        if (savedArray) {
          setStoredArray(JSON.parse(savedArray));
        }
      } catch (err) {
        setAlertMessage('Failed to Update Tokens.');
        setAlertType('error');
        setIsAlertVisible(true);
      }
    };

    fetchArrayFromStorage();
  }, []);

  const handleRedeem = async () => {
    if (loading || !isCodeValid) return;

    // Show the modal to enter the security code
    setIsModalVisible(true);
  };

  const startRedemptionProcess = async () => {
    setIsModalVisible(false); // Close the modal once the security code is entered

    setLoading(true);
    setError(null);

    try {
      // Your token redemption logic goes here
      const savedArray = await AsyncStorage.getItem('tokens');
      const parsedArray = JSON.parse(savedArray || '[]');

      let arrayToSend = [];
      if (parsedArray.length >= quantity) {
        arrayToSend = parsedArray.slice(0, quantity).map(item => item._id);
      } else {
        throw new Error('Insufficient tokens');
      }

      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        setAlertMessage('Authentication Required: You are not logged in.');
        setAlertType('error');
        setIsAlertVisible(true);
        return;
      }

      const response = await fetch(`${networkconfig.BASE_URL}/student/token-submission`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tokenIds: arrayToSend, securityCode }), // Include the security code in the request
      });

      if (!response.ok) {
        setAlertMessage('Submission failed. Refresh and try again.');
        setAlertType('error');
        setIsAlertVisible(true);
        return;
      }

      const result = await response.json();
      const remainingTokens = parsedArray.slice(quantity);
      await AsyncStorage.setItem('tokens', JSON.stringify(remainingTokens));

      setAlertMessage('Success! Refresh to reflect the changes.');
      setAlertType('success');
      setIsAlertVisible(true);

    } catch (err) {
      setAlertMessage(`Error in request sending function: ${err.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
      console.log("Error:", err);
    } finally {
      setLoading(false); // Reset loading state after operation
      setQuantity(1); // Reset quantity
    }
  };

  const SecurityCodeModal = ({ visible, onClose, onSubmit }) => {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Security Code</Text>

            <TextInput
              style={styles.input}
              placeholder="Security Code"
              keyboardType="numeric"
              value={securityCode}
              onChangeText={setSecurityCode}
            />

            <TouchableOpacity
              onPress={() => {
                if (securityCode === 'your_secret_code') { // Check against a predefined code or logic
                  setIsCodeValid(true);
                  onSubmit();
                } else {
                  setIsCodeValid(false);
                  alert('Invalid Code');
                }
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepperContainer}>
        <TouchableOpacity onPress={decrement} style={styles.button}>
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity.toString()}
          onChangeText={(text) => {
            const num = Math.max(1, Number(text));
            setQuantity(num);
          }}
        />

        <TouchableOpacity onPress={increment} style={styles.button}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleRedeem} style={styles.redeemButton} disabled={loading}>
        <Text style={styles.buttonText2}>{loading ? "Redeeming..." : "Redeem"}</Text>
      </TouchableOpacity>

      {/* SimpleAlert Component for Error and Success Messages */}
      <SimpleAlert
        visible={isAlertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setIsAlertVisible(false)} // Close the alert on pressing "OK"
      />

      {/* Modal for Security Code */}
      <SecurityCodeModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={startRedemptionProcess}  // Start the redemption after code validation
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginHorizontal: 20,
    paddingTop: 20,
    marginVertical: 15,
    backgroundColor: "#D3D3D3",
    borderRadius: 15,
    justifyContent: "space-evenly",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginVertical: 10,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#D3D3D3",
  },
  button: {
    width: 80,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 30,
    color: "#333",
  },
  input: {
    width: 150,
    height: 90,
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#D3D3D3",
    color: 'rgb(29, 96, 203)'
  },
  redeemButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    width: 300,
    marginVertical: 10,
  },
  buttonText2: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QuantitySelector;
