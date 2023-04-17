import { View, Text } from 'react-native';
import React from 'react';
import { P3 } from '@components/common/typography/text';

const NormalStaticButton = ({ title, style, textColor }) => {
  return (
    <View
      className={`${style} px-2 py-2 text-center flex-row rounded-full justify-center items-center`}
    >
      <P3 color={textColor ? textColor : 'text-primary'}>{title}</P3>
    </View>
  );
};

export default NormalStaticButton;
