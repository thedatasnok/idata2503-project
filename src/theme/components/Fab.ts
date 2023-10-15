import { createStyle } from '@gluestack-style/react';

export const Fab = createStyle({
  bg: '$primary500',
  rounded: '$full',
  zIndex: 20,
  p: 16,
  flexDirection: 'row',

  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  ':hover': {
    bg: '$primary600',
  },

  ':active': {
    bg: '$primary700',
  },

  ':disabled': {
    opacity: 0.4,
  },

  _text: {
    color: '$gray50',
    fontWeight: '$normal',
  },

  _icon: {
    color: '$gray50',
    ':hover': {
      color: '$gray50',
    },
    ':active': {
      color: '$gray50',
    },
  },

  variants: {
    size: {
      sm: {
        px: '$2.5',
        py: '$2.5',
        _text: {
          fontSize: '$sm',
        },
        _icon: {
          props: {
            size: 'sm',
          },
        },
      },
      md: {
        px: '$3',
        py: '$3',
        _text: {
          fontSize: '$md',
        },
        _icon: {
          props: {
            size: 'md',
          },
        },
      },
      lg: {
        px: '$4',
        py: '$4',
        _text: {
          fontSize: '$lg',
        },
        _icon: {
          props: {
            size: 'md',
          },
        },
      },
    },

    placement: {
      'top right': {
        top: '$4',
        right: '$4',
      },

      'top left': {
        top: '$4',
        left: '$4',
      },

      'bottom right': {
        bottom: '$4',
        right: '$4',
      },

      'bottom left': {
        bottom: '$4',
        left: '$4',
      },

      'top center': {
        top: '$4',
        alignSelf: 'center',
      },

      'bottom center': {
        bottom: '$4',
        alignSelf: 'center',
      },
    },
  },
  defaultProps: {
    placement: 'bottom right',
    size: 'md',
    hardShadow: '2',
  },
});
