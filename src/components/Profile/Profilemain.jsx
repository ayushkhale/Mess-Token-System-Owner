import React, { useEffect, useState } from 'react';
import { 
    View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/color';
import networkconfig from '../../networkconfig';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const Profilemain = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error("Authentication required. Please log in again.");
            }

            const response = await fetch(`${networkconfig.BASE_URL}/student/profile-data`, {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch profile data: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data || !data.success) {
                throw new Error(data.message || "Invalid profile data received");
            }

            // Set user data from the correct response structure
            setUserData(data.data);
            
            // Set username from the profile data
            if (data.data.username) {
                setUsername(data.data.username);
            }
        } catch (error) {
            // console.error('Error fetching user data:', error);
            // Alert.alert(
            //     'Error',
            //     error.message || 'Failed to fetch profile data. Please try again.',
            //     [
            //         {
            //             text: 'Retry',
            //             onPress: () => fetchUserData()
            //         },
            //         {
            //             text: 'Cancel',
            //             style: 'cancel'
            //         }
            //     ]
            // );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        try {
            setIsUpdating(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error("No token found");

            const response = await fetch(`${networkconfig.BASE_URL}/student/profile-update`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            if (data.success) {
                await fetchUserData(); // Refresh profile data
                // Alert.alert('Success', 'Profile updated successfully');
            } else {
                throw new Error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            // Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );
             // Only run once on component mount

    useEffect(() => {
        // Set up the header with edit button
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    onPress={() => navigation.navigate('EditProfile', { userData })}
                    style={styles.headerButton}
                >
                    <Icon name="edit" size={24} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, userData]); 

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                await AsyncStorage.multiRemove(['authToken', 'isLoggedIn', 'username']);
                navigation.replace('Login');
                return;
            }

            const response = await fetch(`${networkconfig.BASE_URL}/owner/logout`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            await AsyncStorage.multiRemove(['authToken', 'isLoggedIn', 'username']);
            navigation.replace('Login');
        } catch (error) {
            console.error('Logout failed:', error);
            await AsyncStorage.multiRemove(['authToken', 'isLoggedIn', 'username']);
            navigation.replace('Login');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color={colors.PRIMARY} style={styles.loader} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: userData?.profileImage || 'https://static.vecteezy.com/system/resources/previews/004/607/791/non_2x/man-face-emotive-icon-smiling-male-character-in-blue-shirt-flat-illustration-isolated-on-white-happy-human-psychological-portrait-positive-emotions-user-avatar-for-app-web-design-vector.jpg' }}
                />
                <Text style={styles.messIdText}>MESS ID: {userData?.mess_id || 'Not Available'}</Text>
            </View>

            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{userData?.fullName || 'Not Available'}</Text>
                <Text style={styles.usernameText}>@{username || 'User'}</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                            <Icon name="email" size={16} color={colors.PRIMARY} />
                            <Text style={styles.infoText}>{userData?.email || 'Not Available'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="phone" size={16} color={colors.PRIMARY} />
                            <Text style={styles.infoText}>{userData?.phone || 'Not Available'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="cake" size={16} color={colors.PRIMARY} />
                            <Text style={styles.infoText}>
                                {userData?.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not Available'}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="person" size={16} color={colors.PRIMARY} />
                            <Text style={styles.infoText}>{userData?.age ? `${userData.age} years` : 'Not Available'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}>
                            <Icon name="work" size={16} color={colors.PRIMARY} />
                            <Text style={styles.infoText}>{userData?.profession || 'Not Available'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="location-on" size={16} color={colors.PRIMARY} />
                            <Text style={styles.infoText}>{userData?.address || 'Not Available'}</Text>
                        </View>
                    </View>
                    {userData?.bio && (
                        <View style={styles.bioContainer}>
                            <Text style={styles.bioTitle}>About</Text>
                            <Text style={styles.bioText}>{userData.bio}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
                    <Text style={styles.signOutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 6,
    },
    messIdText: {
        fontSize: 14,
        color: colors.PRIMARY,
        fontWeight: '600',
    },
    nameContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    usernameText: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        width: '100%',
    },
    infoCard: {
        backgroundColor: colors.gray,
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: colors.PRIMARY,
    },
    infoGrid: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    bioContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    bioTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: colors.PRIMARY,
    },
    bioText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.gray,
        borderRadius: 8,
        marginBottom: 8,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionText: {
        fontSize: 14,
    },
    signOutButton: {
        backgroundColor: colors.PRIMARY,
        paddingVertical: 13,
        paddingHorizontal: 24,
        borderRadius: 6,
        alignItems: 'center',
    },
    signOutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    headerButton: {
        marginRight: 16,
        padding: 4,
    },
});

export default Profilemain;
