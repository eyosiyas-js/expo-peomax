import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper'
import LottieView from 'lottie-react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get('window')

export default function OnboardingScreen() {
  const navigation = useNavigation()

  const handleDone = async () => {
    await AsyncStorage.setItem('onboarded', 'true')

    navigation.navigate('Tabs', { screen: 'Home' })
  }

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text>Done</Text>
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        // bottomBarHighlight={false}
        DoneButtonComponent={doneButton}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: '#fef3c7',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require('../assets/animations/reservation.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Secure Tables Anytime',
            subtitle:
              'Your Gateway to Dining Experiences. Seamless Hotels, Restaurants, Bars, Louges Reservations. ',
          },
          {
            backgroundColor: '#DA3743',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require('../assets/animations/ticket.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Seize every moment ',
            subtitle: 'Grab your preferred event tickets, anytime, anywhere!',
          },
          {
            backgroundColor: '#a78bfa',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  source={require('../assets/animations/payment.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Fast & Secure Payments',
            subtitle:
              'Seamless Transactions, Fortified Security, All in peomax',
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: 20,
    // backgroundColor: 'white',
    // borderTopLeftRadius: '100%',
    // borderBottomLeftRadius: '100%'
  },
})
