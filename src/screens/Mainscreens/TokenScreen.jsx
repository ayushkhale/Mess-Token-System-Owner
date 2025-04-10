import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TokenDetails from '../../components/Tokens/TokenHistory'
import TokenViewer from '../../components/Tokens/TokenViewer'
import TokenRedeemer from '../../components/Tokens/TokenRedeemer'
import NavDivs from '../../components/Home/NavDivs'

import Paymentfunction from '../../components/Tokens/Paymentfunction'
import TokenEditor from '../../components/Tokens/TokenEditor'
import TCoption2 from '../../components/Missleanous/TCoption2'


const TokenScreen = () => {
  return (
    <View>
      <ScrollView>
        <Paymentfunction/>
        <TCoption2 />
        <TokenEditor />
      </ScrollView>
        
    </View>
  )
}

export default TokenScreen

const styles = StyleSheet.create({})