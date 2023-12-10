import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { UserIcon, HomeIcon, SignalIcon } from 'react-native-heroicons/outline'
import HomeScreen from './screens/HomeScreen'
import { TailwindProvider } from 'tailwindcss-react-native'
import RestaurantScreen from './screens/RestaurantScreen'
import LoginScreen from './screens/LoginScreen'
import axios from 'axios'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CathegoryScreen from './screens/CathegoryScreen'
import SearchScreen from './screens/SearchScreen'
import { store } from './store'
import { Provider, useDispatch, useSelector } from 'react-redux'
import BookScreen from './screens/BookScreen'
import BookEventScreen from './screens/BookEventScreen'
import SignupScreen from './screens/SignupScreen'
import { login, selectUser } from './features/userSlice'
import VerifyScreen from './screens/verifyScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import PasswordChange from './screens/PasswordChange'
import ProfileScreen from './screens/ProfileScreen'
import HotelServices from './screens/HotelServices'
import Axiosinstance from './axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HistoryScreen from './screens/HistoryScreen'
import OnboardingScreen from './screens/OnBordingUI'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
function TabScreens({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        activeTintColor: 'ff0',
        keyboardHidesTabBar: true,
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent

          if (route.name === 'Home') {
            IconComponent = focused ? HomeIcon : HomeIcon
          } else if (route.name === 'Details') {
            IconComponent = focused ? SignalIcon : SignalIcon
          } else if (route.name === 'Profile') {
            IconComponent = focused ? UserIcon : UserIcon
          }

          return <IconComponent size={size} color="#DA3743" />
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ icon: 'home' }}
      />

      <Tab.Screen
        name="Profile"
        component={user ? ProfileScreen : LoginScreen}
        options={{ icon: 'login' }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  let user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [showOnboarding, setShowOnboarding] = useState(null) // Set initial state to null

  useEffect(() => {
    const fetchData = async () => {
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
    if (!user) fetchData()
  })
  useEffect(() => {
    const checkIfAlreadyOnboarded = async () => {
      try {
        let onboarded = await AsyncStorage.getItem('onboarded')

        if (onboarded === 'true') {
          // hide onboarding
          setShowOnboarding(false)
        } else {
          // show onboarding
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error('Error fetching onboarding status:', error)
      }
    }

    checkIfAlreadyOnboarded()
  }, [])

  if (showOnboarding == null) {
    return null
  }

  if (showOnboarding) {
    return (
      <NavigationContainer>
        <TailwindProvider>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Onboarding"
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />

            <Stack.Screen name="Tabs">
              {(props) => <TabScreens {...props} user={user} />}
              {/* Pass user prop here */}
            </Stack.Screen>

            <Stack.Screen name="HotelServices" component={HotelServices} />
            <Stack.Screen name="Details" component={RestaurantScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Category" component={CathegoryScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="PasswordChange" component={PasswordChange} />

            <Stack.Screen name="Book" component={BookScreen} />
            <Stack.Screen name="BookEvent" component={BookEventScreen} />
            <Stack.Screen
              name="History"
              component={user ? HistoryScreen : LoginScreen}
            />
          </Stack.Navigator>
        </TailwindProvider>
      </NavigationContainer>
    )
  }
  return (
    <NavigationContainer>
      <TailwindProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
            component={OnboardingScreen}
          /> */}
          <Stack.Screen name="Tabs">
            {(props) => <TabScreens {...props} user={user} />}
            {/* Pass user prop here */}
          </Stack.Screen>
          <Stack.Screen name="HotelServices" component={HotelServices} />
          <Stack.Screen name="Details" component={RestaurantScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Category" component={CathegoryScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="PasswordChange" component={PasswordChange} />

          <Stack.Screen name="Book" component={BookScreen} />
          <Stack.Screen name="BookEvent" component={BookEventScreen} />
          <Stack.Screen
            name="History"
            component={user ? HistoryScreen : LoginScreen}
          />
        </Stack.Navigator>
      </TailwindProvider>
    </NavigationContainer>
  )
}
