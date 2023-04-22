import { View, Text, RefreshControl } from 'react-native';
import React from 'react';
import CashInCard from '@components/common/cards/CashInCard';
import usePlatformsStore from '@store/usePlatformsStore';
import useCaStore from '@store/useCaStore';
import useTransactionStore from '@store/useTransactionStore';
import { useEffect } from 'react';
import LoadingIndication from '@components/common/Loading';
import { orderBy, query, where } from 'firebase/firestore';
import { platformTransactionColRef } from '@config/firebaseRefs';
import { FlashList } from '@shopify/flash-list';

const CashIn = () => {
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, transactionCashInList, isFetchingTransaction } =
    useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  const inQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isCashIn', '==', true),
    orderBy('createdAt', 'desc')
  );
  useEffect(() => {
    fetchTransaction(inQueryCondition, 'CASHIN');
  }, []);

  if (isFetchingTransaction && transactionCashInList.length === 0) {
    return <LoadingIndication title={'Loading Transaction !!!'} />;
  }

  return (
    <FlashList
      refreshing={isFetchingTransaction}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            fetchTransaction(inQueryCondition, 'CASHIN');
          }}
        />
      }
      data={transactionCashInList}
      renderItem={({ item }) => {
        return <CashInCard {...item} />;
      }}
      estimatedItemSize={50}
    />
  );
};

export default CashIn;
