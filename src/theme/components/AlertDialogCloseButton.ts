import { createStyle } from '@gluestack-style/react';

export const AlertDialogCloseButton = createStyle({
  zIndex: 1,
  rounded: '$sm',
  p: '$2',
  _icon: {
    color: '$gray400',
  },
  _text: {
    color: '$gray400',
  },
  ':hover': {
    _icon: {
      color: '$gray700',
    },
    _text: {
      color: '$gray700',
    },
  },

  ':active': {
    _icon: {
      color: '$gray900',
    },
    _text: {
      color: '$gray900',
    },
  },

  ':focusVisible': {
    bg: '$gray100',
    _icon: {
      color: '$gray900',
    },
    _text: {
      color: '$gray900',
    },
  },
});
