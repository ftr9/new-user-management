import { View, Text } from 'react-native';
import { useEffect } from 'react';
import useSubadminsStore from '@store/subadmin/useSubadminsStore';
import { FlashList } from '@shopify/flash-list';
import useCaStore from '@store/useCaStore';
import { useRouter, useSearchParams } from 'expo-router';
import CheckBoxCard from '@components/common/cards/CheckBoxCard';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import { useState } from 'react';
import {
  arrayRemove,
  increment,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { platformDocRef, subAdminDocRef } from '@config/firebaseRefs';
import { db } from '@config/firebase';
import LoadingIndication from '@components/common/Loading';

const RemoveSubadmin = () => {
  const { fetchAllSubadmins, isFetchingSubadminsData, subadminsList } =
    useSubadminsStore();
  const { expandedActiveCaCard } = useCaStore();
  const { platformId } = useSearchParams();
  const [selectedSubadmins, setSelectedSubadmins] = useState([]);
  const [isDeletingSubadmins, setDeleteSubadminStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAllSubadmins();
  }, []);

  if (subadminsList.length === 0 && isFetchingSubadminsData) {
    return <LoadingIndication title={"Loading Subadmin's !!!"} />;
  }

  const checkBoxClick = (isChecked, id) => {
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

  const onRemoveClick = async () => {
    if (selectedSubadmins.length === 0) {
      alert('please select atleast one subadmin');
      return;
    }
    setDeleteSubadminStatus(true);
    const batch = writeBatch(db);

    selectedSubadmins.forEach(subadminId => {
      batch.update(subAdminDocRef(subadminId), {
        [`balances.${expandedActiveCaCard}`]: arrayRemove(platformId),
      });
    });

    await batch.commit();

    await updateDoc(platformDocRef(platformId), {
      [`balances.${expandedActiveCaCard}.totalSubadmins`]: increment(
        -1 * selectedSubadmins.length
      ),
    });

    setDeleteSubadminStatus(false);
    alert('Removed subadmin successfully.');
    router.back();
  };

  return (
    <>
      <FlashList
        estimatedItemSize={30}
        data={subadminsList}
        renderItem={({ item }) => {
          if (item?.balances[expandedActiveCaCard]?.includes(platformId)) {
            return (
              <CheckBoxCard
                id={item.id}
                title={item.username}
                isDisabled={false}
                ischecked={false}
                onCheckBoxClicked={checkBoxClick}
              />
            );
          }
        }}
      >
        <Text>RemoveSubadmin</Text>
      </FlashList>
      <View className="my-3">
        <NormalButton
          isLoading={isDeletingSubadmins}
          onClick={onRemoveClick}
          title={'Remove Subadmin'}
          color={tertiaryColor}
        />
      </View>
    </>
  );
};

export default RemoveSubadmin;
