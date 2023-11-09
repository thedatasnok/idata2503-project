import { createStyle } from '@gluestack-style/react';

export const SelectTrigger = createStyle({
  borderWidth: 1,
  borderColor: '$gray400',
  borderRadius: '$sm',
  flexDirection: 'row',
  overflow: 'hidden',
  alignItems: 'center',

  ':hover': {
    borderColor: '$gray500',
  },

  ':focus': {
    borderColor: '$primary700',
  },

  ':disabled': {
    opacity: 0.4,
    ':hover': {
      borderColor: '$gray400',
    },
  },

  _input: {
    py: 'auto',
    px: '$3',
  },

  _icon: {
    color: '$gray500',
  },

  variants: {
    size: {
      xl: {
        h: '$12',
        _input: {
          fontSize: '$xl',
        },
        _icon: {
          h: '$6',
          w: '$6',
        },
      },
      lg: {
        h: '$11',
        _input: {
          fontSize: '$lg',
        },
        _icon: {
          h: '$5',
          w: '$5',
        },
      },
      md: {
        h: '$10',
        _input: {
          fontSize: '$md',
        },
        _icon: {
          h: '$4',
          w: '$4',
        },
      },
      sm: {
        h: '$9',
        _input: {
          fontSize: '$sm',
        },
        _icon: {
          h: '$3.5',
          w: '$3.5',
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
          ':hover': {
            borderColor: '$primary700',
          },
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
          ':hover': {
            borderColor: '$primary700',
          },
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
          ':hover': {
            borderColor: '$primary700',
          },
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
