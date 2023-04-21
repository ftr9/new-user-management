import { View, Text } from 'react-native';
import CheckBoxCard from '@components/common/cards/CheckBoxCard';
import {
  increment,
  updateDoc,
  writeBatch,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import usePlatformsStore from '@store/usePlatformsStore';
import { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import useCaStore from '@store/useCaStore';
import { db } from '@config/firebase';
import { platformDocRef, cashAppDocRef } from '@config/firebaseRefs';
import { useRouter } from 'expo-router';

const AddPlatform = () => {
  const router = useRouter();
  const { fetchAllPlatforms, allPlatformsList, isFetchingPlatforms } =
    usePlatformsStore();
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const { expandedActiveCaCard } = useCaStore();

  const onCheckBoxClick = (isChecked, platformId) => {
    setSelectedPlatforms(state => {
      let newState = [...state];
      if (isChecked) {
        newState = newState.filter(id => id !== platformId);
      } else {
        newState.push(platformId);
      }
      return newState;
    });
  };

  const onSubmitBtnClick = async () => {
    if (selectedPlatforms.length === 0) {
      alert('please select the platforms first !!!!');
      return;
    }

    ////1 update the platforms
    const batch = writeBatch(db);
    selectedPlatforms.forEach(platforms => {
      batch.update(platformDocRef(platforms), {
        [`balances.${expandedActiveCaCard}.totalBalance`]: 0,
      });
    });
    await batch.commit();

    /////2. Update
    await updateDoc(cashAppDocRef(expandedActiveCaCard), {
      totalGroups: increment(selectedPlatforms.length),
      platforms: arrayUnion(...selectedPlatforms),
    });

    alert('updated successfully...');
    router.back();
  };

  useEffect(() => {
    fetchAllPlatforms();
  }, []);
  if (isFetchingPlatforms && allPlatformsList.length === 0) {
    return <Text>🎈🎆🎇🧨✨🎉🎊🎃</Text>;
  }
  return (
    <>
      <FlashList
        data={allPlatformsList}
        estimatedItemSize={30}
        renderItem={({ item }) => {
          const isPresentInsideCa = item.balances[expandedActiveCaCard]
            ? true
            : false;

          return (
            <CheckBoxCard
              id={item.id}
              title={item.name}
              ischecked={isPresentInsideCa}
              isDisabled={isPresentInsideCa}
              onCheckBoxClicked={onCheckBoxClick}
            />
          );
        }}
      ></FlashList>
      <View className="my-2">
        <NormalButton onClick={onSubmitBtnClick} title={'Add Platform'} />
      </View>
    </>
  );
};

export default AddPlatform;
