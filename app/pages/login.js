import { View, Text, StyleSheet, BackHandler } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { P4 } from '@components/common/typography/text';
import { H6 } from '@components/common/typography/heading';
import { Switch } from '@rneui/themed';
import InputField from '@components/common/Input';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { useRouter } from 'expo-router';
import ExitApp from '@utils/ExitApp';
import { query, where, getDocs, limit } from 'firebase/firestore';
import { adminColRef, subAdminColRef } from '@config/firebaseRefs';
import useUserData from '@store/useUserData';

const Login = () => {
  const router = useRouter();
  const { setUser } = useUserData();
  const [isLoggingIn, setIsLogging] = useState(false);
  const [isAdminLogin, setAdminLogin] = useState(false);
  const [inputValue, setInputValue] = useState({
    username: 'admin',
    password: 'key@1918',
  });
  const [inputFieldErr, setInputFieldErr] = useState({
    isUsernameError: false,
    isPasswordError: false,
  });
  const [inputFieldErrorMsg, setInputFieldErrMsg] = useState({
    username: '',
    password: '',
  });

  ////Exit app Effect
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', ExitApp);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', ExitApp);
    };
  }, []);

  const loginBtnClickHandle = async () => {
    //
    setInputFieldErr({ isPasswordError: false, isUsernameError: false });
    ////1) check if username and password is empty
    if (!inputValue.username) {
      setInputFieldErr({ isUsernameError: true });
      setInputFieldErrMsg({
        username: '* please enter username',
      });
      return;
    }
    if (!inputValue.password) {
      setInputFieldErr({ isPasswordError: true });
      setInputFieldErrMsg({
        password: '* please enter password',
      });
      return;
    }

    console.log(inputValue.username, inputValue.password);

    /////2) fetch admin or subadmin
    setIsLogging(true);
    let userDocSnapShot;
    const queryCondition = where('username', '==', inputValue.username);
    if (isAdminLogin) {
      userDocSnapShot = await getDocs(
        query(adminColRef, queryCondition, limit(1))
      );
    } else {
      userDocSnapShot = await getDocs(
        query(subAdminColRef, queryCondition, limit(1))
      );
    }

    ////3) check if admin or subadmin exists
    if (userDocSnapShot.empty) {
      setInputFieldErr(err => ({ ...err, isUsernameError: true }));
      setInputFieldErrMsg(err => ({
        ...err,
        username: '* username is not registered',
      }));
      setIsLogging(false);
      return;
    }

    ////5) extract user data
    let user;
    userDocSnapShot.forEach(userData => {
      user = {
        id: userData.id,
        data: userData.data(),
        isAdmin: isAdminLogin ? true : false,
      };
    });

    ////6) check for password
    if (inputValue.password !== user.data.password) {
      setInputFieldErr(state => ({ ...state, isPasswordError: true }));
      setInputFieldErrMsg(state => ({
        password: '* incorrect password try again !!',
      }));
      setIsLogging(false);
      return;
    }

    ////7) update global store
    setUser(user);
    setIsLogging(false);

    ////8) route them to respective dashboard
    if (isAdminLogin) {
      router.push('/pages/admin');
    } else {
      router.push('/pages/subadmin');
    }

    //update login store and redirect to dashboard
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-[95%]  rounded-xl  bg-secondary">
        {/**Header part */}
        <View className="flex-row px-3 mb-4 justify-between items-center">
          <H6 color={'text-quaternary'}>USER MANAGEMENT</H6>
          <View>
            <Switch
              value={isAdminLogin}
              onValueChange={value => setAdminLogin(value)}
              thumbColor={isAdminLogin ? '#E03131' : '#228B22'}
            />
            <P4 color={'text-tertiary'}>
              {isAdminLogin ? '*admin' : '*subadmin'}
            </P4>
          </View>
        </View>
        {/**Input part */}
        <View>
          <InputField
            label={'Enter username'}
            placeholder={'your registered username'}
            errorMessage={inputFieldErrorMsg.username}
            hasError={inputFieldErr.isUsernameError}
            canBeFocused
            onChangeText={val => {
              setInputValue(state => ({ ...state, username: val }));
            }}
            value={inputValue.username}
          />
          <InputField
            label={'Enter password'}
            placeholder={'your resigtered password'}
            errorMessage={inputFieldErrorMsg.password}
            hasError={inputFieldErr.isPasswordError}
            onChangeText={val => {
              setInputValue(state => ({ ...state, password: val }));
            }}
            value={inputValue.password}
            secureTextEntry={true}
          />
        </View>
        <View className="mt-3 mb-5 px-3">
          <NormalButton
            onClick={loginBtnClickHandle}
            title={isAdminLogin ? 'Admin Login' : 'Sub-admin Login'}
            isLoading={isLoggingIn}
          />
        </View>

        {!isAdminLogin && (
          <View className="mb-5">
            <P4 color={'text-tertiary'}>
              *kindly contact your admin if you forgot your password
            </P4>
          </View>
        )}
      </View>
    </View>
  );
};
export default Login;
