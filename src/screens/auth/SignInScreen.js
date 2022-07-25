import { useContext, useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View, Keyboard, StyleSheet } from 'react-native';
import { TextInput, Button, Headline, Caption } from 'react-native-paper';
import AuthContext from '../../components/auth/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn({ navigation }) {
  const { signIn, signInError, resetErrors } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStatus] = signInError;

  useEffect(() => {
    if (errorStatus === 'auth/user-not-found') {
      setErrorMessage('No user found with the given email.');
    }
    else if (errorStatus === 'auth/wrong-password') {
      setErrorMessage('Incorrect password.');
    }
    else {
      setErrorMessage('');
    }
  },[signInError]);

  function handleSubmit() {
    if (!email || !password) {
      setErrorMessage('Please fill out both fields.');
    }
    else if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/g.test(email)) {
      setErrorMessage('Invalid email address.');
    }
    else {
      signIn({ email, password });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.headerBox}>
            <Headline style={styles.header}>
              Sign In
            </Headline>
          </View>
          <View style={styles.errorBox}>
            <Caption style={styles.error}>
              {errorMessage}
            </Caption>
          </View>
          <View style={styles.inputBox}>
            <TextInput
              mode='outlined'
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <TextInput
              mode='outlined'
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={passwordVisible}
              autoCapitalize='none'
              right={
                <TextInput.Icon
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
            />
          </View>
          <View style={styles.buttonBox}>
            <Button
              mode='contained'
              onPress={handleSubmit}
            >
              Sign in
            </Button>
          </View>
          <View style={styles.extraButtonBox}>
            <Button
              uppercase={false}
              onPress={() => {}}
            >
              Forgot password?
            </Button>
            <Button
              uppercase={false}
              onPress={() => {
                resetErrors();
                setEmail('');
                setPassword('');
                setErrorMessage('');
                navigation.navigate('SignUp');
              }}
            >
              Don't have an account? Sign up
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    height: '60%',
  },
  header: {
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 12.5,
  },
  headerBox: {
    justifyContent: 'center',
    flex: 1,
  },
  errorBox: {
    flex: 0.25,
  },
  inputBox: {
    flex: 1.2,
  },
  buttonBox: {
    justifyContent: 'center',
    flex: 1,
  },
  extraButtonBox: {
    flex: 1,
  },
});
