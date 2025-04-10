import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet, Modal,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [securityCode, setSecurityCode] = useState('');

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
    if (loading) return;
    setIsModalVisible(true);
  };

  const startRedemptionProcess = async () => {
    setIsModalVisible(false);
    setLoading(true);
    setError(null);

    try {
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
        body: JSON.stringify({ tokenIds: arrayToSend, securityCode }),
      });

      setSecurityCode('')

      if (!response.ok) {
        console.log(response.status)
        if(response.status === 401){
          throw new Error(`Authentication Required. Please Log In.`);
        }
        else if(response.status === 500){
          throw new Error(`Server Side Problem.Try again later.`);
        }else{
          throw new Error(`Submission failed. Refresh and try again.`);
        }
      }

      const result = await response.json();
      const remainingTokens = parsedArray.slice(quantity);
      await AsyncStorage.setItem('tokens', JSON.stringify(remainingTokens));

      setAlertMessage('Success! Refresh to reflect the changes.');
      setAlertType('success'); 
      setIsAlertVisible(true);

    } catch (err) {
      setAlertMessage(`${err.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
      console.log("Error:", err);

    } finally {
      setLoading(false);
      setQuantity(1);
    }
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

      <SimpleAlert
        visible={isAlertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setIsAlertVisible(false)}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Password</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Security Code"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={true}
                value={securityCode}
                onChangeText={setSecurityCode}
                autoCapitalize="none"
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={startRedemptionProcess}
                  style={[styles.modalButton, securityCode.trim() === "" && styles.modalDisabledButton]}
                  disabled={securityCode.trim() === ""}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setIsModalVisible(false) , setSecurityCode('')}  } style={styles.modalCancelButton}>
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
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
  }, modalOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(51, 51, 51, 0.72)", // Semi-transparent white
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#222",
  },
  modalInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F7F7F7",
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  modalDisabledButton: {
    backgroundColor: "#A0A0A0",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default QuantitySelector;
