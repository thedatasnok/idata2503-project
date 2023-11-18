import { useEmailSignIn } from '@/services/auth';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  Heading,
  Image,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  KeyboardAvoidingView,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { EyeIcon, EyeOffIcon, Mail } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: signIn, isError } = useEmailSignIn();
  const { t } = useTranslation();
  const passwordRef = useRef<TextInput>(null);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          flex={1}
        >
          <Image
            source={require('../../../assets/icon.png')}
            alt='Logo'
            width={200}
            height={200}
          />

          {/* Wrapping in view to allow for the text to be animated in a similar way as the rest */}
          <View>
            <Heading textAlign='center' color='$gray950'>
              {t('FEATURES.SIGN_IN.WELCOME_MESSAGE')}
            </Heading>
            <Text textAlign='center' pb='$4'>
              {t('FEATURES.SIGN_IN.SIGN_IN_MESSAGE')}
            </Text>
          </View>

          <FormControl isInvalid={isError}>
            <VStack gap='$2'>
              <Input borderWidth='$1' borderRadius='$sm' width={250} p='$1.5'>
                <InputField
                  type='text'
                  placeholder={t('FEATURES.SIGN_IN.EMAIL')}
                  inputMode='email'
                  enterKeyHint='next'
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  onChangeText={setEmail}
                />
                <InputSlot>
                  <InputIcon as={Mail} color='$gray400' />
                </InputSlot>
              </Input>
              <Input borderWidth='$1' borderRadius='$sm' width={250} p='$1.5'>
                <InputField
                  // @ts-ignore
                  ref={passwordRef}
                  enterKeyHint='go'
                  onSubmitEditing={handleSignIn}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('FEATURES.SIGN_IN.PASSWORD')}
                  onChangeText={setPassword}
                />
                <InputSlot onPress={handleShowPassword}>
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    color='$primary600'
                  />
                </InputSlot>
              </Input>

              <FormControlError>
                <FormControlErrorText color='$error600'>
                  {t('FEATURES.SIGN_IN.ERROR_INCORRECT_CREDENTIALS')}
                </FormControlErrorText>
              </FormControlError>

              <Box pt='$4'>
                <Button onPress={handleSignIn}>
                  <ButtonText>{t('FEATURES.SIGN_IN.SIGN_IN')}</ButtonText>
                </Button>
              </Box>
            </VStack>
          </FormControl>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
