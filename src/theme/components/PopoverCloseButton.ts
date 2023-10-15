import { createStyle } from '@gluestack-style/react';

export const PopoverCloseButton = createStyle({
  zIndex: 1,
  p: '$2',
  rounded: '$sm',
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
