import { createStyle } from '@gluestack-style/react';

export const ActionsheetItem = createStyle({
  p: '$3',
  flexDirection: 'row',
  alignItems: 'center',
  rounded: '$sm',
  w: '$full',

  ':disabled': {
    opacity: 0.4,
  },

  ':hover': {
    bg: '$gray50',
  },

  ':active': {
    bg: '$gray100',
  },

  ':focus': {
    bg: '$gray100',
  },
});
