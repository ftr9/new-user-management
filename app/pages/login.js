import { View, Text, StyleSheet, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { P4 } from '@components/common/typography/text';
import { H6 } from '@components/common/typography/heading';
import { Switch } from '@rneui/themed';
import InputField from '@components/common/Input';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { useRouter } from 'expo-router';
import ExitApp from '@utils/ExitApp';

const Login = () => {
  const router = useRouter();
  const [isLoggingIn, setIsLogging] = useState(false);
  const [isAdminLogin, setAdminLogin] = useState(false);
  const [inputValue, setInputValue] = useState({
    username: '',
    password: '',
  });
  const [inputFieldErr, setInputFieldErr] = useState({
    isUsernameError: false,
    isPasswordError: false,
  });
  const inputFieldErrorMsg = {
    username: '*the username is not registered sorry !',
    password: '*incorrect password please try again',
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', ExitApp);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', ExitApp);
    };
  }, []);

  const loginBtnClickHandle = async () => {
    if (isAdminLogin) {
      router.push('/pages/admin');
    } else {
      router.push('/pages/subadmin');
    }
    //
    setInputFieldErr({ isPasswordError: false, isUsernameError: false });
    if (!inputValue.username || !inputValue.password) {
      return;
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
