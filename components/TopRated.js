import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import RestaurantCard from './RestaurantCard'
import { ArrowRightIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'

export default function TopRated({ data }) {
  const truncateAddress = (address, maxLength) => {
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + '...' // Truncate the address if it exceeds maxLength
    }
    return address // Return the original address if it's within the maxLength
  }
  const navigation = useNavigation()

  return (
    <View className="mb-[110px]">
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg">Top Rated</Text>
        <ArrowRightIcon
          onPress={() =>
            navigation.navigate('Category', {
              title: 'top-rated',
              property: 'topRated',
            })
          }
          color="#DA3743"
        />
      </View>
      <Text className=" text-xs text-gray-500 px-4">Peomax </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 15 }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {data &&
          data.map((restaurant) => (
            <RestaurantCard
              key={restaurant.ID}
              title={restaurant.name}
              rating={restaurant.rating}
              category={restaurant.category}
              ID={restaurant.ID}
              genre="5"
              address={truncateAddress(restaurant.location, 30)}
              imgUrl={restaurant.image}
            />
          ))}
      </ScrollView>
    </View>
  )
}
