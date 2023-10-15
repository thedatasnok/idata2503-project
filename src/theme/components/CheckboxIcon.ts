import { createStyle } from '@gluestack-style/react';

export const CheckboxIcon = createStyle({
  ':checked': {
    color: '$gray50',
  },
  ':disabled': {
    opacity: 0.4,
  },
});
