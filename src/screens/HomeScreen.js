import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Headline } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../components/auth/AuthContext';
import * as SecureStore from 'expo-secure-store';

export default function Home() {
  const [displayName, setDisplayName] = useState('');
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    async function getDisplayName() {
      const name = await SecureStore.getItemAsync('displayName');
      setDisplayName(name);
    }
    getDisplayName();
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <Headline>
        Welcome, {displayName}!
      </Headline>
      <Button
        mode='contained'
        onPress={signOut}
      >
        Sign out
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
