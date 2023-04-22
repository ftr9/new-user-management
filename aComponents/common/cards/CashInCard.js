import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import moment from 'moment/moment';
import { useRouter } from 'expo-router';
import useUserData from '@store/useUserData';

const CashInCard = props => {
  const { user } = useUserData();
  const isAdmin = props.isAdmin;
  const isDeleted = props?.isDeleted;
  const router = useRouter();

  const BtnClickHandle = () => {
    if (user.isAdmin) {
      router.push(`/pages/admin/platforms/DeleteTransaction/${props.id}`);
    } else {
      router.push(`/pages/subadmin/deletetransaction/${props.id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={BtnClickHandle}
      className={`w-[100%] flex-row ${
        isAdmin ? 'bg-primary-40' : 'bg-primary-15'
      }  mb-3 rounded-md px-2 py-2 justify-between `}
    >
      <View className="flex-row flex-1  items-center">
        <View className="p-2  h-[40px] w-[40px] border-dashed border-primary bg-secondary  border-[0.6px]">
          <Icon
            type="ionicon"
            name={isDeleted ? 'trash-outline' : 'arrow-down'}
            size={18}
            color={'#228B22'}
          />
        </View>
        <View className="ml-3 w-[90%]">
          <Text
            className={`${
              isDeleted && 'line-through'
            } font-Lato-Regular text-[14px] font-semibold mb-[3px]`}
          >
            {props?.userName}
          </Text>
          <Text
            className={`${
              isDeleted && 'line-through'
            } font-Lato-Regular text-[10px]`}
          >
            {moment(props?.createdAt).format('LL')} .{' '}
            {moment(props?.createdAt).format('LT')}
          </Text>
        </View>
      </View>
      <View className={`w-[90px]  items-end justify-center`}>
        <Text
          className={`${
            isDeleted && 'line-through'
          } font-Lato-Regular text-primary text-[14px] font-[600]`}
        >
          {`+ $${props.amount}`}
        </Text>
        <Text
          className={`text-[#5B5B5B] ${
            isDeleted && 'line-through'
          } text-[10px] font-Lato-Regular mt-[3px]`}
        >
          {props?.closingAmount?.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CashInCard;
