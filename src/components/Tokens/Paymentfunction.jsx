import React, { useState } from 'react';
import { View, Text, Button, Alert, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import networkConfig from '../../networkconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleAlert from "../Missleanous/SimpleAlert";
import { colors } from '../../utils/color';

const tokenPrice = 50;

const PaymentScreen = () => {
  const [formData, setFormData] = useState({
    Tokens: 0,
    TokenAmount: "0",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');

  // Handle Token Selection
  const handleTokenChange = (value) => {
    if (value < 0) return;
    const tokenAmount = value * tokenPrice;
    setFormData({ Tokens: value, TokenAmount: tokenAmount.toString() });
  };

  const validateForm = () => {
    let errors = {};
    if (formData.Tokens <= 0) {
      errors.TokenAmount = "Select at least 1 token.";
    }
    return errors;
  };

  const handlePayment = async (data) => {
    try {
      if (!data || !data.order || !data.order.id || !data.order.amount) {
        throw new Error("Invalid order details received.");
      }
      
      const paymentOptions = {
        key: "rzp_test_YLcCxJsmoMsREn",
        order_id: data.order.id,
        amount: data.order.amount,
        currency: "INR",
        name: "Dakshi Foundation",
        description: "Token Purchase",
        prefill: {
          email: "user@example.com",
          contact: "9876543210",
        },
      };

      const response = await RazorpayCheckout.open(paymentOptions);
      
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setAlertMessage('Unauthorized! Please log in.');
        setAlertType('error');
        setIsAlertVisible(true);
        return;
      }

      const verifyResponse = await fetch(`${networkConfig.BASE_URL}/common/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          signature: razorpay_signature,
        }),
      });

      if (!verifyResponse.ok) {
        console.log(verifyResponse.status)
        if(verifyResponse.status === 401){
          throw new Error(`Authentication Required. Please Log In.`);
        }
        else if(verifyResponse.status === 500){
          throw new Error(`Server Side Problem.Try again later.`);
        }else{
          throw new Error(`Order creation failed.Try again later.`);
        }
      }

      let apiData = await verifyResponse.json();
      console.log("Payment Successfull. Token Issued.")

      setAlertMessage(`${apiData.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
  
    } catch (error) {
      console.log('Payment Error:', error.message);
      setAlertMessage(`${error.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setAlertMessage('Unauthorized! Please log in.');
          setAlertType('error');
          setIsAlertVisible(true);
          return;
        }

        const response = await fetch(`${networkConfig.BASE_URL}/common/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ tokenCount: formData.Tokens }),
        });

        if (!response.ok) {
          console.log(response.status)
          if(response.status === 401){
            throw new Error(`Authentication Required. Please Log In.`);
          }
          else if(response.status === 500){
            throw new Error(`Server Side Problem.Try again later.`);
          }else{
            throw new Error(`Order creation failed.Try again later.`);
          }
        }

        let data;

        try{
           data = await response.json();
        }catch(err){
          console.log(err)
          throw err
        }
        
        if (!data || !data.order || !data.order.id) {
          throw new Error("Order creation failed. No order ID received.");
        }
        
        try{
          await handlePayment(data);
          console.log("Order Created Successfully.");
        }catch(err){
          console.log(err)
          throw err
        }
       
        setFormData({ TokenAmount: "0", Tokens: 0 });

      } catch (err) {
        console.error("Error in Payment order creation", err.message);
        setAlertMessage(`${err.message}`);
        setAlertType('error');
        setIsAlertVisible(true);
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err.message);
      setAlertMessage(`${err.message}`);
      setAlertType('error');
      setIsAlertVisible(true);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Buy Cash Tokens For Student</Text>

      <TokenStepper quantity={formData.Tokens} setQuantity={handleTokenChange} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputsmall}
          placeholder="Mess ID"
          placeholderTextColor={colors.graymid}
          value={formData.MessID}
          onChangeText={(text) => setFormData({ ...formData, MessID: text })}
        />
        {errors.MessID && <Text style={styles.errorText}>{errors.MessID}</Text>}

        <TextInput
          style={styles.inputsmall}
          placeholder="Username"
          placeholderTextColor={colors.graymid}
          value={formData.Username}
          onChangeText={(text) => setFormData({ ...formData, Username: text })}
        />
        {errors.Username && <Text style={styles.errorText}>{errors.Username}</Text>}
      </View>

      <View style={styles.amountAndButtonContainer}>
        <View style={styles.tokenAmount}>
          <Text style={styles.tokenAmounttext}>₹{formData.TokenAmount}</Text>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.redeemButton} disabled={isLoading}>
          <Text style={styles.buttonText2}>{isLoading ? "process.." : "Buy Tokens"}</Text>
        </TouchableOpacity>
      </View>


      <SimpleAlert
        visible={isAlertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setIsAlertVisible(false)}
      />


      <Modal visible={isModalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <Button title="Close" onPress={() => setIsModalOpen(false)} />
        </View>
      </Modal>
    </View>
  );
};


const TokenStepper = ({ quantity, setQuantity }) => {
  const handleChange = (text) => {
    const value = parseInt(text, 10);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    } else if (text === "") {
      setQuantity(0);
    }
  };

  return (
    <>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => setQuantity(quantity - 1)}
          disabled={quantity <= 0}
        >
          <Text style={styles.stepperText}>-</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity.toString()}
          onChangeText={handleChange}
        />

        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>

  
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    width:"90%",
    justifyContent: 'center',
    alignItems: "center",
    borderWidth: 1,
    borderRadius:10,
    borderColor: '#ccc',
    backgroundColor: "#e4e4e4", 
    shadowColor: '#999', 
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal:20,
    marginTop:10,
  },
  heading: {
    fontSize: 20,
    position:"relative",
    fontWeight:"bold",
    top:"5%",
    marginVertical: 5,
    color: colors.PRIMARYDARK,
    textAlign: 'center',
  },
  amountAndButtonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10, 
    marginHorizontal:20
  },
  tokenAmount: {
    backgroundColor: 'rgba(83, 83, 83, 0.81)',
    padding: 15,
    margin:2,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: "center",
    width:"50%"
  },
  tokenAmounttext: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  redeemButton: {
    backgroundColor: colors.PRIMARY,
    padding: 15,
    margin:2,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: "center",
    width:"50%"
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    padding: 30,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  stepperButton: {
    width: 40,
    height: 60,
  },
  stepperText: {
    fontSize: 40,
    color: "#333",
  },
  input: {
    width: 180,
    height: 90,
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold",
    color: colors.PRIMARYDARK
  },
  buttonText2: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  inputContainer: {
    width: "90%",
  },
  inputsmall: {
    height: 40,
    color:colors.graydark,
    borderColor: colors.graydark,
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 15,
  },
});

export default PaymentScreen;
