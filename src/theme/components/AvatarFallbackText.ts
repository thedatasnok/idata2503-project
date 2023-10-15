import { createStyle } from '@gluestack-style/react';

export const AvatarFallbackText = createStyle({
  color: '$gray50',
  fontWeight: '$semibold',
  props: {
    size: 'xl',
  },
  overflow: 'hidden',
  textTransform: 'uppercase',
});
