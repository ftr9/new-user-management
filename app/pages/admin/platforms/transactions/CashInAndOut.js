import { View, Text } from 'react-native';
import React from 'react';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import NormalStaticButton from '@components/common/buttons/static/NormalStaticBtn';
import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';
import usePlatformsStore from '@store/usePlatformsStore';
import useTransactionStore from '@store/useTransactionStore';
import useCaStore from '@store/useCaStore';
import { useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';

const CashInAndOut = () => {
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, transactionList, isFetchingTransaction } =
    useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  useEffect(() => {
    fetchTransaction(activePlatformId, expandedActiveCaCard);
  }, []);

  if (transactionList.length === 0 && isFetchingTransaction) {
    return <Text>🕓🕔🕕🕖🕗🕘</Text>;
  }

  return (
    <FlashList
      data={transactionList}
      renderItem={({ item }) => {
        if (item.isCashIn) {
          return <CashInCard {...item} />;
        }
        return <CashOutCard {...item} />;
      }}
      estimatedItemSize={50}
    />
  );
};

export default CashInAndOut;
