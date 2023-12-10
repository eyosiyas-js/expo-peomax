import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MapPinIcon, StarIcon, UserIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native'
import { ClockIcon } from 'react-native-heroicons/outline'
import { Image } from 'expo-image'
import { Skeleton } from '@motify/skeleton'

export default function SpecialEvents({
  title,
  date,
  address,
  endDate,
  imgUrl,
  eventEnd,
  eventStart,
  premiumPrice,
  price,
  description,
  totalSpots,
  totalBooks,
  eventID
}) {
  const navigate = useNavigation()
  const SLIDER_WIDTH = Dimensions.get('window').width + '100'
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
      className="bg-white mr-3 shadow w-[400px]"
      onPress={() =>
        navigate.navigate('BookEvent', {
          title,
          date,
          address,
          endDate,
          imgUrl,
          eventEnd,
          eventStart,
          premiumPrice,
          price,
          description,
          totalSpots,
          totalBooks,
          eventID
        })
      }
    >
      <View className="items-center">
        {title ? (
          <Image source={{ uri: imgUrl }} className="h-48 w-[99%] round-sm" />
        ) : (
          <Text></Text>
        )}
      </View>
      <Skeleton show={title ? false : true} {...SkeletonCommonProps}>
        <View className="px-3 pb-4 ml-3">
          <Text className="font-bold text-lg pt-2">{title}</Text>
          <View className="flex-row items-center space-x-2">
            <ClockIcon color={'gray'} opacity={0.5} size={18} />
            <Text className="text-xs text-[#DA3743]">
              {date} - {endDate}
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
