import { createStyle } from '@gluestack-style/react';

export const Input = createStyle({
  borderWidth: 1,
  borderColor: '$gray300',
  borderRadius: '$sm',
  flexDirection: 'row',
  overflow: 'hidden',
  alignContent: 'center',

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

  _input: {
    py: 'auto',
    px: '$3',
  },

  _icon: {
    color: '$gray400',
  },

  variants: {
    size: {
      xl: {
        h: '$12',
        _input: {
          props: {
            size: 'xl',
          },
        },
        _icon: {
          props: {
            size: 'xl',
          },
        },
      },
      lg: {
        h: '$11',
        _input: {
          props: {
            size: 'lg',
          },
        },
        _icon: {
          props: {
            size: 'lg',
          },
        },
      },
      md: {
        h: '$10',
        _input: {
          props: {
            size: 'md',
          },
        },
        _icon: {
          props: {
            size: 'sm',
          },
        },
      },
      sm: {
        h: '$9',
        _input: {
          props: {
            size: 'sm',
          },
        },
        _icon: {
          props: {
            size: 'xs',
          },
        },
      },
    },
    variant: {
      underlined: {
        _input: {
          px: '$0',
        },
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: '$1',
        ':focus': {
          borderColor: '$primary700',
        },
        ':invalid': {
          borderBottomWidth: 2,
          borderBottomColor: '$error700',
          ':hover': {
            borderBottomColor: '$error700',
          },
          ':focus': {
            borderBottomColor: '$error700',
            ':hover': {
              borderBottomColor: '$error700',
            },
          },
          ':disabled': {
            ':hover': {
              borderBottomColor: '$error700',
            },
          },
        },
      },

      outline: {
        ':focus': {
          borderColor: '$primary700',
        },
        ':invalid': {
          borderColor: '$error700',
          ':hover': {
            borderColor: '$error700',
          },
          ':focus': {
            borderColor: '$error700',
            ':hover': {
              borderColor: '$error700',
            },
          },
          ':disabled': {
            ':hover': {
              borderColor: '$error700',
            },
          },
        },
      },

      rounded: {
        borderRadius: 999,
        _input: {
          px: '$4',
        },
        ':focus': {
          borderColor: '$primary700',
        },
        ':invalid': {
          borderColor: '$error700',
          ':hover': {
            borderColor: '$error700',
          },
          ':focus': {
            borderColor: '$error700',
            ':hover': {
              borderColor: '$error700',
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
    size: 'md',
    variant: 'outline',
  },
});
