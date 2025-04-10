import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TCoption2 from '../../components/Missleanous/TCoption2'
import Paymentfunction from '../../components/Tokens/Paymentfunction'
import Slider from '../../components/Home/Slider'
import UserOptions from '../../components/Users/UserOptions'
import OwnerStatsScreen from '../../components/Users/OwnerStatsScreen'
const PaymentScreen = () => {
  return (
    <ScrollView>
      <View>
            <UserOptions />
            <OwnerStatsScreen />
      </View>
    </ScrollView>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({})