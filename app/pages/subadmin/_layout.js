import { Slot, useRouter } from 'expo-router';

import useUserData from '@store/useUserData';
import { useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { subAdminDocRef } from '@config/firebaseRefs';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubadminRootLayout = () => {
  const { user, unSetUser } = useUserData();
  const router = useRouter();

  const logout = async () => {
    router.replace('/pages/login');
    await AsyncStorage.removeItem('@user');
    unSetUser();
  };

  ////Detect for password change by ADMIN - LOGOUT immediately
  useEffect(() => {
    const unSubToChanges = onSnapshot(
      subAdminDocRef(user.id),
      changeSnapShot => {
        if (!changeSnapShot.exists()) {
          alert('Your account has been deleted.');
          logout();
          return;
        }

        //console.log(changeSnapShot.data(), user.password);
        if (changeSnapShot.data().password !== user.data.password) {
          alert('Your password has been changed.');
          logout();
          return;
        }

        /*Alert.alert(
          'Admin Change',
          'Either your password has been changed or you have been removed from platform',
          [
            {
              text: 'ok',
              onPress: async () => {
                ////1) remove from the storage
                await AsyncStorage.removeItem('@user');
                ////2) Unset from global user store
                unSetUser();
                ////3) go Back TO LOgIn page
                router.replace('/pages/login');
              },
            },
          ]
        );*/
      }
    );

    return () => {
      ////unsubscribe
      unSubToChanges();
    };
  }, []);

  return (
    <>
      <Slot />
    </>
  );
};

export default SubadminRootLayout;
