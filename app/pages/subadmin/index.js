import { View, Text } from 'react-native';
import React, { useState } from 'react';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import CaAndPlatformCard from '@components/common/cards/subadmin/CaAndPlatformCard';
import { ScrollView, RefreshControl } from 'react-native';

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
      <CaAndPlatformCard />
      <CaAndPlatformCard />
      <CaAndPlatformCard />
      <CaAndPlatformCard />
      <CaAndPlatformCard />
    </ScrollView>
  );
};
SubadminDashBoard.Datas = Datas;

export default SubadminDashBoard;
