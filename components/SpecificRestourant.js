import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MapPinIcon, StarIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { Image } from 'expo-image'

export default function SpecificRestourant({
  title,
  rating,
  address,
  genre,
  imgUrl,
  category,
  ID
}) {
  const navigate = useNavigation()

  return (
    <TouchableOpacity
      className="bg-white mr-3 my-3 shadow"
      onPress={() => navigate.navigate('Details', { category, ID })}
    >
      <Image
        source={{ uri: imgUrl }}
        contentFit="cover"
        className="h-[200px] w-[350px] object-contain  round-sm"
      />

      <View className="px-3 pb-4">
        <Text className="font-bold text-lg pt-2">{title}</Text>
        <View className="flex-row items-center space-x-1">
          <StarIcon color="gold" opacity={0.5} size={22} />
          <Text className="text-xs text-orange-200">
            <Text className="text-orange-200"> {rating}</Text> · {genre}
          </Text>
        </View>

        <View className="flex-row items-center space-x-2">
          <MapPinIcon color="grey" opacity={0.4} size={22} />
          <Text className="text-gray-500">{address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
