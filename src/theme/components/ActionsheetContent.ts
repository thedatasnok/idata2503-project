import { createStyle } from '@gluestack-style/react';

export const ActionsheetContent = createStyle({
  alignItems: 'center',
  borderTopLeftRadius: '$3xl',
  borderTopRightRadius: '$3xl',
  h: '$full',
  p: '$2',
  bg: '$gray50',
  _sectionHeaderBackground: {
    bg: '$gray50',
  },
  defaultProps: {
    hardShadow: '5',
  },
});
