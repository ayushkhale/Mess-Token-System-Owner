import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using react-native-vector-icons
import { colors } from '../../utils/color';
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = () => {

  
    const navigation = useNavigation();
  
  const logout = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://tse4.mm.bing.net/th?id=OIP.Pgx9J3KDMVZtEhgugDw2MgHaE7&pid=Api&P=0&h=180' }}
        />
        <Text style={styles.joinedText}>MESS ID : HF383G7F</Text>
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>Ashish Anand</Text>
        <Text style={styles.surnameText}>@ashish007</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Icon name="account-circle" size={24} color="black" />
            </View>
            <Text style={styles.optionText}>Profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Icon name="settings" size={24} color="black" />
            </View>
            <Text style={styles.optionText}>Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
              <Icon name="notifications" size={24} color="black" />
            </View>
            <Text style={styles.optionText}>Notifications</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={logout}>
          <View style={[styles.optionContent,{justifyContent:"center"}]}>
            <Text style={[styles.optionText , {textAlign:"center",color:"#fff"}]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  surnameText: {
    fontSize: 20,
    color: '#A0A0A0',
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.gray,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
