import { TouchableOpacity } from 'react-native';

import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';

const BackButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        router.back();
      }}
      className={
        ' flex justify-center items-center h-14 w-14 rounded-tl-[40px] rounded-tr-2xl rounded-bl-2xl rounded-br-2xl  bg-secondary'
      }
    >
      <Icon type="ionicon" name="arrow-back" size={25} />
    </TouchableOpacity>
  );
};

export default BackButton;
