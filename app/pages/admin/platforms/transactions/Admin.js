import { View, Text } from 'react-native';
import CashInCard from '@components/common/cards/CashInCard';
import CashOutCard from '@components/common/cards/CashOutCard';

const Admin = () => {
  return (
    <View>
      <CashOutCard isAdmin />
      <CashOutCard isAdmin />
      <CashInCard isAdmin />
      <CashInCard isAdmin />
      <CashOutCard isAdmin />
      <CashInCard isAdmin />
      <CashInCard isAdmin />
      <CashOutCard isAdmin />
      <CashOutCard isAdmin />
    </View>
  );
};

export default Admin;
