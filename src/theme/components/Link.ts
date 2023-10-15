import { createStyle } from '@gluestack-style/react';

export const Link = createStyle({
  _text: {
    ':hover': {
      color: '$primary600',
      textDecorationLine: 'none',
    },
    ':active': {
      color: '$primary700',
    },
    ':disabled': {
      opacity: 0.4,
    },
  },
});
