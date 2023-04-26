import { Text, RefreshControl, View } from 'react-native';
import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import { useEffect, useState } from 'react';
import useTransactionStore from '@store/useTransactionStore';
import { FlashList } from '@shopify/flash-list';
import { limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { platformTransactionColRef } from '@config/firebaseRefs';
import LoadingIndication from '@components/common/Loading';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import { transactionLimit } from '@constants/transactionSize';
import LoadMoreContainer from '@components/common/display/LoadMoreContainer';

const CashInAndOut = () => {
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    isFetchingTransaction,
    transactionList,
    lastVisibleTransaction,
    loadMoreTransaction,
    isPaginatingTransactions,
  } = useTransactionStore();

  //console.log(lastVisibleTransaction);
  const inAndOutQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('isDeleted', '==', false),
    where('caId', '==', expandedActiveCaCard),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
  );

  useEffect(() => {
    fetchTransaction(inAndOutQueryCondition, 'CASHIN&OUT');
  }, []);

  if (isFetchingTransaction && transactionList.length === 0) {
    return <LoadingIndication title={'Loading Transaction !!!'} />;
  }

  if (transactionList.length === 0) {
    return <Text>No Transactions !!!!</Text>;
  }

  return (
    <>
      <FlashList
        refreshing={isFetchingTransaction}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              fetchTransaction(inAndOutQueryCondition, 'CASHIN&OUT');
            }}
          />
        }
        estimatedItemSize={50}
        data={transactionList}
        renderItem={({ item }) => {
          if (item.isCashIn) {
            return <CashInCard {...item} />;
          }
          return <CashOutCard {...item} />;
        }}
        ListFooterComponentStyle={{
          marginBottom: 10,
        }}
        ListFooterComponent={
          lastVisibleTransaction && (
            <LoadMoreContainer>
              <NormalButton
                onClick={() => {
                  const inAndOutPaginateCondition = query(
                    platformTransactionColRef(activePlatformId),
                    where('isDeleted', '==', false),
                    where('caId', '==', expandedActiveCaCard),
                    orderBy('createdAt', 'desc'),
                    startAfter(lastVisibleTransaction),
                    limit(transactionLimit)
                  );
                  loadMoreTransaction(inAndOutPaginateCondition, 'CASHIN&OUT');
                }}
                isLoading={isPaginatingTransactions}
                title={'Load More'}
                color={tertiaryColor}
                size={'small'}
              />
            </LoadMoreContainer>
          )
        }
      />
    </>
  );
};

export default CashInAndOut;
