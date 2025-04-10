import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Slider from '../../components/Home/Slider'
import TCoption from '../../components/Missleanous/TCoption'
import TokenCounter from '../../components/Home/TokenCounter'
import NavDivs from '../../components/Home/NavDivs'
import OwnerStats from '../../components/Home/OwnerStats'



const HomeScreen = () => {
  return (
    <View style={styles.homecontainer}>
      <TCoption />
      <NavDivs />
      <OwnerStats />
      <Slider />
      <View style={styles.footer}>
        <Text style={styles.footerText}>&copy; MTS Plus, All rights reserved. </Text>
      </View>

    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  homecontainer:{
    display:"flex",
    justifyContent:"center",
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
})