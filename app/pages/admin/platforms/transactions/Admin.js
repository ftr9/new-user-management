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
import CashOutCard from '@components/common/cards/CashOutCard';

const Admin = () => {
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, transactionAdminList, isFetchingTransaction } =
    useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

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
      data={transactionAdminList}
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

export default Admin;
