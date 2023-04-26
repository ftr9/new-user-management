import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserData from '@store/useUserData';
import { Alert, BackHandler, View } from 'react-native';
import LoadingIndication from '@components/common/Loading';
import { doc, getDoc } from 'firebase/firestore';
import { appVersionDocRef } from '@config/firebaseRefs';
import useAppVersionStore from '@store/useAppVersionStore';
import * as Linking from 'expo-linking';

const RootPage = () => {
  const router = useRouter();
  const { setUser } = useUserData();
  const { setVersion } = useAppVersionStore();
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

    const checkVersion = async () => {
      const docVersion = await getDoc(appVersionDocRef());
      const storedAppVersion = await AsyncStorage.getItem('@appversion');
      if (!storedAppVersion) {
        const version = await AsyncStorage.setItem(
          '@appversion',
          docVersion.data().version
        );
        setVersion(version);
      } else {
        if (storedAppVersion !== docVersion.data().version) {
          Alert.alert('App Update !!!', 'A new version of app is available.', [
            {
              text: 'update',
              onPress: async () => {
                await Linking.openURL(docVersion.data().downloadLink);
                BackHandler.exitApp();
              },
            },
          ]);
        }
      }
      setVersion(docVersion.data().version);
    };

    /////function call
    (async () => {
      //await checkVersion();
      fetchUserFromAsyncStorage();
    })();
  }, []);

  return (
    <View className="flex-1 justify-center bg-secondary items-center">
      <LoadingIndication title={'Getting things ready !!!'} />
    </View>
  );
};

export default RootPage;
