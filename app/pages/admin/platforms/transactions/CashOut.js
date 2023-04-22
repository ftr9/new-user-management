import { RefreshControl } from 'react-native';
import CashOutCard from '@components/common/cards/CashOutCard';
import usePlatformsStore from '@store/usePlatformsStore';
import useCaStore from '@store/useCaStore';
import useTransactionStore from '@store/useTransactionStore';
import { useEffect } from 'react';
import LoadingIndication from '@components/common/Loading';
import { orderBy, query, where } from 'firebase/firestore';
import { platformTransactionColRef } from '@config/firebaseRefs';
import { FlashList } from '@shopify/flash-list';

const CashOut = () => {
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, transactionCashOutList, isFetchingTransaction } =
    useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  const inQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    where('isCashIn', '==', false),
    orderBy('createdAt', 'desc')
  );
  useEffect(() => {
    fetchTransaction(inQueryCondition, 'CASHOUT');
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
            fetchTransaction(inQueryCondition, 'CASHOUT');
          }}
        />
      }
      data={transactionCashOutList}
      renderItem={({ item }) => {
        return <CashOutCard {...item} />;
      }}
      estimatedItemSize={50}
    />
  );
};

export default CashOut;
