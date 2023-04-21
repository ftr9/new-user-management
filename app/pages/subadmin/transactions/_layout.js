import { View, Text } from 'react-native';
import React from 'react';
import { Slot, Tabs } from 'expo-router';

import { primaryColor, secondaryColor, tertiaryColor } from '@constants/color';
import { Icon } from '@rneui/themed';
import { P4 } from '@components/common/typography/text';
import BackBtnHeader from '@components/common/header/BackBtnHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import NormalStaticButton from '@components/common/buttons/static/NormalStaticBtn';
import FormsPopup from '@components/common/popup/FormPopUp';
import useSubadminsStore from '@store/subadmin/useSubadminsStore';
import useUserData from '@store/useUserData';
import useCaStore from '@store/useCaStore';
import useTransactionStore from '@store/useTransactionStore';
import usePlatformsStore from '@store/usePlatformsStore';
import {
  addDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import {
  platformTransactionColRef,
  platformDocRef,
  cashAppDocRef,
} from '@config/firebaseRefs';

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
      <BackBtnHeader>
        <BackBtnHeader.BackBtn />
        <BackBtnHeader.Title>IronMan</BackBtnHeader.Title>
        <BackBtnHeader.AmountDisplay>total = +$450</BackBtnHeader.AmountDisplay>
      </BackBtnHeader>
      <DataDisplayContainer>
        <TransactionLayout.ListDisplayHeader />
        <TransactionLayout.CashInAndOut />
        <Tabs
          sceneContainerStyle={{
            backgroundColor: secondaryColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 2,
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
                    <Icon
                      name="skull"
                      size={focused ? 16 : 14}
                      type="ionicon"
                    />
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
      </DataDisplayContainer>
    </>
  );
};

TransactionLayout.ListDisplayHeader = () => {
  return (
    <ListDisplayHeader>
      <ListDisplayHeader.LeftContent title={'IronMan(transactions)'} />
      <ListDisplayHeader.RightContent>
        <NormalStaticButton style={'bg-primary-20'} title={'total = +500'} />
      </ListDisplayHeader.RightContent>
    </ListDisplayHeader>
  );
};

TransactionLayout.CashInAndOut = () => {
  const { user } = useUserData();
  const { expandedActiveCaCard } = useCaStore();
  const { activePlatformId: id } = usePlatformsStore();

  const onCashInClick = async context => {
    const {
      inputValue,
      inputValue1,
      setError,
      setSubmitStatus,
      setErrorStatus,
      resetFormsState,
    } = context;
    const value = parseFloat(inputValue);
    if (value <= 0 || isNaN(value)) {
      setError('* balance should be more than zero');
      setErrorStatus(true);
    }

    setSubmitStatus(true);
    ////2) get platform balance
    const platform = await getDoc(platformDocRef(id));
    if (!platform.exists()) {
      alert('failed to reacharge !! something went wrong');
      setSubmitStatus(false);
      return;
    }

    ////3) Add to the transaction of platform
    await addDoc(platformTransactionColRef(id), {
      amount: value,
      closingAmount:
        platform.data().balances[expandedActiveCaCard].totalBalance + value,
      isDeleted: false,
      caId: expandedActiveCaCard,
      isCashIn: true,
      isAdmin: false,
      userName: `${user.data.username} (${inputValue1 ? inputValue1 : 'XXXX'})`,
      userId: user.id,
      createdAt: serverTimestamp(),
    });

    ////4) Add to the total Balance of platforms
    await updateDoc(platformDocRef(id), {
      [`balances.${expandedActiveCaCard}.totalBalance`]: increment(value),
    });

    ////5) Add to the total Balance of CA
    await updateDoc(cashAppDocRef(expandedActiveCaCard), {
      totalBalance: increment(value),
    });

    alert(`Recharged ${value}$ successfully`);
    resetFormsState();

    ////6)fetch again everything
  };

  const onCashOutClick = async context => {
    const {
      inputValue,
      inputValue1,
      setError,
      setSubmitStatus,
      setErrorStatus,
      resetFormsState,
    } = context;
    const value = parseFloat(inputValue);
    if (value <= 0 || isNaN(value)) {
      setError('* balance should be more than zero');
      setErrorStatus(true);
    }

    setSubmitStatus(true);
    ////2) get platform balance
    const platform = await getDoc(platformDocRef(id));
    if (!platform.exists()) {
      alert('failed to reacharge !! something went wrong');
      setSubmitStatus(false);
      return;
    }

    ////3) Add to the transaction of platform
    await addDoc(platformTransactionColRef(id), {
      amount: -1 * value,
      closingAmount:
        platform.data().balances[expandedActiveCaCard].totalBalance - value,
      isDeleted: false,
      caId: expandedActiveCaCard,
      isCashIn: false,
      isAdmin: false,
      userName: `${user.data.username} (${inputValue1 ? inputValue1 : 'XXXX'})`,
      userId: user.id,
      createdAt: serverTimestamp(),
    });

    ////4) Add to the total Balance of platforms
    await updateDoc(platformDocRef(id), {
      [`balances.${expandedActiveCaCard}.totalBalance`]: increment(-1 * value),
    });

    ////5) Add to the total Balance of CA
    await updateDoc(cashAppDocRef(expandedActiveCaCard), {
      totalBalance: increment(-1 * value),
    });

    alert(`Recharged ${value}$ successfully`);
    resetFormsState();

    ////6)fetch again everything
  };

  return (
    <View className="flex-row justify-between mt-2 mb-4">
      <View className="w-[49%]">
        <FormsPopup>
          <FormsPopup.CtaButton>Cash-In</FormsPopup.CtaButton>
          <FormsPopup.BottomsSheet>
            <FormsPopup.Header title={'Recharge'} />
            <FormsPopup.FormsNumericInputField
              label={'Enter the recharge Amount'}
              placeholder={''}
            />
            <FormsPopup.FormsSubmitButton submitClickHandle={onCashInClick}>
              Recharge
            </FormsPopup.FormsSubmitButton>
          </FormsPopup.BottomsSheet>
        </FormsPopup>
      </View>
      <View className="w-[49%]">
        <FormsPopup>
          <FormsPopup.CtaButton
            bgColor={'bg-tertiary-20'}
            borderColor={'border-tertiary'}
            iconName={'remove-outline'}
          >
            Cash-Out
          </FormsPopup.CtaButton>
          <FormsPopup.BottomsSheet>
            <FormsPopup.Header title={'Redeem'} />
            <FormsPopup.FormsNumericInputField
              label={'Enter the redeem amount'}
              placeholder={''}
            />
            <FormsPopup.FormsSubmitButton
              submitClickHandle={onCashOutClick}
              color={tertiaryColor}
            >
              Redeem
            </FormsPopup.FormsSubmitButton>
          </FormsPopup.BottomsSheet>
        </FormsPopup>
      </View>
    </View>
  );
};

export default TransactionLayout;
