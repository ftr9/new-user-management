import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { H5 } from '../typography/heading';
import { Avatar } from '@rneui/themed';
import { primaryColor } from '@constants/color';
import IconStaticButton from '../buttons/static/IconStaticBtn';
import NormalStaticButton from '../buttons/static/NormalStaticBtn';

const CardInfoHeader = () => {
  return (
    <View className="w-[100%]  bg-secondary flex-row flex-wrap justify-between items-center">
      <View className="flex-row">
        <H5>Hello</H5>
        <TouchableOpacity
          onPress={() => {
            alert('hello world');
          }}
        >
          <Avatar
            size={25}
            rounded
            containerStyle={{
              backgroundColor: primaryColor,
              marginLeft: 15,
            }}
            icon={{
              name: 'pencil',
              type: 'font-awesome',
            }}
          ></Avatar>
        </TouchableOpacity>
      </View>

      <View className="flex-row">
        <NormalStaticButton
          style={'border-primary border-[0.5px] mr-2'}
          title={'+$50'}
        />
        <IconStaticButton title={10} />
      </View>
    </View>
  );
};

export default CardInfoHeader;
