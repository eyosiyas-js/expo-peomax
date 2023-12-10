import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import React, { useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useState } from 'react'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import Axiosinstance from '../axios'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage
import { login } from '../features/userSlice'
import SnackbarComponent from 'react-native-snackbar-component'
import { useDispatch } from 'react-redux'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState({
    state: false,
    message: '',
  })
  const [error, setError] = useState({
    state: false,
    message: '',
  })
  const dispatch = useDispatch()

  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  const HandleVerify = async () => {
    if (email == '') {
      setError({
        state: true,
        message: 'email must not be empty',
      })
      setTimeout(() => setError({ state: false, message: '' }), 5000)
    } else
      try {
        const response = await Axiosinstance.post('/api/auth/reset-password', {
          email: email,
        })

        navigation.navigate('PasswordChange')
      } catch (error) {
        setError({
          state: true,
          message:
            error.response?.data?.error || 'Failed to login. Please try again.',
        })
        setTimeout(() => setError({ state: false, message: '' }), 5000)
        console.error('Error occurred:', error)
      }
  }

  const handleResend = async () => {
    await Axiosinstance.post('api/auth/resend', {
      email: email,
    }).then((res) => {
      setOpen({
        state: true,
        message: res.data.message,
      })
    })
  }
  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image
        className="h-full w-full absolute"
        source={require('../assets/background.png')}
      />

      {/* lights */}

      {/* title and form */}
      <View className="h-full w-full flex justify-around pt-40 pb-36">
        {/* title */}
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            className="text-white font-bold tracking-wider text-4xl"
          >
            Forgot Password
          </Animated.Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          className="absolute top-14 left-5 bg-gray-100 p-2 rounded-full"
        >
          <ArrowLeftIcon size={20} color="#DA3743" />
        </TouchableOpacity>

        {/* form */}
        <View className="flex items-center  mx-5 space-y-4">
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              onChangeText={(text) => setEmail(text)}
              placeholder="Email 
"
              placeholderTextColor={'gray'}
            />
          </Animated.View>

          <Animated.View
            className="w-full"
            entering={FadeInDown.delay(400).duration(1000).springify()}
          >
            <TouchableOpacity
              onPress={HandleVerify}
              className="w-full bg-[#DA3743] p-3 rounded-2xl mb-3"
            >
              <Text className="text-xl font-bold text-white text-center">
                Continue
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <SnackbarComponent
        visible={error.state}
        position="bottom"
        backgroundColor="red"
        bottom={50}
        textMessage={error.message}
      ></SnackbarComponent>
      <SnackbarComponent
        visible={open.state}
        position="bottom"
        backgroundColor="green"
        bottom={50}
        textMessage={open.message}
      ></SnackbarComponent>
    </View>
  )
}
