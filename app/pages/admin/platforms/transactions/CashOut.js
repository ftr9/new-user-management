import { RefreshControl } from 'react-native';
import CashOutCard from '@components/common/cards/CashOutCard';
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
import { transactionLimit } from '@constants/transactionSize';

const CashOut = () => {
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    transactionCashOutList,
    isFetchingTransaction,
    lastVisibleTransaction,
    isPaginatingTransactions,
    loadMoreTransaction,
  } = useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  const OutQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isCashIn', '==', false),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
  );
  useEffect(() => {
    fetchTransaction(OutQueryCondition, 'CASHOUT');
  }, []);

  if (isFetchingTransaction && transactionCashOutList.length === 0) {
    return <LoadingIndication title={'Loading Transaction !!!'} />;
  }

  return (
    <FlashList
      refreshing={isFetchingTransaction}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            fetchTransaction(OutQueryCondition, 'CASHOUT');
          }}
        />
      }
      data={transactionCashOutList}
      renderItem={({ item }) => {
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
              size={'small'}
              isLoading={isPaginatingTransactions}
              title={'Load More'}
              onClick={() => {
                const OutQueryPaginate = query(
                  platformTransactionColRef(activePlatformId),
                  where('caId', '==', expandedActiveCaCard),
                  where('isCashIn', '==', false),
                  orderBy('createdAt', 'desc'),
                  startAfter(lastVisibleTransaction),
                  limit(transactionLimit)
                );
                loadMoreTransaction(OutQueryPaginate, 'CASHOUT');
              }}
            />
          </LoadMoreContainer>
        )
      }
    />
  );
};

export default CashOut;
