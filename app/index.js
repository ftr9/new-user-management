import { Text } from 'react-native';
import React from 'react';
import { Redirect } from 'expo-router';

const RootPage = () => {
  return <Redirect href={'/pages/login'} />;
};

export default RootPage;
