import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from 'react-native-heroicons/outline'
import Categories from '../components/Categories'
import FeaturedRow from '../components/FeaturedRow'
import AvailableRow from '../components/AvailableRow'
import * as Location from 'expo-location'

import { StatusBar } from 'expo-status-bar'
import Axiosinstance from '../axios'
import NearBy from '../components/NearBy'
import TopRated from '../components/TopRated'
import { RefreshControl } from 'react-native'

export default function HomeScreen() {
  const [input, setInput] = useState('')
  const navigation = useNavigation()
  const handleSearch = () => {
    if (input !== '') {
      navigation.navigate('Search', { input })
    }
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])
  const [skeletonData, setSkeletonData] = useState([
    { location: 'this sample location' },
    { location: 'sample location for skeleton' },
  ])
  const [availableRes, setAvailableRes] = useState(null)
  const [nearbyRes, setNearbyRes] = useState(null)
  const [featuredRes, setFeaturedRes] = useState(null)
  const [topRatedRes, setTopRatedRes] = useState(null)
  const [eventRes, setEventRes] = useState(null)
  const [refreshing, setRefreshing] = useState({
    state: false,
    value: '',
  })

  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.error('Permission to access location was denied')
          return
        }

        const isAndroid = Platform.OS == 'android'
        const location = await Location.getLastKnownPositionAsync()

        const request1 = await Axiosinstance.get('/api/all?page=1&count=10')
        const request3 = await Axiosinstance.get('/api/featured?page=1&count=5')
        const request4 = await Axiosinstance.get(
          '/api/top-rated?page=1&count=5',
        )

        // / corrected method name

        const { latitude, longitude } = location.coords
        setLatitude(latitude)
        setLongitude(longitude)

        const request5 = await Axiosinstance.get(
          `/api/nearby?latitude=${latitude}&longitude=${longitude}`,
        )

        const [response1, response3, response4, response5] = await Promise.all([
          request1,
          request3,
          request4,
          request5,
        ])

        setAvailableRes(response1.data.items)
        setNearbyRes(response5.data ? response5.data : [])
        setFeaturedRes(response3.data.featured)
        setTopRatedRes(response4.data.topRated)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
        setRefreshing({
          state: false,
        })
      }
    }

    fetchData()
  }, [refreshing.value])

  return (
    <SafeAreaView className="pt-3 bg-white">
      <StatusBar hidden={false} />
      <View className="flex-row pb-3 items-center mx-4 space-x-2 ">
        <Image
          source={require('../assets/logo512.png')}
          className="h-16 w-12  p-4 rounded-full"
        />
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
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSearch}
            placeholder="Restaurants and cuisines"
            keyboardType="default"
          />
        </View>
        {/* <ListBulletIcon color="#DA3743" /> */}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing.state}
            onRefresh={() =>
              setRefreshing({
                state: true,
                value: Math.random(12),
              })
            }
          />
        }
      >
        <Categories />
        <AvailableRow
          key={'1'}
          data={availableRes ? availableRes : skeletonData}
        />
        {nearbyRes && nearbyRes.length > 0 && (
          <NearBy
            key={'2'}
            latitude={latitude}
            longitude={longitude}
            longtiude
            data={nearbyRes ? nearbyRes : skeletonData}
          />
        )}

        <FeaturedRow
          key={'3'}
          data={featuredRes ? featuredRes : skeletonData}
        />
        <TopRated key={'4'} data={topRatedRes ? topRatedRes : skeletonData} />
      </ScrollView>
    </SafeAreaView>
  )
}
