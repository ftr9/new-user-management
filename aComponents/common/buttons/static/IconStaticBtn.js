import { View, Text } from 'react-native';
import React from 'react';
import { P3 } from '@components/common/typography/text';
import { Icon } from '@rneui/themed';

const IconStaticButton = ({ title }) => {
  return (
    <View className=" bg-tertiary-20 w-[55px] px-2 py-1 flex-row rounded-full justify-between items-center">
      <Icon color={'#E03131'} name="people-circle" type="ionicon" size={18} />
      <P3 color={'text-tertiary'}>{title}</P3>
    </View>
  );
};

export default IconStaticButton;
