import { createStyle } from '@gluestack-style/react';

export const SliderThumb = createStyle({
  bg: '$primary500',
  position: 'absolute',
  borderRadius: '$full',
  ':focus': {
    bg: '$primary600',
  },
  ':active': {
    bg: '$primary600',
  },
  ':hover': {
    bg: '$primary600',
  },
  ':disabled': {
    bg: '$primary500',
  },
  defaultProps: {
    hardShadow: '1',
  },
});
