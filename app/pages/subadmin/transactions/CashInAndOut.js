import { Text, RefreshControl } from 'react-native';
import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import { useEffect } from 'react';
import useTransactionStore from '@store/useTransactionStore';
import { FlashList } from '@shopify/flash-list';
import { orderBy, query, where } from 'firebase/firestore';
import { platformTransactionColRef } from '@config/firebaseRefs';
import LoadingIndication from '@components/common/Loading';

const CashInAndOut = () => {
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, isFetchingTransaction, transactionList } =
    useTransactionStore();

  const inAndOutQueryCondition = query(
    platformTransactionColRef(activePlatformId),
    where('caId', '==', expandedActiveCaCard),
    orderBy('createdAt', 'desc')
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
    />
  );
};

export default CashInAndOut;
