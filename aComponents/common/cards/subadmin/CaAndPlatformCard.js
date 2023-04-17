import { View, Text } from 'react-native';
import React from 'react';
import CardInfoHeader from '../CardInfoHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import { P3 } from '@components/common/typography/text';
import { useRouter } from 'expo-router';

const CaAndPlatformCard = () => {
  const router = useRouter();
  return (
    <View className="border-[0.5px] border-primary px-2 py-4 rounded-md mb-5">
      <CardInfoHeader />
      <View className="flex-row justify-between items-center pt-4 pb-2">
        <View className="w-[74%]">
          <DottedIconButton
            onClick={() => {
              router.push('/pages/subadmin/transactions');
            }}
            title={'Retro Realm'}
            iconType={{ name: 'document-text-outline', type: 'ionicon' }}
          />
        </View>
        <View className="w-[24%] h-[100%] bg-blue-50">
          <CaAndPlatformCard.AmountDisplayBtn />
        </View>
      </View>
      <View className="flex-row justify-between items-center pb-2">
        <View className="w-[74%]">
          <DottedIconButton
            title={'Otrore Realm'}
            iconType={{ name: 'document-text-outline', type: 'ionicon' }}
          />
        </View>
        <View className="w-[24%] h-[100%]">
          <CaAndPlatformCard.AmountDisplayBtn />
        </View>
      </View>
      <View className="flex-row justify-between">
        <View className="w-[74%]">
          <DottedIconButton
            title={'Retro Realm'}
            iconType={{ name: 'document-text-outline', type: 'ionicon' }}
          />
        </View>
        <View className="w-[24%] h-[100%]">
          <CaAndPlatformCard.AmountDisplayBtn />
        </View>
      </View>
    </View>
  );
};

CaAndPlatformCard.AmountDisplayBtn = () => {
  return (
    <View className="bg-tertiary-20 flex-1 rounded-sm  justify-center items-center">
      <P3 color={'text-tertiary'}>+ $50</P3>
    </View>
  );
};

export default CaAndPlatformCard;
