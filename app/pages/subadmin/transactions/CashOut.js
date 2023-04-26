import { View, Text, RefreshControl } from 'react-native';
import React, { useEffect } from 'react';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import useTransactionStore from '@store/useTransactionStore';
import { where, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import { platformTransactionColRef } from '@config/firebaseRefs';
import CashOutCard from '@components/common/cards/CashOutCard';
import LoadingIndication from '@components/common/Loading';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { transactionLimit } from '@constants/transactionSize';
import LoadMoreContainer from '@components/common/display/LoadMoreContainer';

const CashOut = () => {
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    isFetchingTransaction,
    transactionCashOutList,
    loadMoreTransaction,
    lastVisibleTransaction,
    isPaginatingTransactions,
  } = useTransactionStore();

  const outQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isCashIn', '==', false),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
  );

  useEffect(() => {
    fetchTransaction(outQueryCondition, 'CASHOUT');
  }, []);

  if (isFetchingTransaction && transactionCashOutList.length === 0) {
    return <LoadingIndication title={'Loading Transaction !!!'} />;
  }

  if (transactionCashOutList.length === 0) {
    return <Text>No Transactions !!!!</Text>;
  }

  return (
    <FlashList
      refreshing={isFetchingTransaction}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            fetchTransaction(outQueryCondition, 'CASHOUT');
          }}
        />
      }
      estimatedItemSize={50}
      data={transactionCashOutList}
      renderItem={({ item }) => {
        return <CashOutCard {...item} />;
      }}
      ListFooterComponentStyle={{
        marginBottom: 10,
      }}
      ListFooterComponent={
        lastVisibleTransaction && (
          <LoadMoreContainer>
            <NormalButton
              size={'small'}
              title={'Load More'}
              isLoading={isPaginatingTransactions}
              onClick={() => {
                const outQueryPaginate = query(
                  platformTransactionColRef(activePlatformId),
                  where('caId', '==', expandedActiveCaCard),
                  where('isCashIn', '==', false),
                  where('isDeleted', '==', false),
                  orderBy('createdAt', 'desc'),
                  startAfter(lastVisibleTransaction),
                  limit(transactionLimit)
                );

                loadMoreTransaction(outQueryPaginate, 'CASHOUT');
              }}
            />
          </LoadMoreContainer>
        )
      }
    />
  );
};

export default CashOut;
