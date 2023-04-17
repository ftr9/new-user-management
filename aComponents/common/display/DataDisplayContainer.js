import { View, Text } from 'react-native';

const DataDisplayContainer = ({ children }) => {
  return (
    <View className="flex-1 rounded-tl-2xl px-3 pt-1 rounded-tr-2xl bg-secondary">
      {children}
    </View>
  );
};

export default DataDisplayContainer;
