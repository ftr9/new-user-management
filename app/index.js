import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserData from '@store/useUserData';
import { View } from 'react-native';
import LoadingIndication from '@components/common/Loading';

const RootPage = () => {
  const router = useRouter();
  const { setUser } = useUserData();
  useEffect(() => {
    const fetchUserFromAsyncStorage = async () => {
      const user = await AsyncStorage.getItem('@user');

      if (!user) {
        router.push('/pages/login');
        return;
      }
      ////1)set to global store
      const alreadyLoggedUser = JSON.parse(user);
      setUser(alreadyLoggedUser);
      ////2) navigate to respective route
      if (alreadyLoggedUser.isAdmin) {
        router.push('/pages/admin');
      } else {
        router.push('/pages/subadmin');
      }
    };
    fetchUserFromAsyncStorage();
  }, []);

  return (
    <View className="flex-1 justify-center bg-secondary items-center">
      <LoadingIndication title={'Getting things ready !!!'} />
    </View>
  );
};

export default RootPage;
