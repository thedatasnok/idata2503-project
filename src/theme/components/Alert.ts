import { createStyle } from '@gluestack-style/react';

export const Alert = createStyle({
  alignItems: 'center',
  p: '$3',
  flexDirection: 'row',
  borderRadius: '$sm',
  variants: {
    action: {
      error: {
        bg: '$gray50',
        borderColor: '$error300',
        _icon: {
          color: '$error500',
        },
      },
      warning: {
        bg: '$gray50',
        borderColor: '$warning300',
        _icon: {
          color: '$warning500',
        },
      },
      success: {
        bg: '$gray50',
        borderColor: '$success300',
        _icon: {
          color: '$success500',
        },
      },
      info: {
        bg: '$gray50',
        borderColor: '$primary300',
        _icon: {
          color: '$primary500',
        },
      },
      muted: {
        bg: '$gray50',
        borderColor: '$gray300',
        _icon: {
          color: '$gray500',
        },
      },
    },

    variant: {
      solid: {},
      outline: {
        borderWidth: '$1',
        bg: '$white',
      },
      accent: {
        borderLeftWidth: '$4',
      },
    },
  },

  defaultProps: {
    variant: 'solid',
    action: 'info',
  },
});
