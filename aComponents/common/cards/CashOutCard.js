import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import moment from 'moment/moment';
import { tertiaryColor } from '@constants/color';

const CashOutCard = props => {
  const isAdmin = props.isAdmin;
  const BtnClickHandle = () => {
    alert('cool');
  };

  return (
    <TouchableOpacity
      onPress={BtnClickHandle}
      className={`flex-row ${
        isAdmin ? 'bg-tertiary-40' : 'bg-tertiary-15'
      }  justify-between items-center  mb-3 rounded-md px-3 py-2`}
    >
      <View className="flex-row items-center">
        <View className="p-2 border-dashed border-tertiary bg-secondary  border-[0.6px]">
          <Icon
            type="ionicon"
            name="arrow-up"
            size={18}
            color={tertiaryColor}
          />
        </View>
        <View className="ml-3 w-[70%]">
          <Text className=" font-Lato-Regular text-[16px] font-semibold mb-[3px]">
            {props?.userName}
          </Text>
          <Text className=" font-Lato-Regular text-[10px]">
            {moment(Date.now()).format('LL')} .{' '}
            {moment(Date.now()).format('LT')}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className=" font-Lato-Regular text-tertiary text-[16px] font-[600]">
          + $15
        </Text>
        <Text className="text-[#5B5B5B] text-[10px] font-Lato-Regular mt-[3px]">
          + $1500
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CashOutCard;
