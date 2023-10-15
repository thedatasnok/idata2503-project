import { createStyle } from '@gluestack-style/react';

export const MenuItem = createStyle({
  p: '$3',
  flexDirection: 'row',
  alignItems: 'center',

  ':hover': {
    bg: '$gray100',
  },

  ':disabled': {
    opacity: 0.4,
    ':focus': {
      bg: 'transparent',
    },
  },

  ':active': {
    bg: '$gray200',
  },

  ':focus': {
    bg: '$gray100',
    // @ts-ignore
    outlineWidth: '$0',
    outlineStyle: 'none',
  },

  ':focusVisible': {
    // @ts-ignore
    outlineWidth: '$0.5',
    outlineColor: '$primary700',
    outlineStyle: 'solid',
  },
});
