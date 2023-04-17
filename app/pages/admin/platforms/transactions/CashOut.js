import { View, Text } from 'react-native';
import React from 'react';
import CashOutCard from '@components/common/cards/CashOutCard';

const CashOut = () => {
  return (
    <View>
      <CashOutCard />
      <CashOutCard isAdmin />
      <CashOutCard />
      <CashOutCard isAdmin />
    </View>
  );
};

export default CashOut;
