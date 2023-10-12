import { createStyle } from '@gluestack-style/react';

export const SelectActionsheetItem = createStyle({
  p: '$3',
  flexDirection: 'row',
  alignItems: 'center',
  rounded: '$sm',
  w: '$full',

  ':disabled': {
    opacity: 0.4,
  },

  ':hover': {
    bg: '$backgroundLight100',
  },

  ':active': {
    bg: '$backgroundLight200',
  },

  ':focus': {
    bg: '$backgroundLight100',
  },

  _dark: {
    ':hover': {
      bg: '$backgroundDark800',
    },

    ':active': {
      bg: '$backgroundDark700',
    },

    ':focus': {
      bg: '$backgroundDark800',
    },
  },
});
