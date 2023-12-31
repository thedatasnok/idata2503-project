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
    bg: '$gray100',
  },

  ':active': {
    bg: '$gray200',
  },

  ':focus': {
    bg: '$gray100',
  },
});
