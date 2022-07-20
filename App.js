import { createContext, useEffect, useReducer, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/components/auth/RootNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthContext = createContext();
const Stack = createNativeStackNavigator();

export default function App() {
  const [signInError, setSignInError] = useState('');
  const [signUpError, setSignUpError] = useState('');

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            hasToken: true,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            hasToken: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            hasToken: false,
          };
        default:
          return prevState;
      }
    },
    {
      isSignout: false,
      hasToken: false,
    }
  );

  useEffect(() => {
    async function bootstrapAsync() {
      let AT;
      try {
        AT = await SecureStore.getItemAsync('accessToken');
      } catch (e) {
        dispatch({ type: 'SIGN_OUT' });
      }
      if (AT) {
        dispatch({ type: 'RESTORE_TOKEN' });
        // api call to check token
      }
    }
    bootstrapAsync();
  },[]);

  const authContext = useMemo(() => ({
    signInError: [signInError, setSignInError],
    signUpError: [signUpError, setSignUpError],
    signIn: async (data) => {},
    signUp: async (data) => {},
    signOut: async () => {},
    resetErrors: async () => {},
  }),[signInError, signUpError]);

  return (
    <SafeAreaView>
      <Text>
        Hello, World!
      </Text>
    </SafeAreaView>
    // <AuthContext.Provider value={authContext}>
    //   <NavigationContainer ref={navigationRef}>
    //     <Stack.Navigator>
    //       {!state.hasToken ? (
    //         <>
    //           <Stack.Screen
    //             name='SignIn'
    //             component={SignInScreen}
    //             options={{
    //               headerShown: false,
    //             }}
    //           />
    //           <Stack.Screen
    //             name='SignUp'
    //             component={SignUpScreen}
    //             options={{
    //               headerShown: false,
    //             }}
    //           />
    //         </>
    //       ) : (
    //         <>
    //           <Stack.Screen
    //             name='Home'
    //             component={HomeNavigation}
    //           />
    //           <Stack.Screen
    //             name='Profile'
    //             component={ProfileScreen}
    //           />
    //           <Stack.Screen
    //             name='Settings'
    //             component={SettingsScreen}
    //           />
    //         </>
    //       )}
    //     </Stack.Navigator>
    //   </NavigationContainer>
    // </AuthContext.Provider>
  );
}
