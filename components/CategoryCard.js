import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'

import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function CategoryCard({ image, title }) {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Category', {
          title: title == 'lounge' ? 'clubs' : title,
        })
      }
      className="relative mr-2"
    >
      <Image
        source={{
          uri: image,
        }}
        className="h-20 w-[95px] bg-gray-300 p-4 rounded"
      />
      <Text className="absolute bottom-1 left-1 text-white font-bold ">
        {title}
      </Text>
    </TouchableOpacity>
  )
}
