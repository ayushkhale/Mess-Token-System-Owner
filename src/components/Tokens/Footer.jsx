import React from 'react'
import { Dimensions, StyleSheet, Text, View, ImageBackground,TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/Colors'
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('screen').width

const Footer = () => {
  
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('records');
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePress}>
            <ImageBackground
                source={require('../../assets/images/option2.png')}
                style={styles.optionBox}
                imageStyle={styles.imageBackground}
                resizeMode="contain">
                <Text style={styles.optionText}>Download Reports</Text>
                <Ionicons name="chevron-forward-sharp" size={15} color="black" style={{marginLeft:8}} />
            </ImageBackground>
        </TouchableOpacity>
      </View>
  )
}

export default Footer

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: 10,
    marginBottom:20
  },
  optionBox: {
    width: screenWidth * 0.9,
    marginHorizontal: 10,
    height: 100,
    borderRadius:5,
    padding: 20,
    backgroundColor: Colors.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom:10,
    overflow:"hidden"
  },
  imageBackground: {
    position: 'absolute',
    marginLeft:90,
    right:0,
    top: 20
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
  }
})
