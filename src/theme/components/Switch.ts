import { createStyle } from '@gluestack-style/react';

export const Switch = createStyle({
  props: {
    //@ts-ignore
    trackColor: { false: '$gray300', true: '$primary600' },
    thumbColor: '$gray50',
    //@ts-ignore
    activeThumbColor: '$gray50',

    // for ios specifically in unchecked state
    ios_backgroundColor: '$gray300',
  },
  borderRadius: '$full',
  variants: {
    //@ts-ignore

    size: {
      sm: {
        transform: [
          {
            scale: 0.75,
          },
        ],
      },
      md: {},
      lg: {
        transform: [
          {
            scale: 1.25,
          },
        ],
      },
    },
  },

  defaultProps: {
    size: 'md',
  },
  ':disabled': {
    opacity: 0.4,
    //@ts-ignore
    trackColor: { false: '$gray300', true: '$primary600' },
    // for ios specifically in unchecked state
    ios_backgroundColor: '$gray300',
    ':hover': {
      props: {
        //@ts-ignore
        trackColor: { false: '$gray300', true: '$primary600' },
      },
    },
  },
  ':invalid': {
    borderColor: '$error700',
    borderRadius: 12,
    borderWidth: 2,
  },
  ':hover': {
    props: {
      //@ts-ignore
      trackColor: { false: '$gray400', true: '$primary700' },
      ios_backgroundColor: '$gray400',
    },
    ':invalid': {
      props: {
        //@ts-ignore
        trackColor: { false: '$gray300', true: '$primary700' },
      },
    },
  },
  ':checked': {
    props: {
      //@ts-ignore
      thumbColor: '$gray0',
    },
  },
});
