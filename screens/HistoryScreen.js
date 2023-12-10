import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import Axiosinstance from '../axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'

const HistoryCard = ({ data, onRemove }) => {
  //
  function convertISOToFormatted(timestamp) {
    const dtObject = new Date(timestamp)

    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const formattedDate = dtObject.toLocaleDateString('en-US', optionsDate)

    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true }
    const formattedTime = dtObject.toLocaleTimeString('en-US', optionsTime)

    return `${formattedDate} ${formattedTime}`
  }
  return (
    <View className="p-5 flex-col space-y-2 w-full">
      <View className="flex-row justify-between w-full">
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{data.name}</Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color:
              data.status == 'rejected'
                ? 'red'
                : data.status == 'pending'
                ? '#F3C13A'
                : 'green',
          }}
        >
          {data.status}
        </Text>
      </View>

      <Text style={{ fontSize: 15, color: '#181818' }}>
        {data.date}, {data.time}
      </Text>

      <Text style={{ fontSize: 15, color: '#181818' }}>
        Reserved on: {convertISOToFormatted(data.createdAt)}
      </Text>

      <Text style={{ fontSize: 15, color: '#181818' }}>
        People: {data.people}
      </Text>

      <Text style={{ fontSize: 15, color: '#181818' }}>
        phone No : {data.phoneNumber}
      </Text>
      <Text style={{ fontSize: 15, color: '#181818' }}>
        Reservation Number : {data.reservationID}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginTop: 7,
        }}
      >
        {/* <Pressable
          onPress={() => {
            onRemove(data.reservationID)
          }}
          style={{
            backgroundColor: '#F5F5F5',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 5,
            borderWidth: 0.9,
            borderColor: '#D0D0D0',
          }}
        >
          <Text>Remove</Text>
        </Pressable> */}
      </View>
    </View>
  )
}

export default function HistoryScreen() {
  const [data, setData] = useState([])
  let user = useSelector(selectUser)
  const [loading, setLoading] = useState(false)
  useLayoutEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          const token = await AsyncStorage.getItem('token')

          if (token) {
            Axiosinstance.defaults.headers.common['Authorization'] = token

            const response = await Axiosinstance.get('/api/account')
            setData(response.data.reservations)
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)

          if (error.response && error.response.status === 401) {
            await AsyncStorage.removeItem('token')
          }
        }
      }

      if (!user.reservations) fetchData()
      else setData(user.reservations)
    }, []),
  )
  const handleRemove = (reservationID) => {
    setData((prevData) => {
      const updatedData = prevData.filter(
        (item) => item.reservationID !== reservationID,
      )
      return [...updatedData] // Create a new array reference
    })
  }
  const navigation = useNavigation()

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack()
        }}
        className="absolute top-14 left-5 bg-gray-100 p-2 rounded-full"
      >
        <ArrowLeftIcon size={20} color="#DA3743" />
      </TouchableOpacity>
      <ScrollView style={{ marginTop: 55, padding: 10 }}>
        {data.map((item, index) => (
          <HistoryCard key={index} data={item} onRemove={handleRemove} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
