import { Dimensions, FlatList, Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native' 

const Slider = () => {
  const navigation = useNavigation();

  const sliderList = [
    {
      id: 1,
      name: "slider1",
      imageurl: "https://i.ibb.co/xtZzQRdR/slider-2.jpg",
      screen: "notifications" 
    },
    {
      id: 2,
      name: "slider2",
      imageurl: "https://i.ibb.co/NnyWw84D/slider-3.jpg",
      screen: "PaymentHistory"
    },
    {
      id: 3,
      name: "slider3",
      imageurl: "https://i.ibb.co/nNYb4VVt/slider1.jpg",
      screen: "PaymentHistory"
    }
  ]

  const flatListRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sliderList.length
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: nextIndex, animated: true })
        }
        return nextIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate(item.screen)}> 
            <Image
              source={{ uri: item.imageurl }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </View>
  )
}

export default Slider

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('screen').width * 0.9,
    height: 170,
    marginHorizontal: 20,
    margin:10,
    borderRadius: 5,
  }
})
