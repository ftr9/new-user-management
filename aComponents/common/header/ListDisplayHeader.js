import { View, Text } from 'react-native';
import { P5 } from '../typography/text';
import { H6 } from '../typography/heading';

const ListDisplayHeader = ({ children }) => {
  return (
    <View className="py-2 flex-row justify-between items-center">
      {children}
    </View>
  );
};
ListDisplayHeader.LeftContent = ({ title }) => {
  return (
    <View>
      <H6>{title}</H6>
      <P5 color={'text-primary'}>Pull down to refresh</P5>
    </View>
  );
};

ListDisplayHeader.RightContent = ({ children }) => {
  return <>{children}</>;
};

export default ListDisplayHeader;
