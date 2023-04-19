import { View, Text } from 'react-native';
import React from 'react';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import { P2 } from '@components/common/typography/text';
import FormsPopup from '@components/common/popup/FormPopUp';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  deleteDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { subAdminColRef, subAdminDocRef } from '@config/firebaseRefs';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import BackButton from '@components/common/buttons/cta/BackButton';
import { H6 } from '@components/common/typography/heading';

const EditSubadmin = () => {
  const [isFetchingSubadmin, setFetchingSubadmins] = useState(false);
  const [subadminsList, setSubadminsList] = useState([]);
  const fetchSubadmins = async () => {
    setFetchingSubadmins(true);
    setSubadminsList([]);
    const subadminDocRef = await getDocs(
      query(subAdminColRef, orderBy('username', 'asc'))
    );
    const fetchedSubadmins = [];
    subadminDocRef.forEach(doc => {
      fetchedSubadmins.push({ id: doc.id, username: doc.data().username });
    });
    setSubadminsList(fetchedSubadmins);
    setFetchingSubadmins(false);
  };
  useEffect(() => {
    fetchSubadmins();
  }, []);

  return (
    <>
      <DashBoardHeader />
      <DataDisplayContainer>
        <EditSubadmin.Header />
        {isFetchingSubadmin && subadminsList.length === 0 ? (
          <Text>⛏⛏⛏🔨🔨🔨🔐🔑 LOADING !!!!!!</Text>
        ) : (
          <FlashList
            keyboardShouldPersistTaps="handled"
            data={subadminsList}
            renderItem={({ item }) => {
              return (
                <EditSubadmin.Card {...item} fetchSubadmins={fetchSubadmins} />
              );
            }}
            estimatedItemSize={30}
          />
        )}
      </DataDisplayContainer>
    </>
  );
};

EditSubadmin.Header = () => {
  return (
    <View className="flex-row justify-between items-center my-2">
      <BackButton bgColor={'bg-primary-15'} />
      <View className="flex-row flex-1 justify-center">
        <H6>Edit Subadmin</H6>
      </View>
    </View>
  );
};

EditSubadmin.Card = props => {
  const [isDeleting, setDeleteStatus] = useState();
  const deleteBtnHandle = async () => {
    setDeleteStatus(true);
    const { fetchSubadmins, id, username } = props;
    await deleteDoc(subAdminDocRef(id));
    alert(`deleted subadmin ${username} successfully !!`);
    setDeleteStatus(false);
    fetchSubadmins();
  };

  return (
    <View className=" border-[0.5px] rounded-md border-primary my-3 py-4 px-3">
      <View className="flex-row justify-between items-center">
        <P2 color={'text-quaternary'}>{props?.username}</P2>
        <View className="w-[30%]">
          <NormalButton
            onClick={deleteBtnHandle}
            title={'Delete'}
            size={'small'}
            color={tertiaryColor}
            isLoading={isDeleting}
          />
        </View>
      </View>

      <View className="w-[100%] mt-4">
        <FormsPopup>
          <FormsPopup.CtaButton iconName={'key-outline'}>
            Set Password
          </FormsPopup.CtaButton>
          <FormsPopup.BottomsSheet>
            <FormsPopup.Header title={'Set new Password'} />
            <FormsPopup.FormsTextInputField
              placeholder={'new password'}
              label={`Enter new password of ${props?.username}`}
            />
            <FormsPopup.FormsSubmitButton
              submitClickHandle={async context => {
                const {
                  inputValue,
                  setErrorStatus,
                  setError,
                  resetFormsState,
                  setSubmitStatus,
                } = context;
                setError('');
                setErrorStatus(false);
                if (inputValue.length <= 2) {
                  setErrorStatus(true);
                  setError('* password must have atleast 3 charactes');
                  return;
                }
                setSubmitStatus(true);
                await updateDoc(subAdminDocRef(props.id), {
                  password: inputValue,
                });
                resetFormsState();
                alert('updated password successfully !!!');
              }}
            >
              Set
            </FormsPopup.FormsSubmitButton>
          </FormsPopup.BottomsSheet>
        </FormsPopup>
      </View>
    </View>
  );
};

export default EditSubadmin;
