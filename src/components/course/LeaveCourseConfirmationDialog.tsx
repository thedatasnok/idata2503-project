import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  ButtonGroup,
  ButtonText,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import { useTranslation } from 'react-i18next';

export interface LeaveCourseConfirmationDialogProps {
  courseCode?: string;
  /**
   * Whether the dialog should be shown or not.
   */
  show: boolean;
  /**
   * Callback for when the user presses the leave option.
   */
  onLeave: () => void;
  /**
   * Callback for when the dialog closes, either after of without the user pressing the leave option.
   */
  onClose: () => void;
}

const LeaveCourseConfirmationDialog: React.FC<
  LeaveCourseConfirmationDialogProps
> = ({ courseCode, show, onLeave, onClose }) => {
  const { t } = useTranslation();

  return (
    <AlertDialog isOpen={show} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading>
            {t('FEATURES.COURSES.LEAVE_COURSE_CONFIRMATION_TITLE', {
              course: courseCode,
            })}
          </Heading>
        </AlertDialogHeader>

        <AlertDialogBody py='$0'>
          <Text color='$gray500'>
            {t('FEATURES.COURSES.LEAVE_COURSE_CONFIRMATION_BODY')}
          </Text>
        </AlertDialogBody>

        <AlertDialogFooter>
          <ButtonGroup>
            <Button action='negative' variant='outline' onPress={onLeave}>
              <ButtonText>{t('FEATURES.COURSES.LEAVE_COURSE')}</ButtonText>
            </Button>
            <Button onPress={onClose} variant='outline'>
              <ButtonText>{t('GENERAL.CANCEL')}</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveCourseConfirmationDialog;
