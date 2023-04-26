import { View, Text, RefreshControl } from 'react-native';
import React from 'react';
import CashInCard from '@components/common/cards/CashInCard';
import usePlatformsStore from '@store/usePlatformsStore';
import useCaStore from '@store/useCaStore';
import useTransactionStore from '@store/useTransactionStore';
import { useEffect } from 'react';
import LoadingIndication from '@components/common/Loading';
import { limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { platformTransactionColRef } from '@config/firebaseRefs';
import { FlashList } from '@shopify/flash-list';
import CashOutCard from '@components/common/cards/CashOutCard';
import { transactionLimit } from '@constants/transactionSize';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import LoadMoreContainer from '@components/common/display/LoadMoreContainer';

const Admin = () => {
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    transactionAdminList,
    isFetchingTransaction,
    lastVisibleTransaction,
    isPaginatingTransactions,
    loadMoreTransaction,
  } = useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  const adminQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isAdmin', '==', true),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
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
      ListFooterComponentStyle={{
        marginBottom: 10,
      }}
      ListFooterComponent={
        lastVisibleTransaction && (
          <LoadMoreContainer>
            <NormalButton
              isLoading={isPaginatingTransactions}
              title={'Load More'}
              color={tertiaryColor}
              size={'small'}
              onClick={() => {
                const adminQueryPaginate = query(
                  platformTransactionColRef(activePlatformId),
                  where('caId', '==', expandedActiveCaCard),
                  where('isAdmin', '==', true),
                  orderBy('createdAt', 'desc'),
                  startAfter(lastVisibleTransaction),
                  limit(transactionLimit)
                );
                loadMoreTransaction(adminQueryPaginate, 'ADMIN');
              }}
            />
          </LoadMoreContainer>
        )
      }
    />
  );
};

export default Admin;
