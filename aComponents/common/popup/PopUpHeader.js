import { View, Text } from 'react-native';
import React from 'react';
import { Avatar } from '@rneui/themed';
import { H6 } from '../typography/heading';

const PopUpHeader = ({ onCloseClick, title }) => {
  return (
    <View className="w-[100%] flex-row justify-between items-center p-3 ">
      <View className=" w-[80%]">
        <H6>{title}</H6>
      </View>
      <Avatar
        size={50}
        rounded
        icon={{ name: 'close', type: 'ionicon' }}
        containerStyle={{
          backgroundColor: '#E03131',
        }}
        onPress={onCloseClick}
      ></Avatar>
    </View>
  );
};

export default PopUpHeader;
