import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import networkconfig from '../../networkconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleAlert from '../Missleanous/SimpleAlert';
import Loading from '../Missleanous/loader';

const TokenHistory = () => {
  const [tokens, setTokens] = useState([]);
  const [filterSortValue, setFilterSortValue] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          setAlertMessage('Unauthorized! Please log in.');
          setAlertType('error');
          setIsAlertVisible(true);
          return;
        }

        //abhishek ke changes
        let response;
        try{
            response = await fetch(`${networkconfig.BASE_URL}/student/token-history`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });
        }catch(err){
          setAlertMessage(`${err.message}`);
          setAlertType('error');
          setIsAlertVisible(true);
          throw err
        }
       
        const data = await response.json();

        if (!response.ok) {
          console.log(response.status)
          if(response.status === 401){
            throw new Error(`Authentication Required. Please Log In.`);
          }
          else if(response.status === 404){
            throw new Error(`No Token history Found.`);
          }
          else if(response.status === 500){
            throw new Error(`Server Side Problem.Try again later.`);
          }else{
            throw new Error(`failed fetching tokens history.Try again later.`);
          }
        }

        if (data.success && Array.isArray(data.tokens)) {
          setTokens(data.tokens);
        } else {
          setAlertMessage('Unexpected Error Occured.');
          setAlertType('error');
          setIsAlertVisible(true);
          setTokens([]);
        }
        if (data.tokens.length === 0) {
          setAlertMessage('No Tokens Found.');
          setAlertType('error');
          setIsAlertVisible(true);
        }
      } catch (error) {
        setAlertMessage(`${error.message}`);
        setAlertType('error');
        setIsAlertVisible(true);
        setTokens([]);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchTokens();
  }, []);

  const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);
    return `${dateObj.toISOString().split('T')[0]} | ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  const getFilteredAndSortedTokens = () => {
    let filteredTokens = tokens.map((token) => ({
      id: token._id,
      tokenCode: token.tokenCode.substring(0, 12),
      createdDateTime: formatDateTime(token.createdAt),
      expiryDateTime: formatDateTime(token.expiryDate),
      amount: `₹ ${token.amount}`,
      status: token.redeemed ? 'Redeemed' : 'Not Redeemed',
      paymentId: token.transactionId,
      timestamp: new Date(token.createdAt),
    }));

    if (filterSortValue === 'Redeemed') {
      filteredTokens = filteredTokens.filter((token) => token.status === 'Redeemed');
    } else if (filterSortValue === 'Not Redeemed') {
      filteredTokens = filteredTokens.filter((token) => token.status === 'Not Redeemed');
    }

    if (filterSortValue === 'Oldest') {
      filteredTokens.sort((a, b) => a.timestamp - b.timestamp);
    } else if (filterSortValue === 'Newest') {
      filteredTokens.sort((a, b) => b.timestamp - a.timestamp);
    }

    return filteredTokens;
  };

  const redeemedCount = tokens.filter((token) => token.redeemed).length;
  const notRedeemedCount = tokens.length - redeemedCount;

  const renderTokenItem = ({ item }) => (
    <View style={styles.tokenCard}>
      <View style={styles.tokenHeader}>
        <Text style={styles.tokenCode}>Token: {item.tokenCode}</Text>
        <Text style={[styles.statusBadge, item.status === 'Redeemed' ? styles.redeemed : styles.notRedeemed]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.tokenDetails}>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Payment ID</Text>
          <Text style={styles.value}>{item.paymentId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Issued On</Text>
          <Text style={styles.value}>{item.createdDateTime}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Expire On</Text>
          <Text style={styles.value}>{item.expiryDateTime}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (  // Show loading indicator if data is being fetched
        <Loading />
      ) : (
        <>
          <DropDownPicker
            open={openDropdown}
            value={filterSortValue}
            setOpen={setOpenDropdown}
            setValue={setFilterSortValue}
            items={[
              { label: `All Tokens (${tokens.length})`, value: 'All' },
              { label: `Redeemed (${redeemedCount})`, value: 'Redeemed' },
              { label: `Not Redeemed (${notRedeemedCount})`, value: 'Not Redeemed' },
              { label: 'Sort: Oldest', value: 'Oldest' },
              { label: 'Sort: Newest', value: 'Newest' },
            ]}
            containerStyle={styles.dropdown}
            style={styles.dropdownStyle}
            dropDownContainerStyle={styles.dropDownContainer}
          />

          <FlatList data={getFilteredAndSortedTokens()} renderItem={renderTokenItem} keyExtractor={(item) => item.id} />

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
    backgroundColor: '#f8f9fa',
    padding: 20,
    flex:1
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
  tokenCard: {
    backgroundColor: 'rgba(212, 212, 212, 0.49)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tokenCode: {
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
  redeemed: {
    backgroundColor: 'rgb(181, 0, 0)',
    color: 'white',
  },
  notRedeemed: {
    backgroundColor: 'rgba(0, 154, 0, 0.87)',
    color: 'white',
  },
  tokenDetails: {
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

export default TokenHistory;
