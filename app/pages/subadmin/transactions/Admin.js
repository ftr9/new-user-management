import { View, Text, RefreshControl } from 'react-native';
import React, { useEffect } from 'react';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import useTransactionStore from '@store/useTransactionStore';
import { where, query, orderBy } from 'firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import { platformTransactionColRef } from '@config/firebaseRefs';
import CashOutCard from '@components/common/cards/CashOutCard';
import CashInCard from '@components/common/cards/CashInCard';
import LoadingIndication from '@components/common/Loading';

const Admin = () => {
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, isFetchingTransaction, transactionAdminList } =
    useTransactionStore();

  const adminQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isAdmin', '==', true),
    orderBy('createdAt', 'desc')
  );

  useEffect(() => {
    fetchTransaction(adminQueryCondition, 'ADMIN');
  }, []);

  if (isFetchingTransaction && transactionAdminList.length === 0) {
    return <LoadingIndication title={'Loading Transaction !!!'} />;
  }

  if (transactionAdminList.length === 0) {
    return <Text>No Transactions !!!!</Text>;
  }

  return (
    <FlashList
      refreshing={isFetchingTransaction}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            fetchTransaction(adminQueryCondition, 'ADMIN');
          }}
        />
      }
      estimatedItemSize={50}
      data={transactionAdminList}
      renderItem={({ item }) => {
        if (item.isCashIn) {
          return <CashInCard {...item} />;
        }
        return <CashOutCard {...item} />;
      }}
    />
  );
};

export default Admin;
