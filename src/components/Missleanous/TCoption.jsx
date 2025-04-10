import React from 'react';
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../utils/color';

const screenWidth = Dimensions.get('screen').width;

const TCoption = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('adduser');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.optionBox}>
          <Text style={styles.optionText}>Add New Users</Text>
          <Icon name="keyboard-double-arrow-right" size={30} color="white" style={styles.icon} />
          <Image
            source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/tap-previous-3d-icon-download-in-png-blend-fbx-gltf-file-formats--app-mobile-interface-digital-gesture-hand-sign-pack-symbols-icons-8965645.png' }}
            style={styles.optionImage}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TCoption;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 10,
  },
  optionBox: {
    width: screenWidth * 0.9,
    marginHorizontal: 10,
    height: 100,
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#333",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  optionImage: {
    position: 'absolute',
    left: 10,
    width: 80,
    height: 100,
    borderRadius: 8, // optional: to add rounded corners to the image
    resizeMode: 'cover',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft:100,
    color: '#fff',
    flex: 1,
  },
  icon: {
  },
});
