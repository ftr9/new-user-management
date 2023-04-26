import { View, Text, RefreshControl } from 'react-native';
import React, { useEffect } from 'react';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import useTransactionStore from '@store/useTransactionStore';
import { where, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import { platformTransactionColRef } from '@config/firebaseRefs';
import CashOutCard from '@components/common/cards/CashOutCard';
import CashInCard from '@components/common/cards/CashInCard';
import LoadingIndication from '@components/common/Loading';
import { transactionLimit } from '@constants/transactionSize';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import LoadMoreContainer from '@components/common/display/LoadMoreContainer';

const Admin = () => {
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    isFetchingTransaction,
    transactionAdminList,
    lastVisibleTransaction,
    isPaginatingTransactions,
    loadMoreTransaction,
  } = useTransactionStore();

  const adminQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isAdmin', '==', true),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
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
      ListFooterComponentStyle={{
        marginBottom: 10,
      }}
      ListFooterComponent={
        lastVisibleTransaction && (
          <LoadMoreContainer>
            <NormalButton
              title={'Load more'}
              size={'small'}
              color={tertiaryColor}
              isLoading={isPaginatingTransactions}
              onClick={() => {
                const adminQueryPaginate = query(
                  platformTransactionColRef(activePlatformId),
                  where('caId', '==', expandedActiveCaCard),
                  where('isAdmin', '==', true),
                  where('isDeleted', '==', false),
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
