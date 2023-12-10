import { useNavigation } from '@react-navigation/native'
import * as Google from 'expo-auth-session/providers/google'

import { useEffect } from 'react'

export const useAuth = () => {
  const [_, googleResponse, googleAuth] = Google.useAuthRequest({
    expoClientId:
      '1080382822276-eqklp58m1q9fl85m7aj89n1ofp8bdj7p.apps.googleusercontent.com',
    iosClientId:
      '434304454034-jr152oentu83jh0fartl6cbcpnr9nuk7.apps.googleusercontent.com',
    androidClientId:
      '434304454034-5i0dgdm3iqhs15fb0tahbfehd2jsv8bt.apps.googleusercontent.com',
    webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
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
    async function loginUserWithGoogle(access_token) {
      try {
        const user = await googleLoginOrRegister(access_token)
        handleSignInUser(user)
      } catch (error) {
        handleAuthError()
      } finally {
        setLoading(false)
      }
    }

    if (googleResponse?.type === 'success') {
      const { access_token } = googleResponse.params
      loginUserWithGoogle(access_token)
    }
  }, [googleResponse])

  const handleSignInUser = (user) => {
    if (user) {
      login(user)
      goBack()
    }
  }

  const handleAuthError = () => alert('Unable to authorize')

  const nativeRegister = async (values) => {
    try {
      setLoading(true)

      const user = await registerUser(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
      )
      handleSignInUser(user)
    } catch (error) {
      handleAuthError()
    } finally {
      setLoading(false)
    }
  }

  const nativeLogin = async (values) => {
    try {
      setLoading(true)

      const user = await loginUser(values.email, values.password)
      handleSignInUser(user)
    } catch (error) {
      handleAuthError()
    } finally {
      setLoading(false)
    }
  }

  return { nativeRegister, nativeLogin, facebookAuth, googleAuth, appleAuth }
}
