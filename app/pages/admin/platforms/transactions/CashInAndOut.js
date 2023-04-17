import { View, Text } from 'react-native';
import React from 'react';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import NormalStaticButton from '@components/common/buttons/static/NormalStaticBtn';
import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';

const CashInAndOut = () => {
  return (
    <View>
      <CashInCard />
      <CashInCard />
      <CashInCard isAdmin />
      <CashOutCard />
      <CashOutCard />
      <CashOutCard isAdmin />
    </View>
  );
};

export default CashInAndOut;
