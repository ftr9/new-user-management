import { View, Text, ActivityIndicator } from 'react-native';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import { P2 } from '@components/common/typography/text';
import FormsPopup from '@components/common/popup/FormPopUp';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { useEffect } from 'react';
import { deleteDoc, updateDoc } from 'firebase/firestore';
import { subAdminColRef, subAdminDocRef } from '@config/firebaseRefs';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { primaryColor, tertiaryColor } from '@constants/color';
import BackButton from '@components/common/buttons/cta/BackButton';
import { H6 } from '@components/common/typography/heading';
import useSubadminsStore from '@store/subadmin/useSubadminsStore';
import AreYouSure from '@components/common/popup/AreYouSure';
import LoadingIndication from '@components/common/Loading';

const EditSubadmin = () => {
  const { isFetchingSubadminsData, subadminsList, fetchAllSubadmins } =
    useSubadminsStore();

  useEffect(() => {
    fetchAllSubadmins();
  }, []);

  return (
    <>
      <DashBoardHeader />
      <DataDisplayContainer>
        <EditSubadmin.Header />
        {isFetchingSubadminsData && subadminsList.length === 0 ? (
          <LoadingIndication title={'Loading Subadmins List !!!'} />
        ) : (
          <FlashList
            keyboardShouldPersistTaps="handled"
            data={subadminsList}
            renderItem={({ item }) => {
              return (
                <EditSubadmin.Card
                  {...item}
                  fetchSubadmins={fetchAllSubadmins}
                />
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
  const deleteBtnHandle = async ctx => {
    const { setSubmitStatus } = ctx;
    const { fetchSubadmins, id, username } = props;
    setSubmitStatus(true);
    await deleteDoc(subAdminDocRef(id));
    alert(`deleted subadmin ${username} successfully.`);
    setSubmitStatus(false);
    fetchSubadmins();
  };

  return (
    <View className=" border-[0.5px] rounded-md border-primary my-3 py-4 px-3">
      <View className="flex-row justify-between items-center">
        <P2 color={'text-quaternary'}>{props?.username}</P2>
        <View className="w-[30%]">
          <AreYouSure>
            <AreYouSure.CtaNormalBtn title={'Delete'} />
            <AreYouSure.BottomSheet
              title={`Are you sure want to delete ${props?.username} ?`}
              onYesPress={deleteBtnHandle}
            ></AreYouSure.BottomSheet>
          </AreYouSure>
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
