import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet,Text } from 'react-native';

const Loading = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  // Trigger the animation when the component is mounted
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate the rotation value for the coin animation
  const rotateY = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.coin, { transform: [{ rotateY }] }]}>
        <View style={styles.tails}></View>
        <View style={styles.heads}></View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height:"650"
  },
  coin: {
    backgroundColor: '#1A78C2', 
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
    transformStyle: 'preserve-3d',
  },
  tails: {
    backgroundColor: '#1A78C2',
    position: 'absolute',
    borderRadius: 50,
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    zIndex: 1,
  },
  heads: {
    backgroundColor: '#1A78C2', 
    position: 'absolute',
    borderRadius: 50,
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    zIndex: 0,
  },
});

export default Loading;
