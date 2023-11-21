import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '@gluestack-ui/themed';
import { SearchIcon } from 'lucide-react-native';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const DEBOUNCE_MILLISECONDS = 300;
const ANIMATION_DURATION = 200;

export interface CancellableSearchProps extends ComponentProps<typeof Box> {
  placeholder?: string;
  isSearching?: boolean;
  onFocus?: (isSearching: boolean) => void;
  onSearch: (search: string) => void;
  onCancel?: () => void;
}

const CancellableSearch: React.FC<CancellableSearchProps> = ({
  placeholder,
  isSearching,
  onFocus,
  onSearch,
  onCancel,
  ...rest
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>();

  const onTextChanged = (string: string) => {
    setValue(string);
  };

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), DEBOUNCE_MILLISECONDS);
    return () => clearTimeout(timer);
  }, [value]);

  const handleCancel = () => {
    inputRef.current?.blur();
    setValue('');
    onCancel?.();
  };

  const inputContainerStyle = useAnimatedStyle<ViewStyle>(() => ({
    flex: 1,
    width: withTiming(isSearching ? '80%' : '100%', {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
    }),
  }));

  const buttonContainerStyle = useAnimatedStyle<ViewStyle>(() => ({
    width: withTiming(isSearching ? '20%' : '0%', {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
    }),
  }));

  return (
    <Box {...rest} flexDirection='row' alignItems='center'>
      <Animated.View style={inputContainerStyle}>
        <Input>
          <InputField
            ref={inputRef as any}
            value={value}
            placeholder={placeholder ?? t('GENERAL.SEARCH') + '...'}
            onFocus={() => onFocus?.(true)}
            onChangeText={onTextChanged}
          />

          <InputSlot mr='$3'>
            <InputIcon as={SearchIcon} />
          </InputSlot>
        </Input>
      </Animated.View>

      <Animated.View style={buttonContainerStyle}>
        {isSearching && (
          <Button variant='link' onPress={handleCancel}>
            <ButtonText textAlign='right' numberOfLines={1}>
              {t('GENERAL.CANCEL')}
            </ButtonText>
          </Button>
        )}
      </Animated.View>
    </Box>
  );
};

export default CancellableSearch;
