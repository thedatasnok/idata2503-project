import { createStyle } from '@gluestack-style/react';

export const TextareaInput = createStyle({
  p: '$2',
  color: '$gray900',
  textAlignVertical: 'top',
  flex: 1,
  props: {
    // @ts-ignore
    multiline: true,
    placeholderTextColor: '$gray500',
  },
});
