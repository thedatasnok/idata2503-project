import { useEmailSignIn } from '@/services/auth';
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
  VStack,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { EyeIcon, EyeOffIcon, Mail } from 'lucide-react-native';
import React, { useState } from 'react';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: signIn, error, isError } = useEmailSignIn();

  const handleShowPassword = () => setShowPassword(!showPassword);

  async function handleSignIn() {
    try {
      await signIn({ email, password });
      router.replace('/');
    } catch (error) {
      console.warn(error);
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
      <FormControl isInvalid={isError}>
        <VStack gap='$2'>
          <Input
            borderWidth='$1'
            borderRadius='$sm'
            width={250}
            p='$1.5'
          >
            <InputField
              type='text'
              placeholder='Email'
              onChangeText={setEmail}
            />
            <InputSlot>
              <InputIcon as={Mail} color='$gray400' mt={0} />
            </InputSlot>
          </Input>
          <Input
            borderWidth='$1'
            borderRadius='$sm'
            width={250}
            p='$1.5'
          >
            <InputField
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              onChangeText={setPassword}
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
