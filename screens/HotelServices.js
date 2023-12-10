import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import React, { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import SpecificRestourant from '../components/SpecificRestourant'
import { Image } from 'expo-image'
import { FlatList } from 'react-native'
import { useState } from 'react'
import Axiosinstance from '../axios'
import { RefreshControl } from 'react-native'

export default function HotelServices() {
  const {
    params: { title, ID },
  } = useRoute()

  const [restaurants, setRestaurants] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState({
    state: false,
    value: '',
  })

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [title]),
  )

  const fetchData = async () => {
    if (isLoading) {
      return // Don't fetch if a request is already in progress
    }

    if (page > totalPages) {
      return
    }

    if (page) setIsLoading(true)

    try {
      const response = await Axiosinstance.get(
        `/api/hotels/${ID}/${title}?page=${page}&count=${10}`,
      )
      setTotalPages(response.data.totalPages)
      let name = title.toLowerCase()
      const newRestaurants = response.data[name]

      if (newRestaurants.length > 0) {
        setRestaurants((prevRestaurants) => [
          ...prevRestaurants,
          ...newRestaurants,
        ])
        setPage(page + 1) // Increment the page count for the next fetch
        setRefreshing({ state: false })
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const navigation = useNavigation()

  const renderRestaurantItem = ({ item }) => (
    <SpecificRestourant
      key={item.id}
      title={item.name}
      rating={item.rating}
      genre="5" // Placeholder for the genre
      address={item.location}
      imgUrl={item.image}
      category={item.category}
      ID={item.ID}
    />
  )
  const renderNotFound = () => {
    if (!isLoading && restaurants.length === 0) {
      return (
        <View className="h-[700px] flex-row items-center">
          <Text className="text-5xl font-bold text-center">Not Found!</Text>
        </View>
      )
    }
    return null
  }
  const renderFooter = () => {
    if (!isLoading) return null

    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView className="pt-3 bg-white w-full">
      <View className="w-full h-28  flex items-center justify-center">
        <View className="w-[80%] h-full  n-400 flex items-center justify-center">
          <Text className="text-xl font-bold text-center">{title}</Text>
          <TouchableOpacity
            onPress={navigation.goBack}
            className="absolute top-8 left-5 bg-gray-100 p-2 rounded-full"
          >
            <ArrowLeftIcon size={20} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex w-full justify-center items-center mb-52">
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantItem}
          ListEmptyComponent={renderNotFound} // Use
          keyExtractor={(item, index) => `${index}`} // Use index as a fallback key
          ListFooterComponent={renderFooter}
          onEndReached={fetchData} // Call fetchData when reaching the end of the list
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing.state}
              onRefresh={() => {
                setRefreshing({
                  state: true,
                  value: Math.random(12),
                })
                setPage(1)
                setRestaurants([])
                fetchData()
              }}
            />
          }
        />
      </View>
    </SafeAreaView>
  )
}
