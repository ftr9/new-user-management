import { View, Text } from 'react-native';
import React from 'react';
import CardInfoHeader from '../CardInfoHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import { P3 } from '@components/common/typography/text';
import { useRouter } from 'expo-router';
import usePlatformsStore from '@store/usePlatformsStore';
import useCaStore from '@store/useCaStore';

const CaAndPlatformCard = ({ cashApp, platforms }) => {
  const { platformsList, setActivePlatformId } = usePlatformsStore();
  const { setActiveCaCard } = useCaStore();
  const router = useRouter();
  return (
    <View className="border-[0.5px] border-primary px-2 py-4 rounded-md mb-5">
      <CardInfoHeader
        documentId={cashApp.id}
        title={cashApp.name}
        amount={cashApp.totalBalance}
        userOrGroupsCount={cashApp.totalGroups}
        currentPage={'subadmin'}
      />
      {platforms.map(platformId => {
        const platformData = platformsList.find(el => el.id === platformId);
        return (
          <View
            key={platformId}
            className="flex-row justify-between items-center pt-3 pb-2"
          >
            <View className="w-[74%]">
              <DottedIconButton
                onClick={() => {
                  setActiveCaCard(cashApp.id);
                  setActivePlatformId(platformData.id);
                  router.push('/pages/subadmin/transactions');
                }}
                title={platformData?.name}
                iconType={{ name: 'document-text-outline', type: 'ionicon' }}
              />
            </View>
            <View className="w-[24%] h-[100%] bg-blue-50">
              <CaAndPlatformCard.AmountDisplayBtn
                amount={
                  platformData?.balances[cashApp.id]
                    ? platformData?.balances[cashApp.id].totalBalance
                    : '--'
                }
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

CaAndPlatformCard.AmountDisplayBtn = ({ amount }) => {
  return (
    <View className="bg-tertiary-20 flex-1 rounded-sm  justify-center items-center">
      <P3 color={'text-tertiary'}>{amount}</P3>
    </View>
  );
};

export default CaAndPlatformCard;
