import { useEffect, useReducer, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/components/auth/RootNavigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from 'firebase/auth';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { getDatabase, ref, set } from 'firebase/database';
import firebaseConfig from './config.json';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
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

const Stack = createNativeStackNavigator();

export default function App() {
  let app;

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
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    }
    else {
      app = getApp();
    }
    SecureStore.getItemAsync('email') // TODO change to auth listener https://firebase.google.com/docs/auth/web/manage-users
      .then((email) => {
        if (email) {
          dispatch({ type: 'RESTORE_TOKEN' });
        }
      });
  },[]);

  const authContext = useMemo(() => ({
    signInError: [signInError, setSignInError],
    signUpError: [signUpError, setSignUpError],
    signIn: async (data) => {
      signInWithEmailAndPassword(getAuth(app), data.email, data.password)
        .then((userCredential) => {
          SecureStore.setItemAsync('displayName', userCredential.user.displayName);
          SecureStore.setItemAsync('email', userCredential.user.email);
          dispatch({ type: 'SIGN_IN' });
        })
        .catch((error) => {
          setSignInError(error.code);
        });
    },
    signUp: async (data) => {
      createUserWithEmailAndPassword(getAuth(app), data.email, data.password)
        .then((userCredential) => {
          updateProfile(userCredential.user, { displayName: data.displayName })
            .then(() => {
              SecureStore.setItemAsync('displayName', data.displayName);
              SecureStore.setItemAsync('email', data.email);
              set(ref(getDatabase(app), 'users/' + userCredential.user.uid), {
                email: data.email,
                name: data.displayName,
              });
              dispatch({ type: 'SIGN_IN' });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          setSignUpError(error.code);
        });
    },
    signOut: async () => {
      signOut(getAuth(app))
        .then(() => {
          SecureStore.deleteItemAsync('displayName');
          SecureStore.deleteItemAsync('email');
          setSignInError('');
          setSignUpError('');
          dispatch({ type: 'SIGN_OUT' });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    resetErrors: async () => {
      setSignInError('');
      setSignUpError('');
    },
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
                  options={{
                    headerShown: false,
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
