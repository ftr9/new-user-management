import { View, Text } from 'react-native';
import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';

const CashInAndOut = () => {
  return (
    <View>
      <CashInCard isAdmin />
      <CashOutCard />
    </View>
  );
};

export default CashInAndOut;
