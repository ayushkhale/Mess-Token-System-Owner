import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import networkconfig from '../../networkconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleAlert from '../Missleanous/SimpleAlert';
import Loading from '../Missleanous/loader';

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterSortValue, setFilterSortValue] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          setAlertMessage('Unauthorized! Please log in.');
          setAlertType('error');
          setIsAlertVisible(true);
          return;
        }
        const response = await fetch(`${networkconfig.BASE_URL}/student/payment-history`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.log(response.status)
          if(response.status === 401){
            throw new Error(`Authentication Required. Please Log In.`);
          }
          else if(response.status === 404){
            throw new Error(`No Payment history Found.`);
          }
          else if(response.status === 500){
            throw new Error(`Server Side Problem.Try again later.`);
          }else{
            throw new Error(`failed fetching payment history.Try again later.`);
          }
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setAlertMessage('Unexpected Error Occurred.');
          setAlertType('error');
          setIsAlertVisible(true);
          setTransactions([]);
        }
        if (data.transactions.length === 0) {
          setAlertMessage('No Transactions Found.');
          setAlertType('error');
          setIsAlertVisible(true);
        }
      } catch (error) {
        setAlertMessage(`${error.message}`);
        setAlertType('error');
        setIsAlertVisible(true);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    return `${dateObj.toISOString().split('T')[0]} | ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  const getFilteredAndSortedTransactions = () => {
    let filteredTransactions = transactions.map((transaction) => ({
      id: transaction._id,
      transactionId: transaction.transaction_id,
      paymentMethod: transaction.payment_method,
      amount: `₹ ${transaction.amount}`,
      tokenPurchased: transaction.tokens_purchased,
      date: formatDateTime(transaction.createdAt),
      status: transaction.status,
      timestamp: new Date(transaction.createdAt),
    }));

    // Filter based on the selected status
    if (filterSortValue === 'captured') {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.status === 'captured');
    } else if (filterSortValue === 'authorized') {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.status === 'authorized');
    } else if (filterSortValue === 'failed') {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.status === 'failed');
    } else if (filterSortValue === 'refunded') {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.status === 'refunded');
    } else if (filterSortValue === 'created') {
      filteredTransactions = filteredTransactions.filter((transaction) => transaction.status === 'created');
    }

    // Sorting by date
    if (filterSortValue === 'Oldest') {
      filteredTransactions.sort((a, b) => a.timestamp - b.timestamp);
    } else if (filterSortValue === 'Newest') {
      filteredTransactions.sort((a, b) => b.timestamp - a.timestamp);
    }

    return filteredTransactions;
  };

  const capturedCount = transactions.filter((transaction) => transaction.status === 'captured').length;
  const authorizedCount = transactions.filter((transaction) => transaction.status === 'authorized').length;
  const failedCount = transactions.filter((transaction) => transaction.status === 'failed').length;
  const refundedCount = transactions.filter((transaction) => transaction.status === 'refunded').length;
  const createdCount = transactions.filter((transaction) => transaction.status === 'created').length;

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionCode}>ID: {item.transactionId}</Text>
        <Text style={[styles.statusBadge, styles[item.status.toLowerCase()]]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.transactionDetails}>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Tokens Purchased:</Text>
          <Text style={styles.value}>{item.tokenPurchased}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>{item.paymentMethod}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <DropDownPicker
            open={openDropdown}
            value={filterSortValue}
            setOpen={setOpenDropdown}
            setValue={setFilterSortValue}
            items={[
              { label: `All Transactions (${transactions.length})`, value: 'All' },
              { label: `captured (${capturedCount})`, value: 'captured' },
              { label: `authorized (${authorizedCount})`, value: 'authorized' },
              { label: `failed (${failedCount})`, value: 'failed' },
              { label: `refunded (${refundedCount})`, value: 'refunded' },
              { label: `created (${createdCount})`, value: 'created' },
              { label: 'Sort: Oldest', value: 'Oldest' },
              { label: 'Sort: Newest', value: 'Newest' },
            ]}
            containerStyle={styles.dropdown}
            style={styles.dropdownStyle}
            dropDownContainerStyle={styles.dropDownContainer}
          />

          <FlatList data={getFilteredAndSortedTransactions()} renderItem={renderTransactionItem} keyExtractor={(item) => item.id} />

          <SimpleAlert
            visible={isAlertVisible}
            message={alertMessage}
            type={alertType}
            onClose={() => setIsAlertVisible(false)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  dropdown: {
    marginBottom: 15,
  },
  dropdownStyle: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  dropDownContainer: {
    backgroundColor: '#ffffff',
  },
  transactionCard: {
    backgroundColor: 'rgba(212, 212, 212, 0.49)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  transactionCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    overflow: 'hidden',
    color: '#fff',
  },
  captured: {
    backgroundColor: '#28a745', // Green
    color: 'white',
  },
  authorized: {
    backgroundColor: '#ffc107', // Yellow
    color: 'white',
  },
  failed: {
    backgroundColor: '#dc3545', // Red
    color: 'white',
  },
  refunded: {
    backgroundColor: '#6c757d', // Gray
    color: 'white',
  },
  created: {
    backgroundColor: '#17a2b8', // Blue
    color: 'white',
  },
  transactionDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PaymentHistory;
