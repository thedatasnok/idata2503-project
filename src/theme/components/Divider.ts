import { createStyle } from '@gluestack-style/react';

export const Divider = createStyle({
  bg: '$gray200',
  variants: {
    orientation: {
      vertical: {
        width: '$px',
        height: '$full',
      },
      horizontal: {
        height: '$px',
        width: '$full',
      },
    },
  },
  defaultProps: {
    orientation: 'horizontal',
  },
});
