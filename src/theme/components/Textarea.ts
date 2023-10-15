import { createStyle } from '@gluestack-style/react';

export const Textarea = createStyle({
  w: '100%',
  borderWidth: 1,
  borderColor: '$gray300',
  borderRadius: '$sm',
  h: 100,
  _input: {
    p: '$3',
  },
  ':hover': {
    borderColor: '$gray400',
  },

  ':focus': {
    borderColor: '$primary700',
    ':hover': {
      borderColor: '$primary700',
    },
  },

  ':disabled': {
    opacity: 0.4,
    ':hover': {
      borderColor: '$gray300',
    },
  },

  variants: {
    size: {
      xl: {
        _input: {
          fontSize: '$xl',
        },
      },

      lg: {
        _input: {
          fontSize: '$lg',
        },
      },
      md: {
        _input: {
          fontSize: '$md',
        },
      },
      sm: {
        _input: {
          fontSize: '$sm',
        },
      },
    },
    variant: {
      default: {
        ':focus': {
          borderColor: '$primary700',
        },
        ':invalid': {
          borderColor: '$error700',
          ':hover': {
            borderColor: '$error700',
          },
          ':focus': {
            ':hover': {
              borderColor: '$primary700',
            },
          },
          ':disabled': {
            ':hover': {
              borderColor: '$error700',
            },
          },
        },
      },
    },
  },

  defaultProps: {
    variant: 'default',
    size: 'md',
  },
});
