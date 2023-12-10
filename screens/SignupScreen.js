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
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useState } from 'react'
import SnackbarComponent from 'react-native-snackbar-component'
import Axiosinstance from '../axios'
import * as Google from 'expo-auth-session/providers/google'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { login } from '../features/userSlice'

import Constants, { ExecutionEnvironment } from 'expo-constants'

export default function SignupScreen() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [reference, setReference] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const dispatch = useDispatch()
  const [error, setError] = useState({
    state: false,
    message: '',
  })
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])
  let firstName = fullName.split(' ')[0]
  let lastName = fullName.split(' ')[1]

  const handleSignup = async () => {
    const userData = {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
    }

    if (Object.values(userData).some((data) => data === '')) {
      setError({
        state: true,
        message: 'Input must not be empty except Rerefernce Number',
      })
      setTimeout(() => setError({ state: false, message: '' }), 5000)

      // You might want to show an error message or handle the empty fields here
    } else {
      // All fields are filled, proceed with signup logic
      await Axiosinstance.post('/api/auth/signup', userData)
        .then((res) => {
          navigation.navigate('Verify', { email })
        })
        .catch((error) => {
          setError({
            state: true,
            message:
              error.response?.data?.error ||
              'Failed to Signup. Please try again.',
          })
          setTimeout(() => setError({ state: false, message: '' }), 5000)
          console.error('Error occurred:', error)
        })
      // Implement your signup logic here
    }
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '434304454034-dt9o5hqnc9lklcj4olu9ar1beal9rpsk.apps.googleusercontent.com',
    iosClientId:
      '434304454034-jr152oentu83jh0fartl6cbcpnr9nuk7.apps.googleusercontent.com',
    androidClientId:
      '434304454034-5i0dgdm3iqhs15fb0tahbfehd2jsv8bt.apps.googleusercontent.com',
    shouldAutoExchangeCode:
      Constants.executionEnvironment !== ExecutionEnvironment.StoreClient
        ? true
        : undefined,
    scopes: ['profile', 'email'],
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

        // Now you have access to the user's data like name, email, etc.
        // Handle the user data as needed (e.g., store it in state or use it directly)
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
        // Now you can use the authentication object to make requests to the Google API
        // For example: fetchUserProfile(authentication.accessToken)
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
            Signup
          </Animated.Text>
        </View>

        {/* form */}
        <View className="flex items-center mx-5 space-y-4">
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              onChangeText={(text) => setFullName(text)}
              placeholder="FullName"
              placeholderTextColor={'white'}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              placeholderTextColor={'white'}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              placeholderTextColor={'gray'}
              secureTextEntry
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              onChangeText={(text) => setConfirmPassword(text)}
              placeholder="Confirm Password"
              placeholderTextColor={'gray'}
              secureTextEntry
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              onChangeText={(text) => setReference(text)}
              placeholder="Reference number
"
              placeholderTextColor={'gray'}
            />
          </Animated.View>

          <Animated.View
            className="w-full"
            entering={FadeInDown.delay(400).duration(1000).springify()}
          >
            <TouchableOpacity
              onPress={handleSignup}
              className="w-full bg-[#DA3743] p-3 rounded-2xl mb-3"
            >
              <Text className="text-xl font-bold text-white text-center">
                Signup
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
            className="flex-row justify-center"
          >
            <Text>have an account? </Text>
            <TouchableOpacity onPress={() => navigation.push('Login')}>
              <Text className="text-sky-600">Login</Text>
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
    </View>
  )
}
