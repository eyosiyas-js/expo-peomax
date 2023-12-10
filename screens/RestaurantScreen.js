import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Keyboard,
  useWindowDimensions,
  Platform,
} from 'react-native'
import React, { useLayoutEffect, useRef } from 'react'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {
  ArrowLeftIcon,
  ArrowTrendingDownIcon,
  ArrowsPointingOutIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EllipsisHorizontalIcon,
  FlagIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  StopIcon,
  SwatchIcon,
} from 'react-native-heroicons/solid'
import {
  QuestionMarkCircleIcon,
  TicketIcon,
  UserIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import { BasketIcon } from '../components/BasketIcon'
import { SafeAreaView } from 'react-native-safe-area-context'

import SpecialEvents from '../components/SpecialEvents'

import { useState } from 'react'
import Axiosinstance from '../axios'
import Carousel from 'react-native-snap-carousel'
import Collapsible from 'react-native-collapsible'
import { Skeleton } from '@motify/skeleton'
import ReactNativeModal from 'react-native-modal'
import PhoneInput from 'react-native-international-phone-number'
import { useEffect } from 'react'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { Button } from 'react-native'
import { Picker } from '@react-native-community/picker'

import SnackbarComponent from 'react-native-snackbar-component'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, selectUser } from '../features/userSlice'
import { RefreshControl } from 'react-native'

const RestaurantScreen = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])
  const [selectedValue, setSelectedValue] = useState('1')
  const user = useSelector(selectUser)
  const [refreshing, setRefreshing] = useState({
    state: false,
    value: '',
  })
  const route = useRoute()
  const { category, ID } = route.params
  const [error, setError] = useState({ state: false, message: '' })
  const [openSnackBar, setOpenSnackBar] = useState({
    state: false,
    message: '',
  })

  const [restaurants, setRestaurants] = useState([{ description: '' }])
  const [openReserve, setOpenReserve] = useState(false)
  const [loading, setLoading] = useState(false)
  const [specialEvents, setSpecialEvents] = useState([{}])
  const [isCollapsed, setisCollapsed] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [dateSelection, setDateSelection] = useState(new Date())
  const [timeSelection, setTimeSelection] = useState(new Date())
  const [openAnimation, setOpenAnimation] = useState(false)
  const dispatch = useDispatch()
  useFocusEffect(
    React.useCallback(() => {
      const fetchData2 = async () => {
        try {
          const token = await AsyncStorage.getItem('token')

          if (token) {
            Axiosinstance.defaults.headers.common['Authorization'] = token

            const response = await Axiosinstance.get('/api/account')
            dispatch(login(response.data))
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            await AsyncStorage.removeItem('token')
          }
        }
      }
      const fetchData = async () => {
        try {
          const restaurantsResponse = await Axiosinstance.get(
            `/api/${category}s/${ID}`,
          )
          setRestaurants(restaurantsResponse.data)
          //(restaurantsResponse.data)

          const eventsResponse = await Axiosinstance.get(
            `/api/${category}s/${ID}/events`,
          )
          setSpecialEvents(eventsResponse.data)

          setRefreshing({
            state: false,
          })

          //(eventsResponse.data)
        } catch (error) {
          //(error)
        }
      }
      // Fetch data when the screen gains focus
      if (!user) fetchData2()
      fetchData(category, ID)
    }, [category, ID, refreshing.value]),
  )
  const handleReserve = async () => {
    if (inputValue === '') {
      setError({
        state: true,
        message: 'Phone number must not be empty',
      })
    } else
      try {
        let formatedTime = timeSelection.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, // This will display the time in AM/PM format
        })

        if (formatedTime.split(':')[0].length == 1) {
          const x = formatedTime.split(':')[0]
          const y = formatedTime.split(':')[1]

          formatedTime = 0 + x + ':' + y
        }
        const formattedDate = dateSelection.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })

        console //
          .log({
            ID: restaurants.ID,
            people: parseInt(selectedValue),
            time: formatedTime,
            date: formattedDate,
            category: restaurants.category,
            phoneNumber: `251${inputValue.split(' ').join('')}`,
          })
        const response = await Axiosinstance.post('/api/reserve', {
          ID: restaurants.ID,
          people: parseInt(selectedValue),
          time: formatedTime,
          date: formattedDate,
          category: restaurants.category,
          phoneNumber: `251${inputValue.split(' ').join('')}`,
        })
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

  const SLIDER_WIDTH = Dimensions.get('window').width
  const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
      type: 'timing',
      duration: 1500,
    },
    // backgroundColor: '#D4D4D4',
  }
  const [selectedCountry, setSelectedCountry] = useState()
  const [inputValue, setInputValue] = useState('')

  function handleInputValue(phoneNumber) {
    setInputValue(phoneNumber)
  }

  function handleSelectedCountry(country) {
    setSelectedCountry(country)
  }

  const animation = useRef(null)

  useEffect(() => {
    if (timeSelection) {
      const x = timeSelection.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // This will display the time in AM/PM format
      })
    }
  }, [openAnimation])
  useEffect(() => {
    if (dateSelection) {
      x = dateSelection.toLocaleDateString('en-US')
      //
    }
  }, [dateSelection])
  // if (openAnimation)
  //   return (
  //     <View className="h-[700px] flex-row items-center">
  //       <Text>hi</Text>
  //     </View>
  //   )
  const { height: screenHeight } = useWindowDimensions()

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
    <SafeAreaView className="">
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
        <View className="relative">
          <Carousel
            style="w-full bg-red-400"
            data={restaurants.images}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                className="h-56 w-full bg-gray-300 p-4"
              />
            )}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={300}
            loop={true}
            autoplay={true}
            autoplayInterval={3000}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()

              setSpecialEvents([])
            }}
            className="absolute top-14 left-5 bg-gray-100 p-2 rounded-full"
          >
            <ArrowLeftIcon size={20} color="#DA3743" />
          </TouchableOpacity>
        </View>

        <View className="bg-white">
          <View className="px-4 pt-4">
            <Skeleton show={!restaurants.name} {...SkeletonCommonProps}>
              <Text className="text-3xl font-bold"> {restaurants.name}</Text>
            </Skeleton>

            <View className="flex-row my-1 space-x-2">
              <View className="flex-row items-center space-x-1">
                <StarIcon color="gold" opacity={0.5} size={22} />
                <Text className="text-xs text-orange-300">
                  <Text className="text-orange-300">4</Text> . 5
                </Text>
              </View>

              <View className="flex-row items-center space-x-1">
                <MapPinIcon color="gray" opacity={0.4} size={22} />
                <Skeleton show={!restaurants.name} {...SkeletonCommonProps}>
                  <Text className="text-xs text-gray-500">
                    {restaurants.location}
                  </Text>
                </Skeleton>
              </View>
            </View>
            <Skeleton show={!restaurants.name} {...SkeletonCommonProps}>
              <Text className="text-gray-500 mt-2 pb-4">
                {descriptionStatus
                  ? restaurants.description
                    ? restaurants.description
                    : ''
                  : truncateAddress(
                      restaurants.description ? restaurants.description : '',
                      130,
                    )}

                {CheckMore(
                  restaurants.description ? restaurants.description : '',
                  130,
                ) == true ? (
                  <Text
                    className="ml-8"
                    style={{
                      color: 'red',
                    }}
                    onPress={() =>
                      setDescriptionStatus(descriptionStatus ? false : true)
                    }
                  >
                    {descriptionStatus ? ' Less' : ' More'}
                  </Text>
                ) : null}
              </Text>
            </Skeleton>
          </View>

          <TouchableOpacity
            onPress={() => setisCollapsed(isCollapsed ? false : true)}
            className="flex-row items-center space-x-2 p-4 border-y border-gray-300"
          >
            <QuestionMarkCircleIcon color="gray" opacity={0.6} size={20} />
            <Text className="pl-2 flex-1 text-sm font-bold">
              Additional Informtion?
            </Text>
            <ChevronRightIcon color="#00CCBB" />
          </TouchableOpacity>
          <Collapsible collapsed={isCollapsed}>
            <View className="p-4 flex-col space-y-3">
              <View className="flex-row items-start space-x-1">
                <ClockIcon />
                <Text style={{ marginRight: 5 }}>
                  Working Hours : {restaurants.openingTime} to{' '}
                  {restaurants.closingTime}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <ArrowTrendingDownIcon />
                <Text style={{ marginRight: 5 }}>
                  Cross Street: {restaurants.crossStreet}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <BuildingOfficeIcon />
                <Text style={{ marginRight: 5 }}>
                  Neighborhood: {restaurants.neighborhood}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <StopIcon />
                <Text style={{ marginRight: 5 }}>
                  Parking details: {restaurants.parkingDetails}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <ArrowsPointingOutIcon />
                <Text style={{ marginRight: 5 }}>
                  Public transit: {restaurants.publicTransit}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <EllipsisHorizontalIcon />
                <Text style={{ marginRight: 5 }}>
                  Additional: {restaurants.additional}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <SwatchIcon />
                <Text style={{ marginRight: 5 }}>
                  Dining style: {restaurants.diningStyle}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <FlagIcon />
                <Text style={{ marginRight: 5 }}>
                  Cuisines: {restaurants.cuisines}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <UserIcon style={{ fontSize: 30 }} />
                <Text style={{ marginRight: 5 }}>
                  Dress code: {restaurants.dressCode}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <CurrencyDollarIcon />
                <Text style={{ marginRight: 5 }}>
                  Payment options: {restaurants.paymentOptions}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <PhoneIcon />
                <Text style={{ marginRight: 5 }}>
                  Phone number: {restaurants.phoneNumber}
                </Text>
              </View>
              <View className="flex-row items-start space-x-1">
                <GlobeAltIcon />
                <Text
                  style={{ marginRight: 5 }}
                  onPress={() => Linking.openURL(restaurants.website)}
                >
                  Website: {restaurants.website}
                </Text>
              </View>
            </View>
          </Collapsible>
        </View>
        <View className="w-full flex-row justify-evenly mt-4">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('HotelServices', {
                title: 'restaurants',
                ID: restaurants.ID,
              })
            }
            className="bg-[#DA3743] w-24 h-10 flex-row justify-center items-center rounded-md "
          >
            <Text className="text-white text-center">Restaurants</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('HotelServices', {
                title: 'bars',
                ID: restaurants.ID,
              })
            }
            className="bg-[#DA3743] w-24 h-10 flex-row justify-center items-center rounded-md "
          >
            <Text className="text-white text-center">Bars</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('HotelServices', {
                title: 'clubs',
                ID: restaurants.ID,
              })
            }
            className="bg-[#DA3743] w-24 h-10 flex-row justify-center items-center rounded-md font-bold"
          >
            <Text className="text-white text-center">Clubs</Text>
          </TouchableOpacity>
        </View>
        {specialEvents.length > 0 ? (
          <View className="w-full mb-24">
            <Text className="px-4 pt-6 mb-3 font-bold text-xl">
              Special Events
            </Text>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: 'row',
                paddingHorizontal: 15,
              }}
              showsHorizontalScrollIndicator={false}
            >
              {specialEvents.length > 0
                ? specialEvents.map((event) => (
                    <SpecialEvents
                      title={event.name}
                      date={event.date}
                      eventID={event.eventID}
                      endDate={event.endDate ? event.endDate : null}
                      address={restaurants.location}
                      imgUrl={event.image}
                      description={event.description}
                      price={event.price}
                      premiumPrice={event.premiumPrice}
                      eventStart={event.eventStart}
                      eventEnd={event.eventEnd}
                      totalSpots={event.totalSpots}
                      totalBooks={event.totalBooks}
                    />
                  ))
                : null}
            </ScrollView>
          </View>
        ) : (
          <View className="h-40"></View>
        )}
      </ScrollView>
      {restaurants.category && restaurants.category !== 'hotel' && (
        <View className="bottom-10 w-full z-50">
          <TouchableOpacity
            onPress={() => {
              if (!user) navigation.navigate('Profile')
              else {
                setOpenReserve(true)
              }
            }}
            className="bg-[#DA3743] mx-5 p-4 rounded-lg items-center space-x-1 flex-row"
          >
            <TicketIcon color="white" />
            <Text className="flex-1 text-white font-extrabold text-lg text-center">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
                      minimumDate={new Date()}
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
                  minimumDate={new Date()}
                />
              )}
            </View>
            <View className="flex-row items-center space-x-2 p-4 border-y border-gray-300">
              <Text>Select Time</Text>
              {Platform.OS == 'android' ? (
                <View className="flex-row items-center space-x-2">
                  <Button
                    color={'#DA3743'}
                    title={`${timeSelection.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true, // This will display the time in AM/PM format
                    })}`}
                    onPress={() => setShowTimePicker(true)}
                  />
                  {showTimePicker ? (
                    <RNDateTimePicker
                      mode="time"
                      value={timeSelection}
                      onChange={(event, time) => {
                        setTimeSelection(time)

                        setShowTimePicker(false)
                      }}
                    />
                  ) : (
                    <Text></Text>
                  )}
                </View>
              ) : (
                <RNDateTimePicker
                  mode="time"
                  value={timeSelection}
                  onChange={(event, time) => {
                    setTimeSelection(time)
                  }}
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
    </SafeAreaView>
  )
}

export default RestaurantScreen
