import { View, Text } from 'react-native';
import React from 'react';
import useSubadminsStore from '@store/subadmin/useSubadminsStore';
import { useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import CheckBoxCard from '@components/common/cards/CheckBoxCard';
import { useState } from 'react';
import useCaStore from '@store/useCaStore';
import { useRouter, useSearchParams } from 'expo-router';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import {
  platformColRef,
  platformDocRef,
  subAdminDocRef,
} from '@config/firebaseRefs';
import {
  arrayUnion,
  increment,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@config/firebase';
import LoadingIndication from '@components/common/Loading';

////Has ?platformId=weuifh348fh as a query params

const AddSubadmin = () => {
  const { fetchAllSubadmins, subadminsList, isFetchingSubadminsData } =
    useSubadminsStore();
  const { platformId } = useSearchParams();
  const router = useRouter();

  const [selectedSubadmins, setSelectedSubadmins] = useState([]);
  const [isAddingSubadmins, setAddingStatus] = useState(false);
  const { expandedActiveCaCard } = useCaStore();

  const onCheckBoxClicked = (isChecked, id) => {
    setSelectedSubadmins(state => {
      let newState = [...state];
      if (isChecked) {
        newState = newState.filter(subadminId => subadminId !== id);
      } else {
        newState.push(id);
      }
      return newState;
    });
  };

  const addBtnClick = async () => {
    if (selectedSubadmins.length === 0) {
      alert('please select atleast one subadmins');
      return;
    }

    setAddingStatus(true);
    ////1)update subadmins
    const batch = writeBatch(db);

    selectedSubadmins.forEach(subadminId => {
      batch.update(subAdminDocRef(subadminId), {
        [`balances.${expandedActiveCaCard}`]: arrayUnion(platformId),
      });
    });

    await batch.commit();

    ////3> update platforms
    await updateDoc(platformDocRef(platformId), {
      [`balances.${expandedActiveCaCard}.totalSubadmins`]: increment(
        selectedSubadmins.length
      ),
    });

    setAddingStatus(false);
    alert('Added subadmin successfully.');
    router.back();
  };

  const isAddedToCaAndPlatforms = item => {
    if (
      item.balances[expandedActiveCaCard] &&
      item.balances[expandedActiveCaCard]?.includes(platformId)
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetchAllSubadmins();
  }, []);

  if (subadminsList.length === 0 && isFetchingSubadminsData) {
    return <LoadingIndication title={'Loading Subadmins !!!'} />;
  }
  return (
    <>
      <FlashList
        data={subadminsList}
        estimatedItemSize={30}
        renderItem={({ item }) => {
          const isSubscribed = isAddedToCaAndPlatforms(item);
          return (
            <CheckBoxCard
              id={item.id}
              title={item.username}
              isDisabled={isSubscribed}
              ischecked={isSubscribed}
              onCheckBoxClicked={onCheckBoxClicked}
            />
          );
        }}
      ></FlashList>
      <View className="py-3">
        <NormalButton
          isLoading={isAddingSubadmins}
          title={'Add Subadmin'}
          onClick={addBtnClick}
        />
      </View>
    </>
  );
};

export default AddSubadmin;
