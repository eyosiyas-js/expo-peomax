import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Platform,
  Keyboard,
} from 'react-native'
import { Image } from 'expo-image'

import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  TicketIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import { useNavigation, useRoute } from '@react-navigation/native'

import { useState } from 'react'

import RNDateTimePicker from '@react-native-community/datetimepicker'
import { useEffect } from 'react'
import SnackbarComponent from 'react-native-snackbar-component'
import { Picker, PickerIOS } from '@react-native-community/picker'
import { ScrollView } from 'react-native'
import ReactNativeModal from 'react-native-modal'
import PhoneInput from 'react-native-international-phone-number'
import Axiosinstance from '../axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logout, selectUser } from '../features/userSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function BookEventScreen() {
  const navigation = useNavigation()
  const truncateAddress = (address, maxLength) => {
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + '...' // Truncate the address if it exceeds maxLength
    }
    return address // Return the original address if it's within the maxLength
  }

  const [descriptionStatus, setDescriptionStatus] = useState(false)

  const CheckMore = (address, maxLength) => {
    if (address.length > maxLength) {
      return true
      // Truncate the address if it exceeds maxLength
    }
    return false // Return the original address if it's within the maxLength
  }

  const route = useRoute()
  const [openReserve, setOpenReserve] = useState(false)

  const {
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
    eventID,
  } = route.params

  const [EndMonth, EndDay, EndYear] = endDate.split('/')
  const [month, day, year] = date.split('/')
  const [error, setError] = useState({ state: false, message: '' })
  const [openSnackBar, setOpenSnackBar] = useState({
    state: false,
    message: '',
  })
  const user = useSelector(selectUser)
  const [dateSelection, setDateSelection] = useState(new Date(year, month, day))
  const [openAnimation, setOpenAnimation] = useState(false)
  const [priceSelected, setPriceSelected] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedValue, setSelectedValue] = useState('1')
  const dispatch = useDispatch()

  const handleBookEvent = async () => {
    if (!user) navigation.navigate('Profile')
    if (priceSelected) {
      // const response = await Axiosinstance.post('/api/ticket', {
      //   eventID: eventID,
      //   people: tickets,
      //   isPremium: detector(status),
      //   phoneNumber: `+${phoneNumber}`,
      //   bookedDate: bookDate,
      // })
      setOpenReserve(true)
      // Handle logic when price is selected
    } else {
      setError({ state: true, message: 'Must select Price' })
      setTimeout(() => {
        setError({ state: false, message: '' })
      }, 5000)
    }
  }

  const handleReserve = async () => {
    if (inputValue == '') {
      setError({
        state: true,
        message: 'Phone number must not be empty',
      })
      setTimeout(() => setError({ state: false, message: '' }), 5000)
    } else
      try {
        const formattedDate = dateSelection.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })

        const multipleDate = {
          eventID: eventID,
          people: selectedValue,
          isPremium: priceSelected === 'vip' ? true : false,
          phoneNumber: `+251${inputValue.split(' ').join('')}`,
          bookedDate: formattedDate,
        }

        const singleDate = date == endDate ? delete multipleDate.bookedDate : 1

        const response = await Axiosinstance.post('/api/ticket', multipleDate)
        setOpenReserve(false)
        setOpenAnimation(true)
        setOpenSnackBar({ state: true, message: 'Reservation Successful' })
        setTimeout(() => setOpenAnimation(false), 1500)
        setTimeout(() => setOpenSnackBar({ state: false, message: '' }), 4000)
      } catch (error) {
        setError({
          state: true,
          message: error.response?.data?.error || 'Failed to Reserve!',
        })
        setTimeout(() => setError({ state: false, message: '' }), 5000)
        if (error.response && error.response.status === 401) {
          await AsyncStorage.removeItem('token')
          dispatch(logout())
          navigation.navigate('Profile')
        }
      }
  }

  // useEffect(() => {
  //   if (dateSelection) {
  //
  //   }
  // }, [dateSelection])

  const [selectedCountry, setSelectedCountry] = useState()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [inputValue, setInputValue] = useState('')
  function handleInputValue(phoneNumber) {
    setInputValue(phoneNumber)
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country)
  }
  if (openAnimation)
    return (
      <View className="flex-row justify-center items-center h-full bg-white">
        <Image
          source={require('../assets/Loti.gif')}
          style={{
            width: 300, // Adjust width as needed
            height: 300, // Adjust height as needed
            justifyContent: 'center',
            alignItems: 'center',
            // Center the element in the screen
          }}
        />
      </View>
    )
  return (
    <SafeAreaView className="bg-white">
      <ScrollView>
        <View className="relative">
          <Image
            source={{
              uri: imgUrl,
            }}
            className="h-56 w-full bg-gray-300 p-4"
          />
          <TouchableOpacity
            onPress={navigation.goBack}
            className="absolute top-14 left-5 bg-gray-100 p-2 rounded-full"
          >
            <ArrowLeftIcon size={20} color="#00CCBB" />
          </TouchableOpacity>
        </View>
        <View className="bg-white">
          <View className="px-4 pt-4">
            <Text className="text-3xl font-bold">{title}</Text>
            <View className="flex-row my-1 space-x-2">
              <View className="flex-row items-center space-x-1">
                <StarIcon color="gold" opacity={0.5} size={22} />
                <Text className="text-xs text-orange-300">
                  <Text className="text-orange-300">4</Text> . 5
                </Text>
              </View>

              <View className="flex-row items-center space-x-1">
                <MapPinIcon color="gray" opacity={0.4} size={22} />
                <Text className="text-xs text-gray-500">{address}</Text>
              </View>
            </View>

            <Text className="text-gray-500 mt-2 pb-4">
              {descriptionStatus
                ? description
                : truncateAddress(description, 130)}

              {CheckMore(description, 130) == true ? (
                <Text
                  className="ml-8"
                  style={{
                    color: 'red',
                    cursor: 'pointer',
                  }}
                  onPress={() =>
                    setDescriptionStatus(descriptionStatus ? false : true)
                  }
                >
                  {descriptionStatus ? ' Less' : ' More'}
                </Text>
              ) : null}
            </Text>
          </View>
          <View className="ml-3 flex-row items-center space-x-2">
            <ClockIcon />
            <Text className=" text-[#DA3743]">
              {eventStart} {eventEnd}
            </Text>
          </View>

          {date === endDate && (
            <View className="">
              <TouchableOpacity className="flex-row items-center space-x-2 p-4 border-y border-gray-300">
                <QuestionMarkCircleIcon color="gray" opacity={0.6} size={20} />
                <Text className="pl-2 flex-1 text-sm font-bold">
                  {totalBooks}/{totalSpots} -{' '}
                  {totalBooks === totalSpots ? 'Not Available ' : 'Available'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View>
          <Text className="px-4  pt-2 mb-3 font-bold  text-xl">Prices</Text>
          <TouchableOpacity
            onPress={() => setPriceSelected('vip')}
            className={`flex-row items-center space-x-2  p-4 border ${
              priceSelected == 'vip' ? 'bg-[#a39293] ' : 'border-gray-300'
            } `}
          >
            <CurrencyDollarIcon color="red" opacity={0.6} size={20} />
            <Text className="pl-2 flex-1 text-lg font-bold">
              Vip - {premiumPrice} ETB
            </Text>
            <ArrowRightIcon color="#00CCBB" />

            {/* 1500 ETB */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriceSelected('normal')}
            className={`flex-row items-center space-x-2  p-4 border ${
              priceSelected == 'normal' ? 'bg-[#a39293] ' : 'border-gray-300'
            } `}
          >
            <CurrencyDollarIcon color="red" opacity={0.6} size={20} />
            <Text className="pl-2 flex-1 text-lg font-bold">
              Normal - {price} ETB
            </Text>
            <ArrowRightIcon color="#00CCBB" />

            {/* 1500 ETB */}
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="mt-14">
          <View className="bottom-10 w-full z-50">
            <TouchableOpacity
              onPress={handleBookEvent}
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
        </TouchableOpacity>
        <SnackbarComponent
          visible={error.state}
          position="top"
          backgroundColor="red"
          top={50}
          textMessage={error.message}
        ></SnackbarComponent>
        <SnackbarComponent
          visible={openSnackBar.state}
          position="top"
          backgroundColor="green"
          top={50}
          textMessage={openSnackBar.message}
        ></SnackbarComponent>
      </ScrollView>
      <View>
        <ReactNativeModal
          onBackdropPress={() => Keyboard.dismiss()}
          isVisible={openReserve}
        >
          <View className="w-[99%] h-auto p-4 bg-white rounded-lg">
            <TouchableOpacity
              onPress={() => {
                setOpenReserve(false)
              }}
              className="absolute top-1 left-5 bg-gray-100 p-2 rounded-full"
            >
              <XMarkIcon size={20} color="#DA3743" />
            </TouchableOpacity>
            <View className="mt-8">
              <PhoneInput
                value={inputValue}
                onChangePhoneNumber={handleInputValue}
                selectedCountry={selectedCountry}
                defaultCountry="ET"
                onChangeSelectedCountry={handleSelectedCountry}
              />
            </View>

            <View className="flex-row items-center space-x-2 p-4 border-y border-gray-300">
              <Text>Select Date</Text>
              {Platform.OS == 'android' ? (
                <View className="flex-row items-center space-x-2">
                  <Button
                    color={'#DA3743'}
                    title={`${dateSelection.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}`}
                    onPress={() => setShowDatePicker(true)}
                  />
                  {showDatePicker ? (
                    <RNDateTimePicker
                      value={dateSelection}
                      disabled={!showDatePicker}
                      onChange={(event, date) => {
                        setDateSelection(date)

                        setShowDatePicker(false)
                      }}
                      maximumDate={new Date(EndYear, EndMonth - 1, EndDay)}
                      minimumDate={new Date(year, month - 1, day)}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </View>
              ) : (
                <RNDateTimePicker
                  value={dateSelection}
                  onChange={(event, date) => {
                    setDateSelection(date)
                  }}
                  maximumDate={new Date(EndYear, EndMonth - 1, EndDay)}
                  minimumDate={new Date(year, month - 1, day)}
                />
              )}
            </View>

            <View className="flex-row items-center">
              <Text>Select an number of People</Text>
              <Picker
                selectedValue={selectedValue}
                style={{
                  width: 150,
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedValue(itemValue)
                }
              >
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2" />
                <Picker.Item label="3" value="3" />
                <Picker.Item label="4" value="4" />
                <Picker.Item label="5" value="5" />
              </Picker>
            </View>

            <Button onPress={handleReserve} color={'#DA3743'} title="Reserve" />
          </View>
        </ReactNativeModal>
      </View>
    </SafeAreaView>
  )
}
