import { createStyle } from '@gluestack-style/react';

export const Badge = createStyle({
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: '$xs',
  variants: {
    action: {
      error: {
        bg: '$gray50',
        borderColor: '$error300',
        _icon: {
          color: '$error600',
        },
        _text: {
          color: '$error600',
        },
      },
      warning: {
        bg: '$gray50',
        borderColor: '$warning300',
        _icon: {
          color: '$warning600',
        },
        _text: {
          color: '$warning600',
        },
      },
      success: {
        bg: '$gray50',
        borderColor: '$success300',
        _icon: {
          color: '$success600',
        },
        _text: {
          color: '$success600',
        },
      },
      info: {
        bg: '$gray50',
        borderColor: '$info300',
        _icon: {
          color: '$info600',
        },
        _text: {
          color: '$info600',
        },
      },
      muted: {
        bg: '$gray50',
        borderColor: '$gray300',
        _icon: {
          color: '$gray600',
        },
        _text: {
          color: '$gray600',
        },
      },
    },

    variant: {
      solid: {},
      outline: {
        borderWidth: '$1',
      },
    },

    size: {
      sm: {
        px: '$2',
        _icon: {
          props: {
            size: '2xs',
          },
        },
        _text: {
          props: {
            size: '2xs',
          },
        },
      },
      md: {
        px: '$2',
        _icon: {
          props: {
            size: 'xs',
          },
        },
        _text: {
          props: {
            size: 'xs',
          },
        },
      },
      lg: {
        px: '$2',
        _icon: {
          props: { size: 'sm' },
        },
        _text: {
          props: { size: 'sm' },
        },
      },
    },
  },

  ':disabled': {
    opacity: 0.5,
  },
  defaultProps: {
    action: 'info',
    variant: 'solid',
    size: 'md',
  },
});
