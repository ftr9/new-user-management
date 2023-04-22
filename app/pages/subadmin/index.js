import { View, Text } from 'react-native';
import React, { useState } from 'react';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import CaAndPlatformCard from '@components/common/cards/subadmin/CaAndPlatformCard';
import { ScrollView, RefreshControl, BackHandler } from 'react-native';
import useUserData from '@store/useUserData';
import useCaStore from '@store/useCaStore';
import { useEffect } from 'react';
import usePlatformsStore from '@store/usePlatformsStore';
import LoadingIndication from '@components/common/Loading';
import ExitApp from '@utils/ExitApp';

const SubadminDashBoard = () => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', ExitApp);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', ExitApp);
    };
  }, []);

  return (
    <>
      <DashBoardHeader />

      <DataDisplayContainer>
        <SubadminDashBoard.ListHeader />
        <SubadminDashBoard.Datas />
      </DataDisplayContainer>
    </>
  );
};

SubadminDashBoard.ListHeader = () => {
  return (
    <View className="mt-2 mb-3">
      <ListDisplayHeader.LeftContent title={"Your CA's And Platforms"} />
    </View>
  );
};

const Datas = () => {
  const { fetchSubadminCa, isFetchingCa, caList } = useCaStore();
  const { setPlatformsListIds, fetchPlatforms, isFetchingPlatforms } =
    usePlatformsStore();
  const { user } = useUserData();

  const platformsIds = [...new Set(Object.values(user.data.balances).flat())];

  useEffect(() => {
    fetchSubadminCa(Object.keys(user.data.balances));
    setPlatformsListIds(platformsIds);
    fetchPlatforms();
  }, []);

  if (platformsIds.length === 0) {
    return <Text>You are not added to any platforms....</Text>;
  }

  if (isFetchingPlatforms) {
    return <LoadingIndication title={'Loading your platforms !!!'} />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetchingPlatforms}
          onRefresh={() => {
            fetchSubadminCa(Object.keys(user.data.balances));
            setPlatformsListIds(platformsIds);
            fetchPlatforms();
          }}
        />
      }
    >
      {caList?.map(data => {
        return (
          <CaAndPlatformCard
            key={data.id}
            cashApp={data}
            platforms={user.data.balances[data.id]}
          />
        );
      })}
    </ScrollView>
  );
};
SubadminDashBoard.Datas = Datas;

export default SubadminDashBoard;
