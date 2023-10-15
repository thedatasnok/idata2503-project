import { createStyle } from '@gluestack-style/react';

export const RadioLabel = createStyle({
  color: '$gray600',
  ':checked': {
    color: '$gray900',
  },
  ':hover': {
    color: '$gray900',
    ':checked': {
      color: '$gray900',
    },
    ':disabled': {
      color: '$gray600',
      ':checked': {
        color: '$gray900',
      },
    },
  },
  ':active': {
    color: '$gray900',
    ':checked': {
      color: '$gray900',
    },
  },

  ':disabled': {
    opacity: 0.4,
  },
});
