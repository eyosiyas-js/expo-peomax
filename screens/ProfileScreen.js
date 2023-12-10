import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
} from 'react-native'
import React, { useState } from 'react'
import { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../features/userSlice'
import * as Clipboard from 'expo-clipboard'
import SnackbarComponent from 'react-native-snackbar-component'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Axiosinstance from '../axios'

export default function ProfileScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])
  const [open, setOpen] = useState({
    state: false,
    message: '',
  })
  const [error, setError] = useState({
    state: false,
    message: '',
  })
  const user = useSelector(selectUser)

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(user.reference)
    setOpen({
      state: true,
      message: 'Text Copied:)',
    })
    setTimeout(() => setOpen({ state: false, message: '' }), 3000)
  }

  const handleChange = async () => {
    try {
      const response = await Axiosinstance.post('/api/auth/reset-password', {
        email: user.email,
      })

      navigation.navigate('PasswordChange', { email: user.email })
    } catch (error) {
      setError({
        state: true,
        message:
          error.response?.data?.error || 'Failed to Change. Please try again.',
      })
      setTimeout(() => setError({ state: false, message: '' }), 5000)
      console.error('Error occurred:', error)
    }
  }

  return (
    <ScrollView className="w-full bg-white mt-10">
      <View className="w-full flex-col items-center mt-10">
        <Image
          source={require('../assets/logo512.png')}
          className="w-24 h-36"
        />

        <Animated.Text
          entering={FadeInUp.duration(1000).springify()}
          className="text-black font-bold tracking-wider text-4xl"
        >
          Profile Details
        </Animated.Text>
      </View>
      <View className="flex items-center mx-5 space-y-5 mt-10">
        <Animated.View
          className="w-full"
          entering={FadeInDown.duration(1000).springify()}
        >
          <Text className="ml-2 mb-1 font-bold tracking-wider text-lg">
            Name
          </Text>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-3 rounded-2xl w-full"
          >
            <Text className="p-1">
              {user.firstName} {user.lastName}
            </Text>
          </Animated.View>
        </Animated.View>
        <Animated.View
          className="w-full"
          entering={FadeInDown.duration(1000).springify()}
        >
          <Text className="ml-2 mb-1 font-bold tracking-wider text-lg">
            Email
          </Text>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-3 rounded-2xl w-full"
          >
            <Text className="p-1">{user.email}</Text>
          </Animated.View>
        </Animated.View>
        <Animated.View
          className="w-full"
          entering={FadeInDown.duration(1000).springify()}
        >
          <Text className="ml-2 mb-1 font-bold tracking-wider text-lg">
            Reference Number
          </Text>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-3 rounded-2xl w-full flex-row justify-between"
          >
            <Text className="p-1">{user.reference}</Text>
            <Button onPress={copyToClipboard} color={'#DA3743'} title="COPY" />
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View
        className="w-full p-5 mt-6"
        entering={FadeInDown.delay(400).duration(1000).springify()}
      >
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.removeItem('token')
            dispatch(logout())
          }}
          className="w-full bg-[#DA3743] p-3 rounded-2xl mb-3"
        >
          <Text className="text-xl font-bold text-white text-center">
            Logout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleChange}
          className="w-full flex-row justify-center bg-black p-3 rounded-2xl mb-3"
        >
          {/* <FontAwesome name="google" size={20} color="" /> */}

          <Text className="text-xl font-bold ml-1 text-white text-center">
            Change Password
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <SnackbarComponent
        visible={open.state}
        position="top"
        backgroundColor="green"
        top={50}
        textMessage={open.message}
      ></SnackbarComponent>
    </ScrollView>
  )
}
