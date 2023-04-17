import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import CardInfoHeader from '../CardInfoHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import FormsPopup from '@components/common/popup/FormPopUp';
import { H1 } from '@components/common/typography/heading';
import { tertiaryColor } from '@constants/color';
import { useRouter } from 'expo-router';
import AreYouSure from '@components/common/popup/AreYouSure';

const PlatformCard = () => {
  const router = useRouter();
  return (
    <View className="border-[0.8px] my-3 py-3 px-[6px] border-primary rounded-md">
      <CardInfoHeader />
      <View className="flex-row justify-between mt-3 mb-2">
        <View className="w-[49%]">
          <DottedIconButton
            onClick={() => {
              router.push('/pages/admin/platforms/transactions/CashInAndOut');
            }}
            title={'Statements'}
            iconType={{ name: 'document-text-outline', type: 'ionicon' }}
          />
        </View>
        <View className="w-[49%]">
          <PlatformCard.AddSubadmin />
        </View>
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <View className="w-[40%]">
          <PlatformCard.RechargeBtn />
        </View>
        <View className="w-[58%]">
          <PlatformCard.SellBalanceBtn />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <View className="w-[40%]">
          <PlatformCard.RedeemBtn />
        </View>
        <View className="w-[58%]">
          <PlatformCard.DeleteBtn />
        </View>
      </View>

      <View>
        <PlatformCard.RemoveSubAdmin />
      </View>
    </View>
  );
};

PlatformCard.AddSubadmin = () => {
  const router = useRouter();
  return (
    <DottedIconButton
      onClick={() => {
        router.push('/pages/admin/platforms/AddSubadmin');
      }}
      title={'Add Subadmin'}
      iconType={{
        type: 'ionicon',
        name: 'person-add-outline',
      }}
    />
  );
};

PlatformCard.RechargeBtn = () => {
  return (
    <FormsPopup>
      <FormsPopup.CtaButton iconName={'add'}>Recharge</FormsPopup.CtaButton>
    </FormsPopup>
  );
};

PlatformCard.SellBalanceBtn = () => {
  return (
    <FormsPopup>
      <FormsPopup.CtaButton
        bgColor={'bg-tertiary-20'}
        borderColor={'border-tertiary'}
        iconName={'remove-outline'}
      >
        Sell Balance
      </FormsPopup.CtaButton>
    </FormsPopup>
  );
};

PlatformCard.RedeemBtn = () => {
  return (
    <FormsPopup>
      <FormsPopup.CtaButton
        bgColor={'bg-tertiary-20'}
        borderColor={'border-tertiary'}
        iconName={'remove-outline'}
      >
        Redeem
      </FormsPopup.CtaButton>
    </FormsPopup>
  );
};

PlatformCard.DeleteBtn = () => {
  return (
    <AreYouSure>
      <AreYouSure.CtaBtn
        iconName={'trash-outline'}
        bgColor={'bg-tertiary-20'}
        borderColor={'border-tertiary'}
      >
        Delete Platform
      </AreYouSure.CtaBtn>
      <AreYouSure.BottomSheet
        onYesPress={() => {
          alert('deleted successfully...');
        }}
        title={'Are your sure want to delete this platform ?'}
      />
    </AreYouSure>
  );
};

PlatformCard.RemoveSubAdmin = () => {
  return (
    <DottedIconButton
      title={'Remove Subadmin'}
      onClick={() => {
        alert('hilo');
      }}
      bgColor={'bg-tertiary-20'}
      borderColor={'border-tertiary'}
      iconType={{
        name: 'person-remove-outline',
        type: 'ionicon',
      }}
    />
  );
};

export default PlatformCard;
