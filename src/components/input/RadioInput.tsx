import { IconType } from '@/icon';
import {
  Box,
  CircleIcon,
  Icon,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  Text,
  styled,
} from '@gluestack-ui/themed';
import { useState } from 'react';

export interface RadioInputOption<T extends string> {
  value: T;
  icon: IconType;
  label: string;
  description?: string;
}

export interface RadioInputProps<T extends string> {
  options: RadioInputOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
}

const RadioInput = <T extends string>({
  options,
  value: defaultValue,
  onChange,
}: RadioInputProps<T>) => {
  const [value, setValue] = useState(defaultValue ?? options[0].value);

  const emitChange = (newValue: any) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <RadioGroup onChange={emitChange} value={value}>
      {options.map((option, idx, arr) => (
        <StyledRadio
          key={option.label + value}
          value={option.value}
          first={idx === 0}
          last={idx === arr.length - 1}
          states={{ checked: option.value === value }}
        >
          <Icon as={option.icon} size='lg' color='$primary600' mr='$1' />

          <Box gap='-$1' flex={1}>
            {/* @ts-ignore too complex type */}
            <StyledRadioLabel states={{ active: option.value === value }}>
              {option.label}
            </StyledRadioLabel>

            {option.description && (
              <Text fontSize='$xs' lineHeight='$2xs'>
                {option.description}
              </Text>
            )}
          </Box>

          <RadioIndicator h='$4' w='$4' borderWidth='$1'>
            {/* @ts-ignore too complex type */}
            <StyledRadioIcon
              as={CircleIcon}
              states={{ checked: option.value === value }}
            />
          </RadioIndicator>
        </StyledRadio>
      ))}
    </RadioGroup>
  );
};

// @ts-ignore too complex type, out of our control
const StyledRadio = styled(Radio, {
  display: 'flex',
  alignItems: 'center',
  py: '$1',
  pl: '$2',
  pr: '$4',
  marginTop: -1,
  borderWidth: '$1',
  borderColor: '$gray300',
  bg: '$gray50',
  ':checked': {
    zIndex: 10,
    backgroundColor: '$primary100',
    borderColor: '$primary600',
  },
  variants: {
    first: {
      true: {
        borderTopLeftRadius: '$md',
        borderTopRightRadius: '$md',
      },
    },
    last: {
      true: {
        borderBottomLeftRadius: '$md',
        borderBottomRightRadius: '$md',
      },
    },
  },
});

const StyledRadioLabel = styled(RadioLabel, {
  fontWeight: '$medium',
  color: '$gray800',
  ':active': {
    color: '$primary600',
  },
});

// @ts-ignore too complex type, out of our control
const StyledRadioIcon = styled(RadioIcon, {
  h: '$2.5',
  w: '$2.5',
  color: '$gray400',
  ':checked': {
    color: '$primary600',
  },
});

export default RadioInput;
