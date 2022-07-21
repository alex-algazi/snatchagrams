import { useContext, useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View, Keyboard, StyleSheet } from 'react-native';
import { TextInput, Button, Headline, Caption } from 'react-native-paper';
import AuthContext from '../../components/auth/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp({ navigation }) {
  const { signUp, signUpError, resetErrors } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStatus] = signUpError;

  useEffect(() => {
    if (errorStatus === 'auth/email-already-in-use') {
      setErrorMessage('Account already exists with this email.');
    }
    else {
      setErrorMessage('');
    }
  },[signUpError]);

  function handleSubmit() {
    if (!email || !password || !displayName) {
      setErrorMessage('Please fill out all fields.')
    }
    else if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)) {
      setErrorMessage('Invalid email address.');
    }
    else if (password.length < 7 || password.length > 20) {
      setErrorMessage('Password must be between 7 and 20 characters.');
    }
    else if (displayName.length < 3 || displayName.length > 15) {
      setErrorMessage('Display name must be between 3 and 15 characters.');
    }
    else if (!/^[a-zA-Z0-9_]*$/.test(displayName)) {
      setErrorMessage('Display name must only include alphanumeric characters.')
    }
    else {
      signUp({ email, password, displayName });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.headerBox}>
            <Headline style={styles.header}>
              Sign Up
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
            <TextInput
              mode='outlined'
              placeholder='Display name'
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize='none'
            />
          </View>
          <View style={styles.buttonBox}>
            <Button
              mode='contained'
              onPress={handleSubmit}
            >
              Sign up
            </Button>
          </View>
          <View style={styles.extraButtonBox}>
            <Button
              uppercase={false}
              onPress={() => {
                resetErrors();
                navigation.navigate('SignIn');
              }}
            >
              Already have an account? Sign in
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
    flex: 0.2,
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
