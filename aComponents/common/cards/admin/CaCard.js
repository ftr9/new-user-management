import { View, Text, TouchableOpacity } from 'react-native';
import CardInfoHeader from '../CardInfoHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import { Avatar } from '@rneui/themed';
import { useState } from 'react';
import { router, useRouter } from 'expo-router';
import AreYouSure from '@components/common/popup/AreYouSure';
import useUserData from '@store/useUserData';
import useCaStore from '@store/useCaStore';
import FormsPopup from '@components/common/popup/FormPopUp';
import { addDoc, arrayUnion, increment, updateDoc } from 'firebase/firestore';
import { cashAppDocRef, platformColRef } from '@config/firebaseRefs';
import usePlatformsStore from '@store/usePlatformsStore';

const AdminCaCard = props => {
  const { expandedActiveCaCard, setActiveCaCard, unSetActiveCaCard } =
    useCaStore();
  return (
    <View className="rounded-md border-[0.5px] border-primary relative bg-secondary px-3 py-5 mt-2 mb-8">
      <AdminCaCard.Header {...props} />

      <AdminCaCard.ButtonsListContainer
        isButtonsVisible={props.id === expandedActiveCaCard}
      >
        <AdminCaCard.CreateNewBtn caId={expandedActiveCaCard} />
        <AdminCaCard.PlatformList {...props} />
        <AdminCaCard.DeleteBtn />
      </AdminCaCard.ButtonsListContainer>

      <AdminCaCard.ShowBtnToggle
        isButtonsVisible={props.id === expandedActiveCaCard}
        btnClickHandle={() => {
          if (props.id === expandedActiveCaCard) {
            unSetActiveCaCard();
          } else {
            setActiveCaCard(props.id);
          }
        }}
      />
    </View>
  );
};

AdminCaCard.Header = props => {
  const { fetchAdminCa } = useCaStore();
  const { user } = useUserData();
  const { name, totalBalance, totalGroups } = props;
  return (
    <CardInfoHeader
      documentId={props.id}
      title={name}
      amount={totalBalance}
      userOrGroupsCount={totalGroups}
      refetchData={fetchAdminCa(user.id)}
      currentPage={'dashboard'}
    />
  );
};

AdminCaCard.ButtonsListContainer = ({ children, isButtonsVisible }) => {
  return (
    <View
      className={`${
        isButtonsVisible ? 'h-[200px]' : 'h-[0px]'
      }  overflow-hidden`}
    >
      {children}
    </View>
  );
};

AdminCaCard.CreateNewBtn = ({ caId }) => {
  const { user } = useUserData();
  const { fetchAdminCa } = useCaStore();
  return (
    <View className="mb-3 mt-5">
      <FormsPopup>
        <FormsPopup.CtaButton iconName={'add'}>
          Create new Platform
        </FormsPopup.CtaButton>
        <FormsPopup.BottomsSheet>
          <FormsPopup.Header title={'Enter new Platform'} />
          <FormsPopup.FormsTextInputField
            label={'Enter new platform name'}
            placeholder={'platform name'}
          />
          <FormsPopup.FormsSubmitButton
            submitClickHandle={async context => {
              const {
                inputValue,
                setInputValue,
                setError,
                setErrorStatus,
                setPopupVisible,
                setSubmitStatus,
              } = context;

              ////1) check if value is there
              if (!inputValue) {
                setError('* Platform name cannot be left empty !!!!');
                setErrorStatus(true);
                return;
              }

              let newPlatformData = {
                balances: {},
                name: inputValue,
                totalSubadmins: 0,
              };
              newPlatformData.balances[caId] = { totalBalance: 0 };

              setSubmitStatus(true);
              ////2)add to the platforms collection
              const newPlatform = await addDoc(platformColRef, newPlatformData);

              ////3)update CA finally
              await updateDoc(cashAppDocRef(caId), {
                platforms: arrayUnion(newPlatform.id),
                totalGroups: increment(1),
              });

              setSubmitStatus(false);
              alert('Added new platform successfully..');

              ////4)reset everything
              setInputValue('');
              setError('');
              setErrorStatus(false);
              setPopupVisible(false);

              ////5) fetch everything
              fetchAdminCa(user.id)();
            }}
          >
            Create
          </FormsPopup.FormsSubmitButton>
        </FormsPopup.BottomsSheet>
      </FormsPopup>
    </View>
  );
};

AdminCaCard.PlatformList = props => {
  const { setPlatformsListIds } = usePlatformsStore();
  const router = useRouter();
  const btnClickHandle = () => {
    if (!(props.platforms.length >= 0)) {
      alert('there are not platforms in the given CA');
    }
    setPlatformsListIds(props.platforms);
    router.push('/pages/admin/platforms');
  };

  return (
    <View className="mb-3">
      <DottedIconButton
        onClick={btnClickHandle}
        title={'Platforms List'}
        iconType={{
          type: 'ionicon',
          name: 'grid-outline',
        }}
      />
    </View>
  );
};

AdminCaCard.DeleteBtn = () => {
  return (
    <AreYouSure>
      <AreYouSure.CtaBtn
        bgColor={'bg-tertiary-20'}
        borderColor={'border-tertiary'}
        iconName={'trash-outline'}
      >
        Delete this CA
      </AreYouSure.CtaBtn>
      <AreYouSure.BottomSheet
        title={'Are you sure want to deleted this ?'}
        onYesPress={() => {
          alert('hello world');
        }}
      ></AreYouSure.BottomSheet>
    </AreYouSure>
  );
};

AdminCaCard.ShowBtnToggle = ({ btnClickHandle, isButtonsVisible }) => {
  return (
    <Avatar
      size={50}
      containerStyle={{
        backgroundColor: 'red',
        position: 'absolute',
        bottom: -30,
        left: 0,
      }}
      rounded
      avatarStyle={{
        transform: [{ rotate: isButtonsVisible ? '180deg' : '0deg' }],
      }}
      icon={{ name: 'chevron-down-outline', type: 'ionicon' }}
      onPress={btnClickHandle}
    ></Avatar>
  );
};

export default AdminCaCard;
