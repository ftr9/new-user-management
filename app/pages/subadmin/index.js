import { View, Text } from 'react-native';
import React, { useState } from 'react';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import CaAndPlatformCard from '@components/common/cards/subadmin/CaAndPlatformCard';
import { ScrollView, RefreshControl } from 'react-native';
import useUserData from '@store/useUserData';
import useCaStore from '@store/useCaStore';
import { useEffect } from 'react';
import usePlatformsStore from '@store/usePlatformsStore';

const SubadminDashBoard = () => {
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
  const [isRefreshing, setRefreshing] = useState(false);
  const { fetchSubadminCa, isFetchingCa, caList } = useCaStore();
  const { setPlatformsListIds, fetchPlatforms } = usePlatformsStore();
  const { user } = useUserData();

  useEffect(() => {
    fetchSubadminCa(Object.keys(user.data.balances));
    setPlatformsListIds([...new Set(Object.values(user.data.balances).flat())]);
    fetchPlatforms();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => {
              setRefreshing(false);
            }, 1000);
          }}
        />
      }
    >
      {caList.map(data => {
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
