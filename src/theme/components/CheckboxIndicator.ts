import { createStyle } from '@gluestack-style/react';

export const CheckboxIndicator = createStyle({
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: '$gray400',
  bg: '$transparent',
  borderRadius: 4,

  ':checked': {
    borderColor: '$primary600',
    bg: '$primary600',
  },

  ':hover': {
    borderColor: '$gray500',
    bg: 'transparent',
    ':invalid': {
      borderColor: '$error700',
    },
    ':checked': {
      bg: '$primary700',
      borderColor: '$primary700',
      ':disabled': {
        borderColor: '$primary600',
        bg: '$primary600',
        opacity: 0.4,
        ':invalid': {
          borderColor: '$error700',
        },
      },
    },
    ':disabled': {
      borderColor: '$gray400',
      ':invalid': {
        borderColor: '$error700',
      },
    },
  },

  ':active': {
    ':checked': {
      bg: '$primary800',
      borderColor: '$primary800',
    },
  },
  ':invalid': {
    borderColor: '$error700',
  },
  ':disabled': {
    opacity: 0.4,
  },
});
