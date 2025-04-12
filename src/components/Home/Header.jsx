import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/color';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import networkconfig from '../../networkconfig';

const Header = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) return;

                const response = await fetch(`${networkconfig.BASE_URL}owner/notifications`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch user data");

                const data = await response.json();
                if (data.success) {
                    setUserData(data.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={styles.headerbox}>
            <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image 
                        source={{ uri: userData?.profileImage || 'https://static.vecteezy.com/system/resources/previews/004/607/791/non_2x/man-face-emotive-icon-smiling-male-character-in-blue-shirt-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg' }}
                        style={styles.profileImage} 
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.greetingText}>Welcome Back,</Text> 
                    <Text style={styles.userNameText}>{userData?.fullName || 'Owner'}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('notifications')}>
                <Icon name="notifications" size={30} color="white" style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerbox: {
        padding: 15,
        backgroundColor: colors.PRIMARY,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 50,
        height: 50,
        marginRight: 15,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'white',
    },
    greetingText: {
        fontSize: 15,
        color: colors.SECONDARY,
    },
    userNameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.SECONDARY,
    },
    icon: {
        marginRight: 10,
    },
});

export default Header;