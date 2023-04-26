import { View, Text, RefreshControl } from 'react-native';
import React, { useEffect } from 'react';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import useTransactionStore from '@store/useTransactionStore';
import { where, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import { platformTransactionColRef } from '@config/firebaseRefs';
import CashInCard from '@components/common/cards/CashInCard';
import LoadingIndication from '@components/common/Loading';
import { transactionLimit } from '@constants/transactionSize';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import LoadMoreContainer from '@components/common/display/LoadMoreContainer';

const CashIn = () => {
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    isFetchingTransaction,
    transactionCashInList,
    isPaginatingTransactions,
    loadMoreTransaction,
    lastVisibleTransaction,
  } = useTransactionStore();

  const inQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isCashIn', '==', true),
    where('isDeleted', '==', false),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
  );

  useEffect(() => {
    fetchTransaction(inQueryCondition, 'CASHIN');
  }, []);

  if (isFetchingTransaction && transactionCashInList.length === 0) {
    return <LoadingIndication title={'Loading Transaction !!!'} />;
  }

  if (transactionCashInList.length === 0) {
    return <Text>No Transactions !!!!</Text>;
  }

  return (
    <FlashList
      refreshing={isFetchingTransaction}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            //console.log('gonna be doing tonight');
            fetchTransaction(inQueryCondition, 'CASHIN');
          }}
        />
      }
      estimatedItemSize={50}
      data={transactionCashInList}
      renderItem={({ item }) => {
        return <CashInCard {...item} />;
      }}
      ListFooterComponentStyle={{
        marginBottom: 10,
      }}
      ListFooterComponent={
        lastVisibleTransaction && (
          <LoadMoreContainer>
            <NormalButton
              size={'small'}
              title="Load More"
              color={tertiaryColor}
              isLoading={isPaginatingTransactions}
              onClick={() => {
                const inQueryPaginate = query(
                  platformTransactionColRef(activePlatformId),
                  where('caId', '==', expandedActiveCaCard),
                  where('isCashIn', '==', true),
                  where('isDeleted', '==', false),
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
