import { View, Text } from 'react-native';
import React from 'react';
import { H6 } from '../typography/heading';
import BackButton from '../buttons/cta/BackButton';
import NormalStaticButton from '../buttons/static/NormalStaticBtn';

const BackBtnHeader = ({ children }) => {
  return (
    <View className="flex-row my-2  justify-between items-center">
      {children}
    </View>
  );
};

BackBtnHeader.BackBtn = () => {
  return <BackButton />;
};

BackBtnHeader.Title = () => {
  return <H6 color={'text-secondary'}>IronMan</H6>;
};

BackBtnHeader.AmountDisplay = () => {
  return <NormalStaticButton style={'bg-white'} title={'Total = +50'} />;
};

export default BackBtnHeader;
