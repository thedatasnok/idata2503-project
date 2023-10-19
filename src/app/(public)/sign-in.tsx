import { signInWithEmail } from '@/services/auth';
import {
  Box,
  Button,
  ButtonText,
  Divider,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Spinner,
  VStack,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { EyeIcon, EyeOffIcon, Mail } from 'lucide-react-native';
import React, { useState } from 'react';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);

  async function handleSignIn() {
    setLoading(true);
    const error = await signInWithEmail(email, password);

    if (error) {
      setInvalidCredentials(true);
      setLoading(false);
    }
  }

  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
      gap='$4'
      mt='$2'
      flex={1}
    >
      <FormControl isInvalid={invalidCredentials}>
        <VStack gap='$2'>
          <Input
            borderColor={invalidCredentials ? '$error600' : '$gray400'}
            borderWidth='$1'
            borderRadius='$sm'
            width={250}
            p='$1.5'
          >
            <InputField
              type='text'
              placeholder='Email'
              onChangeText={setEmail}
              onChange={() => setInvalidCredentials(false)}
            />
            <InputSlot>
              <InputIcon as={Mail} color='$gray400' mt={0} />
            </InputSlot>
          </Input>
          <Input
            borderColor={invalidCredentials ? '$error600' : '$gray400'}
            borderWidth='$1'
            borderRadius='$sm'
            width={250}
            p='$1.5'
          >
            <InputField
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              onChangeText={setPassword}
              onChange={() => setInvalidCredentials(false)}
            />
            <InputSlot onPress={handleShowPassword}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                color='$primary600'
                mt={0}
              />
            </InputSlot>
          </Input>

          <FormControlError>
            <FormControlErrorText color='$error600'>
              incorrect email or password
            </FormControlErrorText>
          </FormControlError>

          <Box pt='$4'>
            <Button onPress={handleSignIn}>
              <ButtonText>Sign in</ButtonText>
            </Button>
          </Box>

          <Box py='$2'>
            <Divider bg='$gray300' h='$0.5' />
          </Box>

          <Button onPress={handleSignIn}>
            <ButtonText>Sign in with Google</ButtonText>
          </Button>

          <Button onPress={handleSignIn}>
            <ButtonText>Sign in with Microsoft</ButtonText>
          </Button>
        </VStack>
      </FormControl>
    </Box>
  );
};

export default SignInScreen;
