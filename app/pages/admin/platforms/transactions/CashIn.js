import { View, Text } from 'react-native';
import React from 'react';
import CashInCard from '@components/common/cards/CashInCard';

const CashIn = () => {
  return (
    <View>
      <CashInCard />
      <CashInCard isAdmin />
      <CashInCard />
      <CashInCard isAdmin />
      <CashInCard />
    </View>
  );
};

export default CashIn;
