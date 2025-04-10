import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/color';

const Header = () => {
  const navigation = useNavigation();

  // Navigate to the profile screen
  const goToProfile = () => {
    navigation.navigate('Profile');
  };
  const logout = () => {
    navigation.navigate('login');
  };

  // Handle cart button press
  const handlePress = async () => {
      navigation.navigate('notifications');
  };

  return (
    <View style={styles.headerbox}>
      <StatusBar backgroundColor={colors.PRIMARY} barStyle="light-content" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <TouchableOpacity onPress={goToProfile}>
          <Image 
            source={{ uri: 'https://tse4.mm.bing.net/th?id=OIP.Pgx9J3KDMVZtEhgugDw2MgHaE7&pid=Api&P=0&h=180' }}
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.greetingText}>Welcome Back,</Text> 
          <Text style={styles.userNameText}>Ashish Anand</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handlePress} style={styles.icon}>
        <MaterialIcons name="notifications" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

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