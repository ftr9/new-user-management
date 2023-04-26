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
import LoadMoreContainer from '@components/common/display/LoadMoreContainer';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import { transactionLimit } from '@constants/transactionSize';

const CashIn = () => {
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    transactionCashInList,
    isFetchingTransaction,
    lastVisibleTransaction,
    isPaginatingTransactions,
    loadMoreTransaction,
  } = useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  const inQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isCashIn', '==', true),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
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
      ListFooterComponentStyle={{
        marginBottom: 10,
      }}
      ListFooterComponent={
        lastVisibleTransaction && (
          <LoadMoreContainer>
            <NormalButton
              title={'Load More'}
              size={'small'}
              color={tertiaryColor}
              isLoading={isPaginatingTransactions}
              onClick={() => {
                const inQueryPaginate = query(
                  platformTransactionColRef(activePlatformId),
                  where('caId', '==', expandedActiveCaCard),
                  where('isCashIn', '==', true),
                  orderBy('createdAt', 'desc'),
                  startAfter(lastVisibleTransaction),
                  limit(transactionLimit)
                );
                loadMoreTransaction(inQueryPaginate, 'CASHIN');
              }}
            />
          </LoadMoreContainer>
        )
      }
    />
  );
};

export default CashIn;
