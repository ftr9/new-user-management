import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';
import usePlatformsStore from '@store/usePlatformsStore';
import useTransactionStore from '@store/useTransactionStore';
import useCaStore from '@store/useCaStore';
import { useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import LoadingIndication from '@components/common/Loading';
import { query, where, orderBy } from 'firebase/firestore';
import { platformTransactionColRef } from '@config/firebaseRefs';
import { RefreshControl } from 'react-native';

const CashInAndOut = () => {
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, transactionList, isFetchingTransaction } =
    useTransactionStore();
  const { expandedActiveCaCard } = useCaStore();

  const inAndOutQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    orderBy('createdAt', 'desc')
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
      estimatedItemSize={50}
    />
  );
};

export default CashInAndOut;
