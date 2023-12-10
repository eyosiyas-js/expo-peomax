import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { MapPinIcon, StarIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { Skeleton } from '@motify/skeleton'
import { useState } from 'react'

export default function RestaurantCard({
  title,
  rating,
  address,
  genre,
  imgUrl,
  category,
  ID,
}) {
  const navigate = useNavigation()
  const [show, setShow] = useState(title ? false : true)
  const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
      type: 'timing',
      duration: 1500,
    },
    // backgroundColor: '#D4D4D4',
  }
  return (
    <TouchableOpacity
      className="bg-white mr-3 shadow"
      onPress={() => navigate.navigate('Details', { category, ID })}
    >
      <Skeleton show={show} {...SkeletonCommonProps}>
        {show ? (
          <Image
            source={{ uri: imgUrl }}
            // className="h-36 w-64 round-sm"
          />
        ) : (
          <Image source={{ uri: imgUrl }} className="h-36 w-64 round-sm" />
        )}
      </Skeleton>
      <Skeleton show={show} {...SkeletonCommonProps}>
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
      </Skeleton>
    </TouchableOpacity>
  )
}
