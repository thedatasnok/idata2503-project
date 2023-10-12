import { createStyle } from '@gluestack-style/react';

export const SelectActionsheetContent = createStyle({
  alignItems: 'center',
  borderTopLeftRadius: '$lg',
  borderTopRightRadius: '$lg',
  maxHeight: '70%',
  p: '$2',
  bg: '$gray50',
  _sectionHeaderBackground: {
    bg: '$gray50',
  },
  defaultProps: {
    hardShadow: '5',
  },
});
