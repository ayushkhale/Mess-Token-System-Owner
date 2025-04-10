import React from 'react';
import { Dimensions, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons
import { colors } from '../../utils/color';

const screenWidth = Dimensions.get('screen').width;

const UserOptions = () => {
  const navigation = useNavigation();

  const categories = [
    { id: '1', name: 'Add Student', icon: 'person-add', screen: 'adduser' },
    { id: '2', name: 'Remove Student', icon: 'person-remove', screen: 'removeuser' },
    { id: '3', name: 'All Students', icon: 'diversity-1', screen: 'allusers' }
  ];

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categorybox} onPress={() => handlePress(item.screen)}>
      <Icon name={item.icon} size={30} color={colors.graydark} style={styles.icon} />
      <Text style={styles.categorytext}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

export default UserOptions;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',

  },
  row: {
    justifyContent: 'space-around',
  },
  categorybox: {
    width: screenWidth * 0.28,
    height: screenWidth * 0.25,
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "#e4e4e4", 
    shadowColor: '#999', 
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  icon: {
    marginBottom: 5,
  },
  categorytext: {
    color:colors.graydark,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
