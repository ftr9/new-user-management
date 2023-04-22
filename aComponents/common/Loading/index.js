import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { P4 } from '../typography/text';
import { tertiaryColor } from '@constants/color';

const LoadingIndication = ({ title }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator color={tertiaryColor} size={'large'} />
      <P4 color={'text-tertiary'}>{title}</P4>
    </View>
  );
};

export default LoadingIndication;
