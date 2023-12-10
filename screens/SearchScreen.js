import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from 'react-native-heroicons/outline'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import SpecificRestourant from '../components/SpecificRestourant'
import Axiosinstance from '../axios'
import { useState } from 'react'

export default function SearchScreen() {
  const {
    params: { input },
  } = useRoute()
  const [inputNew, setInputNew] = useState('')

  useEffect(() => {
    setInputNew(input)
  }, [input])

  const [restaurants, setRestaurants] = useState(null)

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await Axiosinstance.get(`/api/search?q=${inputNew}`)
          setRestaurants(response.data.items)
        } catch (error) {}
      }
      fetchData()
    }, [inputNew]),
  )

  const navigation = useNavigation()
  return (
    <SafeAreaView className="pt-3 bg-white">
      <View className="flex-row pb-3 items-center mx-4 space-x-2 ">
        <TouchableOpacity
          onPress={navigation.goBack}
          className=" left-0 bg-gray-100 p-2 rounded-full"
        >
          <ArrowLeftIcon size={20} color="blue" />
        </TouchableOpacity>
        <View className="flex-1 ">
          <Text className="font-bold text-xs text-gray-400">Reserve Now</Text>
          <Text className="font-bold text-xl ">Peomax</Text>
        </View>
        <ArrowPathIcon
          onPress={() => navigation.navigate('History')}
          size={31}
          color="#DA3743"
        />
      </View>
      <View className="flex-row items-center space-x-2 pb-2 mx-4">
        <View className="flex-row flex-1 space-x-2 bg-gray-200 p-3">
          <MagnifyingGlassIcon color="gray" size={20} />
          <TextInput
            value={inputNew}
            onChangeText={setInputNew}
            // onSubmitEditing={handleSearch}
            placeholder="Restaurants and cuisines"
            keyboardType="default"
          />
        </View>
      </View>

      <ScrollView>
        <View className="flex w-full justify-center items-center">
          <View>
            <Text>Search Results: {input} </Text>
          </View>
          {restaurants ? (
            restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <SpecificRestourant
                  key={restaurant.id} // Make sure to add a unique key for each item in the list
                  title={restaurant.name}
                  rating={restaurant.rating}
                  genre="5" // Assuming this is a placeholder for the genre
                  address={restaurant.location}
                  imgUrl={restaurant.image}
                />
              ))
            ) : (
              <View className="h-[700px] flex-row items-center">
                <Text className="text-5xl font-bold text-center">
                  Not Found!
                </Text>
              </View>
            )
          ) : (
            <ActivityIndicator size={'large'} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
