import {
  View,
  FlatList,
  Text,
  RefreshControl,
  BackHandler,
} from 'react-native';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import FormsPopup from '@components/common/popup/FormPopUp';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import { primaryColor, secondaryColor } from '@constants/color';
import { useState } from 'react';
import AdminCaCard from '@components/common/cards/admin/CaCard';
import { useRouter } from 'expo-router';
import useCaStore from '@store/useCaStore';
import { useEffect } from 'react';
import useUserData from '@store/useUserData';
import { cashAppColRef } from '@config/firebaseRefs';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import LoadingIndication from '@components/common/Loading';

const ExitAppFunc = () => {
  BackHandler.exitApp();
};

const AdminDashBoard = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', ExitAppFunc);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', ExitAppFunc);
    };
  }, []);

  return (
    <>
      <DashBoardHeader />
      <DataDisplayContainer>
        <View className="py-2">
          <AdminDashBoard.CreateNewCA />
        </View>

        <View className="flex-row justify-between">
          <View className="w-[52%]">
            <AdminDashBoard.CreateSubadmin />
          </View>
          <View className="w-[46%]">
            <AdminDashBoard.EditSubadmin />
          </View>
        </View>

        <ListDisplayHeader>
          <ListDisplayHeader.LeftContent title={"Your CA's"} />
        </ListDisplayHeader>
        <AdminDashBoard.DataDisplay />
      </DataDisplayContainer>
    </>
  );
};

AdminDashBoard.DataDisplay = () => {
  const { fetchAdminCa, isFetchingCa, caList } = useCaStore();
  const { user } = useUserData();
  useEffect(() => {
    ////fetch CashApps
    fetchAdminCa(user.id)();
  }, []);

  if (isFetchingCa && caList.length === 0) {
    return <LoadingIndication title={'Fetching CA list !!!'} />;
  }

  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            progressBackgroundColor={primaryColor}
            colors={[secondaryColor]}
            refreshing={isFetchingCa}
            onRefresh={() => {
              ////fetch cashApps
              fetchAdminCa(user.id)();
            }}
          />
        }
        data={caList}
        renderItem={({ item }) => {
          return <AdminCaCard {...item} />;
        }}
        indicatorStyle={'black'}
        keyExtractor={(item, index) => index}
      />
    </>
  );
};

AdminDashBoard.CreateNewCA = () => {
  const { user } = useUserData();
  const { fetchAdminCa } = useCaStore();
  return (
    <FormsPopup>
      <FormsPopup.CtaButton>Create New CA</FormsPopup.CtaButton>
      <FormsPopup.BottomsSheet>
        <FormsPopup.Header title={'Create New CA'} />
        <FormsPopup.FormsTextInputField
          placeholder={'CA name'}
          label={'Enter the CA Name'}
        ></FormsPopup.FormsTextInputField>
        <FormsPopup.FormsSubmitButton
          submitClickHandle={async context => {
            const {
              inputValue,
              setInputValue,
              setError,
              setErrorStatus,
              setSubmitStatus,
              setPopupVisible,
            } = context;
            ////1) check for valid length
            if (inputValue.length <= 2) {
              setErrorStatus(true);
              setError('* Ca Group name must have atleast 3 characters');
              return;
            }
            setSubmitStatus(true);
            ////2) insert in to the database
            let cashAppData = {
              adminId: user.id,
              createdAt: serverTimestamp(),
              name: inputValue,
              platforms: [],
              totalBalance: 0,
              totalGroups: 0,
            };

            await addDoc(cashAppColRef, cashAppData);

            ////3. Reset every thing...
            alert(`Created CA ( ${inputValue} ) successfully.`);
            setSubmitStatus(false);
            setPopupVisible(false);
            setErrorStatus(true);
            setError('');
            setInputValue('');

            ////4. Fetch Admin Ca Again
            fetchAdminCa(user.id)();
          }}
        >
          Create
        </FormsPopup.FormsSubmitButton>
      </FormsPopup.BottomsSheet>
    </FormsPopup>
  );
};

AdminDashBoard.CreateSubadmin = () => {
  const router = useRouter();

  return (
    <DottedIconButton
      onClick={() => {
        router.push('/pages/admin/CreateSubadmin');
      }}
      title={'Create Subadmin'}
      iconType={{
        name: 'person-add-outline',
        type: 'ionicon',
      }}
    ></DottedIconButton>
  );
};

AdminDashBoard.EditSubadmin = () => {
  const router = useRouter();
  return (
    <DottedIconButton
      onClick={() => {
        router.push('/pages/admin/EditSubadmin');
      }}
      title={'Edit Subadmin'}
      iconType={{ name: 'pencil', type: 'font-awesome' }}
    />
  );
};

export default AdminDashBoard;
