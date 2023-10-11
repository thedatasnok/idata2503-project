import { signInWithEmail } from '@/services/auth';
import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    const error = await signInWithEmail(email, password);

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View>
      <TextInput placeholder='Email' value={email} onChangeText={setEmail} />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title='Login' disabled={loading} onPress={handleSignIn} />
    </View>
  );
};

export default SignInScreen;
