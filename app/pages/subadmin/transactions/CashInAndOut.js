import { View, Text, FlatList } from 'react-native';
import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import { useEffect } from 'react';
import useTransactionStore from '@store/useTransactionStore';
import { FlashList } from '@shopify/flash-list';

const CashInAndOut = () => {
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId } = usePlatformsStore();
  const { fetchTransaction, isFetchingTransaction, transactionList } =
    useTransactionStore();

  useEffect(() => {
    fetchTransaction(activePlatformId, expandedActiveCaCard);
  }, []);

  if (isFetchingTransaction && transactionList.length === 0) {
    return <Text>⚽💎⚽💎⚽💎</Text>;
  }

  if (transactionList.length === 0) {
    return <Text>No Transactions !!!!</Text>;
  }

  return (
    <FlashList
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
