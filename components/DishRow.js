// import {
//   View,
//   Text,
//   Image,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native'
// import React, { useLayoutEffect } from 'react'
// import { StatusBar } from 'expo-status-bar'
// import { useNavigation } from '@react-navigation/native'
// import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated'

// export default function LoginScreen() {
//   const navigation = useNavigation()
//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     })
//   }, [])
//   return (
//     <View className="bg-white h-full w-full">
//       <StatusBar style="light" />
//       <Image
//         className="h-full w-full absolute"
//         source={require('../assets/background.png')}
//       />

//       {/* lights */}

//       {/* title and form */}
//       <View className="h-full w-full flex justify-around pt-40 pb-10">
//         {/* title */}
//         <View className="flex items-center">
//           <Animated.Text
//             entering={FadeInUp.duration(1000).springify()}
//             className="text-white font-bold tracking-wider text-5xl"
//           >
//             Login
//           </Animated.Text>
//         </View>

//         {/* form */}
//         <View className="flex items-center mx-5 space-y-4">
//           <Animated.View
//             entering={FadeInDown.duration(1000).springify()}
//             className="bg-black/5 p-5 rounded-2xl w-full"
//           >
//             <TextInput placeholder="Email" placeholderTextColor={'gray'} />
//           </Animated.View>
//           <Animated.View
//             entering={FadeInDown.delay(200).duration(1000).springify()}
//             className="bg-black/5 p-5 rounded-2xl w-full mb-3"
//           >
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor={'gray'}
//               secureTextEntry
//             />
//           </Animated.View>

//           <Animated.View
//             className="w-full"
//             entering={FadeInDown.delay(400).duration(1000).springify()}
//           >
//             <TouchableOpacity className="w-full bg-[#DA3743] p-3 rounded-2xl mb-3">
//               <Text className="text-xl font-bold text-white text-center">
//                 Login
//               </Text>
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View
//             entering={FadeInDown.delay(600).duration(1000).springify()}
//             className="flex-row justify-center"
//           >
//             <Text>Don't have an account? </Text>
//             <TouchableOpacity onPress={() => navigation.push('Signup')}>
//               <Text className="text-sky-600">SignUp</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.googleButton}>
//               {/* <FontAwesome name="google" size={20} color="" /> */}

//               <Image
//                 style={styles.googleLogo}
//                 source={{
//                   uri:
//                     'https://cdn-icons-png.flaticon.com/512/2965/2965278.png',
//                 }}
//               />
//               <Text style={styles.googleButtonText}>Log in with Google</Text>
//             </TouchableOpacity>ac
//           </Animated.View>
//         </View>
//       </View>
//     </View>
//   )
// }
