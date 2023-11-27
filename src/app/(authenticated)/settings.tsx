import ToastMessage, { Severity } from '@/components/feedback/ToastMessage';
import RadioInput from '@/components/input/RadioInput';
import Header from '@/components/navigation/Header';
import { useSignoutMutation } from '@/services/auth';
import { disassociateUserId } from '@/services/onesignal';
import { useProfileQuery, useUpdateProfileMutation } from '@/services/users';
import { useAuth } from '@/store/global';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  ButtonGroup,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Heading,
  Icon,
  Input,
  InputField,
  ScrollView,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { BellIcon, BellOffIcon, ChevronDownIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

const profileValidationSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  preferences: z.object({
    notifications: z.boolean(),
  }),
});

type UserProfileForm = z.infer<typeof profileValidationSchema>;

const SettingsScreen = () => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const { t, i18n } = useTranslation();
  const { session } = useAuth();
  const { mutateAsync: logout } = useSignoutMutation();
  const { data: userProfile } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<UserProfileForm>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      fullName: userProfile?.full_name,
      email: session?.user?.email,
      preferences: {
        notifications: true,
      },
    },
  });

  useEffect(() => {
    if (userProfile) {
      setValue('fullName', userProfile.full_name);
    }
  }, [userProfile]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const handleSignOut = () => {
    logout();
    disassociateUserId();
    router.push('/sign-in');
  };

  const onSubmit = async (data: UserProfileForm) => {
    try {
      await updateProfileMutation.mutateAsync({
        full_name: data.fullName,
      });
      toast.show({
        duration: 3000,
        render: () => (
          <ToastMessage
            severity={Severity.SUCCESS}
            header={t('SUCCESSES.CHANGES_SAVED_HEADER')}
            message={t('SUCCESSES.CHANGES_SAVED_MESSAGE')}
          />
        ),
      });
    } catch (err) {
      toast.show({
        duration: 3000,
        render: () => (
          <ToastMessage
            severity={Severity.ERROR}
            header={t('ERRORS.FAILED_TO_SAVE_CHANGES_HEADER')}
            message={t('ERRORS.FAILED_TO_SAVE_CHANGES_MESSAGE')}
          />
        ),
      });
    }
  };

  const onNotificationPreferenceChange = async (value: string) => {
    try {
      const notifications = value === 'true';
      await updateProfileMutation.mutateAsync({
        preferences: {
          notifications,
        },
      });
    } catch (err) {
      toast.show({
        duration: 3000,
        render: () => (
          <ToastMessage
            severity={Severity.ERROR}
            header={t('ERRORS.FAILED_TO_SAVE_CHANGES_HEADER')}
            message={t('ERRORS.FAILED_TO_SAVE_CHANGES_MESSAGE')}
          />
        ),
      });
    }
  };

  return (
    <>
      <Header title={t('NAVIGATION.MORE')} />

      <ScrollView>
        <Box display='flex' flexDirection='column' p='$2' flex={1}>
          <Box flexDirection='row' justifyContent='space-between'>
            <Heading pb='$2'>{t('FEATURES.SETTINGS.USER_PROFILE')}</Heading>
            <Avatar>
              <AvatarFallbackText>{userProfile?.full_name}</AvatarFallbackText>
              {userProfile?.avatar_url && (
                <AvatarImage source={{ uri: userProfile?.avatar_url }} />
              )}
            </Avatar>
          </Box>

          <VStack>
            <FormControl isInvalid={'fullName' in errors}>
              <FormControlLabel>
                <FormControlLabelText color='$gray950'>
                  {t('FEATURES.SETTINGS.FULL_NAME')}
                </FormControlLabelText>
              </FormControlLabel>

              <Controller
                control={control}
                name='fullName'
                render={({ field: { onChange, value } }) => (
                  <Input>
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
              <FormControlLabelText color='$gray400' pt='$2'>
                {t('FEATURES.SETTINGS.EMAIL')}
              </FormControlLabelText>

              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, value } }) => (
                  <Input>
                    <InputField
                      color='$gray400'
                      // @ts-ignore missing type in gluestack
                      readOnly={true}
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
                <ButtonText>{t('FEATURES.SETTINGS.UPDATE_PROFILE')}</ButtonText>
              </Button>
            </Box>
          </VStack>

          <Heading mt='$2'>{t('FEATURES.SETTINGS.NOTIFICATIONS')}</Heading>

          <RadioInput
            value={getValues('preferences.notifications').toString()}
            onChange={onNotificationPreferenceChange}
            options={[
              {
                icon: BellIcon,
                label: t('FEATURES.SETTINGS.NOTIFICATIONS_ENABLED_TITLE'),
                value: 'true',
                description: t(
                  'FEATURES.SETTINGS.NOTIFICATIONS_ENABLED_DESCRIPTION'
                ),
              },
              {
                icon: BellOffIcon,
                label: t('FEATURES.SETTINGS.NOTIFICATIONS_DISABLED_TITLE'),
                value: 'false',
                description: t(
                  'FEATURES.SETTINGS.NOTIFICATIONS_DISABLED_DESCRIPTION'
                ),
              },
            ]}
          />

          <Heading mt='$2'>{t('FEATURES.SETTINGS.LANGUAGE')}</Heading>
          <SelectLanguageView handleLanguageChange={handleLanguageChange} />

          <Box pt='$4'>
            <Button bg='$error500' onPress={() => setShowAlertDialog(true)}>
              <ButtonText>{t('FEATURES.SETTINGS.SIGN_OUT')}</ButtonText>
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

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Norsk', value: 'nb' },
];

const SelectLanguageView: React.FC<SelectLanguageViewProps> = ({
  handleLanguageChange,
}) => {
  const { i18n, t } = useTranslation();
  const insets = useSafeAreaInsets();

  const defaultLabel = LANGUAGE_OPTIONS.find(
    ({ value }) => value === i18n.language
  )?.label;

  return (
    <Box py='$2'>
      <Select onValueChange={handleLanguageChange} selectedLabel={defaultLabel}>
        <SelectTrigger>
          <SelectInput
            placeholder={t('FEATURES.SETTINGS.NO_LANGUAGE_SELECTED')}
          />
          <SelectIcon mr='$3'>
            <Icon as={ChevronDownIcon} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent pb={insets.bottom}>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {LANGUAGE_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} label={label} value={value} />
            ))}
          </SelectContent>
        </SelectPortal>
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
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog
      isOpen={showAlertDialog}
      onClose={() => {
        setShowAlertDialog(false);
      }}
    >
      <AlertDialogBackdrop />
      <AlertDialogContent width={250} alignItems='center'>
        <AlertDialogHeader>
          <Heading>{t('FEATURES.SETTINGS.SIGN_OUT')}?</Heading>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <ButtonGroup>
            <Button
              onPress={() => {
                setShowAlertDialog(false);
              }}
            >
              <ButtonText>{t('GENERAL.CANCEL')}</ButtonText>
            </Button>
            <Button
              bgColor='$error500'
              onPress={() => {
                signOut();
                setShowAlertDialog(false);
              }}
            >
              <ButtonText>{t('FEATURES.SETTINGS.SIGN_OUT')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SettingsScreen;
