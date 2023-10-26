import Header from '@/components/navigation/Header';
import { useProfile, useUpdateProfileMutation } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/store/global';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  Divider,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Switch,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const profileValidationSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

type UserProfileForm = z.infer<typeof profileValidationSchema>;

const SettingsScreen = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const { t, i18n } = useTranslation();
  const { logout, session } = useAuth();
  const { data: userProfile } = useProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserProfileForm>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      fullName: userProfile?.full_name,
      email: session?.user?.email,
    },
  });

  useEffect(() => {
    if (userProfile) {
      setValue('fullName', userProfile.full_name);
    }
  }, [userProfile]);

  const handleEmailNotificationToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handlePushNotificationToggle = () => {
    setPushNotifications(!pushNotifications);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const handleSignOut = () => {
    logout();
    router.push('/sign-in');
  };

  const onSubmit = async (data: UserProfileForm) => {
    try {
      if (userProfile?.full_name !== data.fullName) {
        await updateProfileMutation.mutateAsync({ full_name: data.fullName });
        console.log('Full name updated successfully:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }

    if (session?.user.email !== data.email) {
      try {
        const { error } = await supabase.auth.updateUser({ email: data.email });
        if (error) {
          //TODO: show message for error
          console.error('Error updating email:', error.message);
        } else {
          //TODO: show message for success
          console.log('Email confirmation successfully sent:', data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    } else {
      console.log('Email is the same');
    }
  };

  return (
    <>
      <Header title={t('settings')} />

      <ScrollView>
        <Box display='flex' flexDirection='column' p='$4' flex={1}>
          <Heading pb='$2'>{t('userprofile')}</Heading>

          <VStack>
            <FormControl isInvalid={'fullName' in errors}>
              <FormControlLabel>
                <FormControlLabelText color='$gray950'>
                  Full name
                </FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name='fullName'
                render={({ field: { onChange, value } }) => (
                  <Input
                    borderColor='$gray400'
                    borderWidth='$1'
                    borderRadius='$sm'
                    width='100%'
                    p='$1.5'
                  >
                    <InputField
                      onChangeText={(val) => onChange(val)}
                      defaultValue={userProfile?.full_name}
                      value={value}
                    />
                  </Input>
                )}
              />

              <FormControlError>
                <FormControlErrorText>
                  {errors.fullName?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={'email' in errors}>
              <FormControlLabelText color='$gray950' pt='$2'>
                Email
              </FormControlLabelText>

              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, value } }) => (
                  <Input
                    borderColor='$gray400'
                    borderWidth='$1'
                    borderRadius='$sm'
                    width='100%'
                    p='$1.5'
                  >
                    <InputField
                      onChangeText={(val) => onChange(val)}
                      defaultValue={session?.user.email}
                      value={value}
                    />
                  </Input>
                )}
              />

              <FormControlError>
                <FormControlErrorText>
                  {errors.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Box pt='$5'>
              <Button onPress={handleSubmit(onSubmit)}>
                <ButtonText>Update Profile</ButtonText>
              </Button>
            </Box>
          </VStack>

          <VStack>
            <Text pt='$8' fontSize='$xl' fontWeight='bold'>
              System Settings
            </Text>
            <Box p='$1'>
              <Text pt='$2' fontWeight='bold'>
                Notifications
              </Text>

              <Pressable
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                py='$2'
                onPress={handleEmailNotificationToggle}
              >
                <Text>Email notifications</Text>
                <Switch
                  value={emailNotifications}
                  onValueChange={handleEmailNotificationToggle}
                />
              </Pressable>
              <Divider />

              <Pressable
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                py='$2'
                onPress={handlePushNotificationToggle}
              >
                <Text>Push notifications</Text>
                <Switch
                  value={pushNotifications}
                  onValueChange={handlePushNotificationToggle}
                />
              </Pressable>
              <Divider />
            </Box>
          </VStack>

          <Text pt='$8' fontSize='$xl' fontWeight='bold'>
            Language
          </Text>
          <SelectLanguageView handleLanguageChange={handleLanguageChange} />

          <Box pt='$4'>
            <Button bg='$error500' onPress={() => setShowAlertDialog(true)}>
              <ButtonText>Sign Out</ButtonText>
            </Button>
          </Box>
        </Box>

        <SignOutDialog
          showAlertDialog={showAlertDialog}
          setShowAlertDialog={setShowAlertDialog}
          signOut={handleSignOut}
        />
      </ScrollView>
    </>
  );
};

interface SelectLanguageViewProps {
  handleLanguageChange: (languageCode: string) => void;
}

const SelectLanguageView: React.FC<SelectLanguageViewProps> = ({
  handleLanguageChange,
}) => {
  const { i18n } = useTranslation();

  return (
    <Box py='$2'>
      <Select onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <SelectInput
            placeholder='No language selected as default'
            value={i18n.language}
          />
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label='English' value='en' />
              <SelectItem label='Norwegian' value='no' />
            </SelectContent>
          </SelectPortal>
        </SelectTrigger>
      </Select>
    </Box>
  );
};

interface SignOutDialogProps {
  showAlertDialog: boolean;
  setShowAlertDialog: (showAlertDialog: boolean) => void;
  signOut: () => void;
}

const SignOutDialog: React.FC<SignOutDialogProps> = ({
  showAlertDialog,
  setShowAlertDialog,
  signOut,
}) => (
  <AlertDialog
    isOpen={showAlertDialog}
    onClose={() => {
      setShowAlertDialog(false);
    }}
  >
    <AlertDialogBackdrop />
    <AlertDialogContent width={250} alignItems='center'>
      <AlertDialogHeader>
        <Heading>Sign out?</Heading>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button
            onPress={() => {
              setShowAlertDialog(false);
            }}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            bgColor='$error500'
            onPress={() => {
              signOut();
              setShowAlertDialog(false);
            }}
          >
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default SettingsScreen;
