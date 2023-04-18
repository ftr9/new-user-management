import { View, Text } from 'react-native';
import NormalButton from '../buttons/cta/NormalButton';
import { H4 } from '../typography/heading';
import useUserData from '@store/useUserData';

const DashBoardHeader = () => {
  ////get user data from global store..
  const { user } = useUserData();
  const logoutBtnClickHandle = async () => {
    console.log(user);
  };
  return (
    <View className="flex-row justify-between items-center px-2 py-3 flex-wrap">
      {/**Header */}
      <View className={'flex-row'}>
        <View className=" h-2 w-2 bg-red-500 rounded-full"></View>
        <H4 color={'text-secondary'}>Admin</H4>
      </View>
      <View className="w-[120px]">
        <NormalButton
          title={'Log out'}
          size={'small'}
          color={'#E03131'}
          onClick={logoutBtnClickHandle}
        />
      </View>
    </View>
  );
};

export default DashBoardHeader;
