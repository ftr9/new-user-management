import { View, ScrollView } from 'react-native';
import BackButton from '@components/common/buttons/cta/BackButton';
import { H6, H8 } from '@components/common/typography/heading';
import { addDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { subAdminColRef } from '@config/firebaseRefs';

import InputField from '@components/common/Input';
import { secondaryColor } from '@constants/color';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const AddSubadmin = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitStatus] = useState(false);
  const [inputValue, setInputValue] = useState({
    username: '',
    password: '',
  });
  const [Err, setErr] = useState({
    usernameErr: '',
    passwordErr: '',
  });

  const [ErrStatus, setErrStatus] = useState({
    hasUsernameErr: false,
    hasPasswordErro: false,
  });

  const resetState = () => {
    setSubmitStatus(false);
    setErr({ usernameErr: '', passwordErr: '' });
    setErrStatus({ hasUsernameErr: false, hasPasswordErro: false });
  };

  const submitBtnClickHandle = async () => {
    resetState();
    /////1) check if username or password is empty
    if (!inputValue.username) {
      setErrStatus(state => ({ ...state, hasUsernameErr: true }));
      setErr(state => ({ ...state, usernameErr: '* please Enter username' }));
      return;
    }
    if (!inputValue.password) {
      setErrStatus(state => ({ ...state, hasPasswordErro: true }));
      setErr(state => ({ ...state, passwordErr: '* please Enter password' }));
      return;
    }

    setSubmitStatus(true);
    ////2) check if username is already in the database
    const fetchedSubadmin = await getDocs(
      query(
        subAdminColRef,
        where('username', '==', inputValue.username),
        limit(1)
      )
    );

    if (!fetchedSubadmin.empty) {
      setErrStatus(state => ({ ...state, hasUsernameErr: true }));
      setErr(state => ({
        ...state,
        usernameErr: '* username already exists !!! try another',
      }));
      setSubmitStatus(false);
      return;
    }

    ////3) if not then create subadmin
    await addDoc(subAdminColRef, {
      balances: {},
      username: inputValue.username.trim(),
      password: inputValue.password,
    });
    alert(`created subadmin ${inputValue.username} successfully`);
    resetState();
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
        backgroundColor: secondaryColor,
        marginTop: 10,
      }}
      keyboardShouldPersistTaps={'handled'}
    >
      <View className="flex-row py-3   border-primary items-center">
        <BackButton bgColor={'bg-primary-20'} />
        <View className="flex-row flex-1 justify-center">
          <H6>Create Subadmin</H6>
        </View>
      </View>
      <View className=" flex-1 justify-center rounded-xl">
        <InputField
          label={'Enter subadmin username'}
          placeholder={'subadmin username'}
          canBeFocused
          onChangeText={val => {
            setInputValue(state => ({ ...state, username: val }));
          }}
          value={inputValue.username}
          hasError={ErrStatus.hasUsernameErr}
          errorMessage={Err.usernameErr}
          maxLength={15}
        />
        <InputField
          label={'Enter subadmin password'}
          placeholder={'subadmin password'}
          onChangeText={val => {
            setInputValue(state => ({ ...state, password: val }));
          }}
          value={inputValue.password}
          hasError={ErrStatus.hasPasswordErro}
          errorMessage={Err.passwordErr}
          maxLength={15}
        />
        <View className="px-2 mt-5">
          <NormalButton
            onClick={submitBtnClickHandle}
            isLoading={isSubmitting}
            title={'Create Subadmin'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AddSubadmin;
