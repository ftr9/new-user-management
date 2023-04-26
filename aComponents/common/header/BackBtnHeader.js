import { View, Text } from 'react-native';
import React from 'react';
import { H6 } from '../typography/heading';
import BackButton from '../buttons/cta/BackButton';
import NormalStaticButton from '../buttons/static/NormalStaticBtn';
import { cashAppDocRef } from '@config/firebaseRefs';
import { useEffect } from 'react';
import { useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import useCaStore from '@store/useCaStore';

const BackBtnHeader = () => {
  const { expandedActiveCaCard } = useCaStore();
  const [data, setData] = useState({ name: '', amount: 0 });

  useEffect(() => {
    const unSubCashAppUpdate = onSnapshot(
      cashAppDocRef(expandedActiveCaCard),
      snapshot => {
        const snapshotData = {
          name: snapshot?.data()?.name,
          amount: snapshot?.data()?.totalBalance,
        };
        setData(snapshotData);
      }
    );
    return () => {
      unSubCashAppUpdate();
    };
  }, []);

  return (
    <View className="flex-row my-2  justify-between items-center">
      <BackBtnHeader.BackBtn />
      <View className="pl-3 w-[60%]">
        <BackBtnHeader.Title>{data.name}</BackBtnHeader.Title>
      </View>

      <BackBtnHeader.AmountDisplay>
        $ {data?.amount?.toFixed(2)}
      </BackBtnHeader.AmountDisplay>
    </View>
  );
};

BackBtnHeader.BackBtn = () => {
  return <BackButton />;
};

BackBtnHeader.Title = ({ children }) => {
  return <H6 color={'text-secondary'}>{children}</H6>;
};

BackBtnHeader.AmountDisplay = ({ children }) => {
  return <NormalStaticButton style={'bg-white'} title={children} />;
};

export default BackBtnHeader;
