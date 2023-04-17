import { View, Text, TouchableOpacity } from 'react-native';
import CardInfoHeader from '../CardInfoHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import { Avatar } from '@rneui/themed';
import { useState } from 'react';
import { router, useRouter } from 'expo-router';
import AreYouSure from '@components/common/popup/AreYouSure';

const AdminCaCard = () => {
  const [isButtonsVisible, setBtnVisible] = useState(false);
  return (
    <View className="rounded-md border-[0.5px] border-primary relative bg-secondary px-3 py-5 mt-2 mb-8">
      <AdminCaCard.Header />

      <AdminCaCard.ButtonsListContainer isButtonsVisible={isButtonsVisible}>
        <AdminCaCard.CreateNewBtn />
        <AdminCaCard.PlatformList />
        <AdminCaCard.DeleteBtn />
      </AdminCaCard.ButtonsListContainer>

      <AdminCaCard.ShowBtnToggle
        isButtonsVisible={isButtonsVisible}
        btnClickHandle={() => {
          setBtnVisible(!isButtonsVisible);
        }}
      />
    </View>
  );
};

AdminCaCard.Header = () => {
  return <CardInfoHeader />;
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

AdminCaCard.CreateNewBtn = () => {
  return (
    <View className="mb-3 mt-5">
      <DottedIconButton
        title={'Create New Platform'}
        iconType={{
          type: 'ionicon',
          name: 'add',
        }}
      />
    </View>
  );
};

AdminCaCard.PlatformList = () => {
  const router = useRouter();
  const btnClickHandle = () => {
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
        Delete this platform
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
