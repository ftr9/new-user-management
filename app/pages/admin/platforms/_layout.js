import { View, Text } from 'react-native';
import React from 'react';
import BackBtnHeader from '@components/common/header/BackBtnHeader';
import { Slot } from 'expo-router';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';

const PlatformLayout = () => {
  return (
    <>
      <BackBtnHeader>
        <BackBtnHeader.BackBtn />
        <BackBtnHeader.Title />
        <BackBtnHeader.AmountDisplay />
      </BackBtnHeader>
      <DataDisplayContainer>
        <Slot />
      </DataDisplayContainer>
    </>
  );
};

export default PlatformLayout;
