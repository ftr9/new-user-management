import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';
import usePlatformsStore from '@store/usePlatformsStore';
import useTransactionStore from '@store/useTransactionStore';
import useCaStore from '@store/useCaStore';
import { useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import LoadingIndication from '@components/common/Loading';
import { query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { platformTransactionColRef } from '@config/firebaseRefs';
import { RefreshControl } from 'react-native';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import { transactionLimit } from '@constants/transactionSize';
import LoadMoreContainer from '@components/common/display/LoadMoreContainer';

const CashInAndOut = () => {
  const { activePlatformId } = usePlatformsStore();
  const {
    fetchTransaction,
    transactionList,
    isFetchingTransaction,
    lastVisibleTransaction,
    isPaginatingTransactions,
    loadMoreTransaction,
  } = useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  const inAndOutQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    orderBy('createdAt', 'desc'),
    limit(transactionLimit)
  );

  useEffect(() => {
    fetchTransaction(inAndOutQueryCondition, 'CASHIN&OUT');
  }, []);

  if (transactionList.length === 0 && isFetchingTransaction) {
    return <LoadingIndication title={'Loading Transactions !!!'} />;
  }

  return (
    <FlashList
      refreshing={isFetchingTransaction}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            fetchTransaction(inAndOutQueryCondition, 'CASHIN&OUT');
          }}
        />
      }
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
              title={'Load More'}
              color={tertiaryColor}
              size={'small'}
              isLoading={isPaginatingTransactions}
              onClick={() => {
                const inAndOutQueryPaginate = query(
                  platformTransactionColRef(activePlatformId),
                  where('caId', '==', expandedActiveCaCard),
                  orderBy('createdAt', 'desc'),
                  startAfter(lastVisibleTransaction),
                  limit(transactionLimit)
                );
                loadMoreTransaction(inAndOutQueryPaginate, 'CASHIN&OUT');
              }}
            />
          </LoadMoreContainer>
        )
      }
      estimatedItemSize={50}
    />
  );
};

export default CashInAndOut;
