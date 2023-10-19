import Header from '@/components/navigation/Header';
import { supabase } from '@/services/supabase';
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
  Spinner,
  Switch,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from '../../i18n/index';

const SettingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      setEmail(session?.user?.email ?? '');
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      setEmail(session?.user?.email ?? '');
      supabase.auth.refreshSession();
    });
  }, []);

  const handleEmailNotificationToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handlePushNotificationToggle = () => {
    setPushNotifications(!pushNotifications);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18next.changeLanguage(languageCode);
  };

  const handleChangeEmail = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({ email: email });
      if (error) {
        console.error('Error updating email:', error.message);
      } else {
        console.log('Email updated successfully:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <>
      <Header title={t('settings')} />
      {loading ? (
        <Spinner pt='$12' size='large' />
      ) : (
        <ScrollView>
          <Box display='flex' flexDirection='column' p='$4' flex={1}>
            <Heading pb='$2'>{t('userprofile')}</Heading>
            <Box p='$1'>
              <FormControl>
                <VStack>
                  <FormControlLabelText color='$gray950'>
                    Full name
                  </FormControlLabelText>
                  <Input
                    isDisabled={true}
                    borderColor='$gray400'
                    borderWidth='$1'
                    borderRadius='$sm'
                    width='100%'
                    p='$1.5'
                  >
                    <InputField type='text' value='Placeholder name' />
                  </Input>

                  <FormControlLabelText color='$gray950' pt='$2'>
                    E-mail
                  </FormControlLabelText>
                  <Input
                    borderColor='$gray400'
                    borderWidth='$1'
                    borderRadius='$sm'
                    width='100%'
                    p='$1.5'
                  >
                    <InputField
                      type='text'
                      onChangeText={setEmail}
                      value={email}
                    />
                  </Input>
                </VStack>
              </FormControl>
            </Box>

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
              <Button onPress={handleChangeEmail}>
                <ButtonText>Save</ButtonText>
              </Button>
            </Box>

            <Box pt='$4'>
              <Button
                bgColor='$gray400'
                onPress={() => setShowAlertDialog(true)}
              >
                <ButtonText>Sign Out</ButtonText>
              </Button>
            </Box>
          </Box>

          <SignOutDialog
            showAlertDialog={showAlertDialog}
            setShowAlertDialog={setShowAlertDialog}
          />
        </ScrollView>
      )}
    </>
  );
};

interface SelectLanguageViewProps {
  handleLanguageChange: (languageCode: string) => void;
}

const SelectLanguageView: React.FC<SelectLanguageViewProps> = ({
  handleLanguageChange,
}) => {
  return (
    <Box py='$2'>
      <Select onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <SelectInput
            placeholder='No language selected as default'
            value={i18next.language}
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
}

const SignOutDialog: React.FC<SignOutDialogProps> = ({
  showAlertDialog,
  setShowAlertDialog,
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
              supabase.auth.signOut();
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
