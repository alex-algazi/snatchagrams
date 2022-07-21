import { useEffect, useReducer, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/components/auth/RootNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import firebaseConfig from './config.json';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import AuthContext from './src/components/auth/AuthContext';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
}

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

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

  // useEffect(() => {
  //   async function bootstrapAsync() {
  //     let AT;
  //     try {
  //       AT = await SecureStore.getItemAsync('accessToken');
  //     } catch (e) {
  //       dispatch({ type: 'SIGN_OUT' });
  //     }
  //     if (AT) {
  //       dispatch({ type: 'RESTORE_TOKEN' });
  //       // api call to check token
  //     }
  //   }
  //   bootstrapAsync();
  // },[]);

  const authContext = useMemo(() => ({
    signInError: [signInError, setSignInError],
    signUpError: [signUpError, setSignUpError],
    signIn: async (data) => {
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          console.log(userCredential);
          // dispatch({ type: 'SIGN_IN' });
        })
        .catch((error) => {
          setSignInError(error.code);
        });
    },
    signUp: async (data) => {
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          console.log(userCredential);
          // dispatch({ type: 'SIGN_IN' });
          return userCredential.user.updateProfile({ displayName: data.displayName });
        })
        .catch((error) => {
          setSignUpError(error.code);
        });
    },
    signOut: async () => {
      signOut(auth)
        .then(() => {
          dispatch({ type: 'SIGN_OUT' });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    resetErrors: async () => {},
  }),[signInError, signUpError]);

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider theme={theme}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            {!state.hasToken ? (
              <>
                <Stack.Screen
                  name='SignIn'
                  component={SignInScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='SignUp'
                  component={SignUpScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name='Home'
                  component={HomeScreen}
                />
                <Stack.Screen
                  name='Profile'
                  component={ProfileScreen}
                />
                <Stack.Screen
                  name='Settings'
                  component={SettingsScreen}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
