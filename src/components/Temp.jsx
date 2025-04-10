import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const TransferComponent = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transfer</Text>
            <Text style={styles.amount}>$404.00</Text>

            <View style={styles.card}>
                <Image source={{ uri: 'https://link-to-your-bank-logo' }} style={styles.logo} />
                <Text style={styles.bankName}>Bank of America</Text>
                <Text style={styles.score}>Score CaMo Bank</Text>
                <Text style={styles.cardNumber}>0000 **** **** 9999</Text>
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Submit a Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    amount: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 20,
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    bankName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    score: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    button: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    doneButton: {
        marginTop: 10,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#000',
        width: '100%',
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
});

export default TransferComponent;