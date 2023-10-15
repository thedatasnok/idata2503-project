import { createStyle } from '@gluestack-style/react';

export const RadioIndicator = createStyle({
  justifyContent: 'center',
  alignItems: 'center',
  bg: 'transparent',
  borderColor: '$gray400',
  borderWidth: 2,
  borderRadius: 999,

  ':checked': {
    borderColor: '$primary600',
    bg: 'transparent',
  },

  ':hover': {
    borderColor: '$gray500',
    bg: 'transparent',

    ':checked': {
      bg: 'transparent',
      borderColor: '$primary700',
    },
    ':invalid': {
      borderColor: '$error700',
    },
    ':disabled': {
      ':invalid': {
        borderColor: '$error400',
        opacity: 0.4,
      },
      borderColor: '$gray400',
      opacity: 0.4,
    },
  },

  ':active': {
    bg: 'transparent',
    borderColor: '$primary800',
  },

  ':invalid': {
    borderColor: '$error700',
  },

  ':disabled': {
    opacity: 0.4,
    ':checked': {
      borderColor: '$gray400',
      bg: 'transparent',
    },
    ':invalid': {
      borderColor: '$error400',
    },
  },
});
