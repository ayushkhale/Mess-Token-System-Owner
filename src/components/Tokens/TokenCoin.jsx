import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const TokenCoin = ({ tokenCount }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the floating effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 10, // Move up
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0, // Move back down
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.coin,
          { transform: [{ translateY: floatAnim }] }, // Apply the float animation
        ]}
      >
        <View style={styles.front}>
          <View style={styles.star}></View>
          <Text style={styles.currency}>{tokenCount}</Text>
          <View style={styles.shapes}>
            <View style={styles.shape_l}></View>
            <View style={styles.shape_r}></View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  coin: {
    position: 'relative',
    width: 150,
    height: 150,
    margin: 'auto',
    shadowColor: '#00aaff',  // Set the glow color to blue
    shadowOffset: { width: 0, height: 0 },  // Set shadow to center
    shadowRadius: 100,  // Set the size of the glow
    shadowOpacity: 0.8,  // Set the intensity of the glow
  },
  front: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0073e6', // Change the coin color to blue
    borderRadius: 75,
    borderTopWidth: 7,
    borderTopColor: '#3399ff', // Lighter blue for the top border
    borderLeftWidth: 7,
    borderLeftColor: '#3399ff',
    borderRightWidth: 7,
    borderRightColor: '#005bb5', // Darker blue for the right border
    borderBottomWidth: 7,
    borderBottomColor: '#005bb5', // Darker blue for the bottom border
    transform: [{ rotate: '44deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
    top: 18.5,
    left: 18.5,
    width: 100,
    height: 100,
    backgroundColor: '#66b3ff', // Light blue for the star
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#3399ff',
    zIndex: 2,
  },
  currency: {
    position: 'absolute',
    color: '#003366', // Dark blue for the currency text
    fontSize: 40,
    textAlign: 'center',
    lineHeight: 60,
    transform: [{ rotate: '-44deg' }],
    zIndex: 3,
    textShadowColor: '#004d80', // Dark blue shadow for the text
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
  shapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: [{ rotate: '-44deg' }],
  },
  shape_l: {
    width: 20,
    height: 4,
    backgroundColor: '#005bb5',
    borderTopWidth: 2,
    borderTopColor: '#003366',
    margin: 75,
  },
  shape_r: {
    width: 20,
    height: 4,
    backgroundColor: '#005bb5',
    borderTopWidth: 2,
    borderTopColor: '#003366',
    margin: 75,
  }
});

export default TokenCoin;
