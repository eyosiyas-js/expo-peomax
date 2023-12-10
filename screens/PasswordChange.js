import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation, useRoute } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useState } from 'react'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import Axiosinstance from '../axios'
import { login } from '../features/userSlice'
import SnackbarComponent from 'react-native-snackbar-component'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage

export default function PasswordChange() {
  const [verify, setVerify] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verified, setVerified] = useState(false)
  const [open, setOpen] = useState({
    state: false,
    message: '',
  })
  const [error, setError] = useState({
    state: false,
    message: '',
  })
  const dispatch = useDispatch()

  const route = useRoute()
  const { email } = route.params

  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  const HandleVerify = async () => {
    if (verify == '') {
      setError({
        state: true,
        message: 'Verification number must not be empty',
      })
      setTimeout(() => setError({ state: false, message: '' }), 5000)
    } else
      try {
        const response = await Axiosinstance.post('/api/auth/verify-email', {
          code: verify,
        })

        navigation.navigate('Home')
        dispatch(login(response.data.userData))

        Axiosinstance.defaults.headers.common['Authorization'] =
          response.data.token
        await AsyncStorage.setItem('token', response.data.token)
      } catch (error) {
        setError({
          state: true,
          message:
            error.response?.data?.error || 'Failed to Reset. Please try again.',
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

  const HandleReset = async () => {
    try {
      const response = await Axiosinstance.put('api/auth/change-password', {
        code: verify,
        newPassword: password,
        confirmPassword: confirmPassword,
      })

      dispatch(login(response.data.userData))

      Axiosinstance.defaults.headers.common['Authorization'] =
        response.data.token
      await AsyncStorage.setItem('token', response.data.token)
      navigation.navigate('Home')
    } catch (error) {
      setError({
        state: true,
        message:
          error.response?.data?.error || 'Failed to Reset. Please try again.',
      })
      setTimeout(() => setError({ state: false, message: '' }), 5000)
      console.error('Error occurred:', error)
    }
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
      <View className="h-full w-full flex justify-around pt-40 pb-10">
        {/* title */}
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            className="text-white font-bold tracking-wider text-5xl"
          >
            Verification
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
        <View className="flex items-center mx-5 space-y-4">
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              onChangeText={(text) => setVerify(text)}
              placeholder="Verification Number 
"
              placeholderTextColor={'gray'}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              onChangeText={(text) => setPassword(text)}
              placeholder="New Password 
"
              placeholderTextColor={'gray'}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              onChangeText={(text) => setConfirmPassword(text)}
              placeholder="Confirm Password 
"
              placeholderTextColor={'gray'}
            />
          </Animated.View>

          <Animated.View
            className="w-full"
            entering={FadeInDown.delay(400).duration(1000).springify()}
          >
            <TouchableOpacity
              onPress={HandleReset}
              className="w-full bg-[#DA3743] p-3 rounded-2xl mb-3"
            >
              <Text className="text-xl font-bold text-white text-center">
                Change
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            className="flex-row justify-center"
          >
            <Text>didn't get a Verification number? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-sky-600">resend</Text>
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
