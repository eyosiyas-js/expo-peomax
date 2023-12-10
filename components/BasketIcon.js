import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import { TicketIcon } from 'react-native-heroicons/outline'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'

const BasketIcon = () => {
  return (
    <View className="bottom-10 w-full z-50">
      <TouchableOpacity className="bg-[#DA3743] mx-5 p-4 rounded-lg items-center space-x-1 flex-row">
        <TicketIcon color="white" />
        <Text className="flex-1 text-white font-extrabold text-lg text-center">
          Book Now
        </Text>
        <Text className="text-lg text-white font-extrabold">
          {/* <Currency quantity="700" currency="GBP" /> */}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const BasketIconE = () => {
  return (
    <View className="bottom-10 w-full z-50">
      <TouchableOpacity
        className="bg-[#DA3743]  mx-5 p-4 rounded-lg items-center space-x-1 flex-row"
      >
        <TicketIcon color="black" />
        <Text className="flex-1 text-white font-extrabold text-lg text-center">
          Book Now
        </Text>
        <Text className="text-lg text-white font-extrabold">
          {/* <Currency quantity="700" currency="GBP" /> */}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export { BasketIconE, BasketIcon }
