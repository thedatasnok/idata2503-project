import { CourseBoard } from '@/services/courses';
import {
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  Box,
  Divider,
} from '@gluestack-ui/themed';
import { TrashIcon, XIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BoardForm from './BoardForm';

export interface BoardSheetProps {
  courseId: string;
  selectedBoard?: CourseBoard;
  onClose: () => void;
  onDeselect: () => void;
  onCancel: () => void;
  onDeleteBoard: (boardId: string) => void;
}

const BoardSheet: React.FC<BoardSheetProps> = ({
  courseId,
  selectedBoard,
  onClose,
  onDeleteBoard,
  onDeselect,
  onCancel,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  const closeWith = (cb?: () => void) => {
    cb?.();
    onClose();
  };

  return (
    <Box pb={bottom} w='$full'>
      <Box px='$2' mb='$2'>
        <BoardForm
          key={selectedBoard?.course_board_id}
          courseId={courseId}
          boardId={selectedBoard?.course_board_id}
          boardName={selectedBoard?.name}
          boardDescription={selectedBoard?.description}
          onSuccess={() => closeWith(onDeselect)}
        />
      </Box>

      {selectedBoard && (
        <>
          <ActionsheetItem
            onPress={() =>
              closeWith(() => onDeleteBoard(selectedBoard.course_board_id))
            }
          >
            <ActionsheetIcon as={TrashIcon} color='$error600' />
            <ActionsheetItemText color='$error600'>
              {t('FEATURES.COURSE_BOARDS.DELETE_BOARD')}
            </ActionsheetItemText>
          </ActionsheetItem>

          <Divider />
        </>
      )}

      <ActionsheetItem onPress={() => closeWith(onCancel)}>
        <ActionsheetIcon as={XIcon} color='$gray800' />
        <ActionsheetItemText color='$gray800'>
          {t('GENERAL.CANCEL')}
        </ActionsheetItemText>
      </ActionsheetItem>
    </Box>
  );
};

export default BoardSheet;
