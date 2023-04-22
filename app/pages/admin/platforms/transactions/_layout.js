import { View, Text } from 'react-native';
import React from 'react';
import { Slot, Tabs } from 'expo-router';

import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import NormalStaticButton from '@components/common/buttons/static/NormalStaticBtn';
import { primaryColor, secondaryColor, tertiaryColor } from '@constants/color';
import { Icon } from '@rneui/themed';
import { P4 } from '@components/common/typography/text';
import { useEffect } from 'react';
import { useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { platformDocRef } from '@config/firebaseRefs';
import usePlatformsStore from '@store/usePlatformsStore';
import useCaStore from '@store/useCaStore';

const tabBarCommonOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: secondaryColor,
    shadowColor: secondaryColor,
    shadowOffset: 0,
  },
};

const TransactionLayout = () => {
  return (
    <>
      <TransactionLayout.Header />
      <Tabs
        sceneContainerStyle={{
          backgroundColor: secondaryColor,
        }}
      >
        <Tabs.Screen
          name="CashInAndOut"
          options={{
            ...tabBarCommonOptions,
            tabBarLabel: ({ focused }) => {
              return (
                <P4 color={focused ? 'text-quaternary' : 'text-unselected'}>
                  CashIn&Out
                </P4>
              );
            },
            tabBarIcon: ({ focused }) => (
              <View className="flex-row justify-center items-center">
                <Icon
                  name="arrow-up-outline"
                  size={focused ? 16 : 14}
                  type="ionicon"
                  color={primaryColor}
                />
                <Icon
                  name="arrow-down-outline"
                  size={14}
                  type="ionicon"
                  color={tertiaryColor}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="CashIn"
          options={{
            ...tabBarCommonOptions,
            tabBarLabel: ({ focused }) => {
              return (
                <P4 color={focused ? 'text-quaternary' : 'text-unselected'}>
                  CashIn
                </P4>
              );
            },
            tabBarIcon: ({ focused }) => {
              return (
                <Icon
                  color={primaryColor}
                  name="arrow-down-outline"
                  type="ionicon"
                  size={focused ? 16 : 14}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          options={{
            ...tabBarCommonOptions,
            tabBarLabel: ({ focused }) => {
              return (
                <P4 color={focused ? 'text-quaternary' : 'text-unselected'}>
                  CashOut
                </P4>
              );
            },
            tabBarIcon: ({ focused }) => {
              return (
                <Icon
                  color={tertiaryColor}
                  name="arrow-up-outline"
                  type="ionicon"
                  size={focused ? 16 : 14}
                />
              );
            },
          }}
          name="CashOut"
        />

        <Tabs.Screen
          options={{
            ...tabBarCommonOptions,
            tabBarLabel: ({ focused }) => {
              return (
                <P4 color={focused ? 'text-quaternary' : 'text-unselected'}>
                  Admin
                </P4>
              );
            },
            tabBarIcon: ({ focused }) => {
              return (
                <View className="flex-row justify-center items-center">
                  <Icon
                    name="arrow-down-outline"
                    size={focused ? 16 : 14}
                    type="ionicon"
                    color={primaryColor}
                  />
                  <Icon name="skull" size={focused ? 16 : 14} type="ionicon" />
                  <Icon
                    name="arrow-up-outline"
                    size={focused ? 16 : 14}
                    type="ionicon"
                    color={tertiaryColor}
                  />
                </View>
              );
            },
          }}
          name="Admin"
        />
      </Tabs>
    </>
  );
};

TransactionLayout.Header = () => {
  const [data, setData] = useState({ name: '', amount: 0 });
  const { activePlatformId } = usePlatformsStore();
  const { expandedActiveCaCard } = useCaStore();

  useEffect(() => {
    const unSubscribePlatformData = onSnapshot(
      platformDocRef(activePlatformId),
      snapshot => {
        const updatedData = {
          name: snapshot?.data()?.name,
          amount:
            snapshot?.data()?.balances[expandedActiveCaCard]?.totalBalance,
        };

        setData(updatedData);
      }
    );
    return () => {
      unSubscribePlatformData();
    };
  }, []);

  return (
    <ListDisplayHeader>
      <ListDisplayHeader.LeftContent title={data.name} />
      <ListDisplayHeader.RightContent>
        <NormalStaticButton
          style={'bg-primary-20'}
          title={'$' + data.amount.toFixed(2)}
        />
      </ListDisplayHeader.RightContent>
    </ListDisplayHeader>
  );
};

export default TransactionLayout;
