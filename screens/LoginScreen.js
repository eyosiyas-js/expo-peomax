import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useState } from 'react'
import Axiosinstance from '../axios'
import SnackbarComponent from 'react-native-snackbar-component'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage
import { useDispatch } from 'react-redux'
import { login } from '../features/userSlice'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import * as Google from 'expo-auth-session/providers/google'
import Constants, { ExecutionEnvironment } from 'expo-constants'

export default function LoginScreen() {
  const redirectUri = 'com.koket.peomax://' // Define your scheme here

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '434304454034-dt9o5hqnc9lklcj4olu9ar1beal9rpsk.apps.googleusercontent.com', // don't use mine , use ur own
    iosClientId:
      '434304454034-jr152oentu83jh0fartl6cbcpnr9nuk7.apps.googleusercontent.com', // don't use mine , use ur own
    androidClientId:
      '434304454034-5i0dgdm3iqhs15fb0tahbfehd2jsv8bt.apps.googleusercontent.com',  // don't use mine , use ur own
    scopes: ['profile', 'email'],
    shouldAutoExchangeCode:
      Constants.executionEnvironment !== ExecutionEnvironment.StoreClient
        ? true
        : undefined,

    selectAccount: true,
  })

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.ok) {
        const userData = await response.json()

        return userData
      } else {
        console.error('Failed to fetch user data')
        return null
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  useEffect(() => {
    const excute = async () => {
      if (response?.type === 'success') {
        const { authentication } = response
        const user = await fetchUserProfile(authentication.accessToken)

        try {
          Axiosinstance.post('/api/auth/auth-provider', {
            firstName: user.given_name,
            lastName: user.family_name,
            email: user.email,
            // verified: true,
          }).then((res) => {
            dispatch(login(res.data.userData))

            Axiosinstance.defaults.headers.common['Authorization'] =
              res.data.token
            AsyncStorage.setItem('token', res.data.token)
            navigation.navigate('Home')
          })
        } catch (error) {
          setError({
            state: true,
            message:
              error.response?.data?.error ||
              'Failed to login. Please try again.',
          })
          setTimeout(() => setError({ state: false, message: '' }), 5000)
        }

        //
      }
    }
    excute()
  }, [response])

  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const [error, setError] = useState({
    state: false,
    message: '',
  })
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])
  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError({
        state: true,
        message: 'Input must not be empty',
      })
      setTimeout(() => setError({ state: false, message: '' }), 5000)
    } else {
      try {
        const response = await Axiosinstance.post('/api/auth/login', {
          email,
          password,
        })

        dispatch(login(response.data.userData))

        Axiosinstance.defaults.headers.common['Authorization'] =
          response.data.token
        await AsyncStorage.setItem('token', response.data.token)
        navigation.navigate('Home')

        // Store the token in AsyncStorage or any secure storage

        // Navigate to the next screen or perform other actions on successful login
        // navigation.navigate('Home');
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
            Login
          </Animated.Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home')
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
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              placeholderTextColor={'gray'}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor={'gray'}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
          </Animated.View>

          <Animated.View
            className="w-full"
            entering={FadeInDown.delay(400).duration(1000).springify()}
          >
            <TouchableOpacity
              onPress={handleLogin}
              className="w-full bg-[#DA3743] p-3 rounded-2xl mb-3"
            >
              <Text className="text-xl font-bold text-white text-center">
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                promptAsync()
              }}
              className="w-full flex-row justify-center bg-[#DA3743] p-3 rounded-2xl mb-3"
            >
              {/* <FontAwesome name="google" size={20} color="" /> */}

              <Image
                className="w-7 h5"
                source={{
                  uri:
                    'https://cdn-icons-png.flaticon.com/512/2965/2965278.png',
                }}
              />
              <Text className="text-xl font-bold ml-1 text-white text-center">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            className="flex-row justify-between w-[90%]"
          >
            <View className="flex-row">
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.push('Signup')}>
                <Text className="text-sky-600 ml-1">SignUp</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
              <Text className="text-sky-600">Forgot password</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <SnackbarComponent
        visible={error.state}
        position="bottom"
        backgroundColor="red"
        top={50}
        textMessage={error.message}
      ></SnackbarComponent>
    </View>
  )
}
