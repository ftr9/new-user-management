import { View, Text, FlatList, RefreshControl } from 'react-native';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import PlatformCard from '@components/common/cards/admin/PlatformCard';
import { useRouter } from 'expo-router';
import usePlatformsStore from '@store/usePlatformsStore';
import { useEffect } from 'react';

const PlatformPage = () => {
  return (
    <>
      <PlatformPage.ListDisplayHeader />
      <PlatformPage.DataDisplay />
    </>
  );
};

PlatformPage.ListDisplayHeader = () => {
  const router = useRouter();
  return (
    <ListDisplayHeader>
      <ListDisplayHeader.LeftContent
        title={"Platform's"}
      ></ListDisplayHeader.LeftContent>
      <ListDisplayHeader.RightContent>
        <DottedIconButton
          title={'Add Platforms'}
          iconType={{ name: 'add', type: 'ionicon' }}
          onClick={() => {
            router.push('/pages/admin/platforms/AddPlatform');
          }}
        />
      </ListDisplayHeader.RightContent>
    </ListDisplayHeader>
  );
};

PlatformPage.DataDisplay = () => {
  const { fetchPlatforms, platformsList, isFetchingPlatforms } =
    usePlatformsStore();

  useEffect(() => {
    fetchPlatforms();
  }, []);

  if (isFetchingPlatforms && platformsList.length === 0) {
    return <Text>✔✔💲💲🈯💹❇✳❎✅</Text>;
  }
  if (platformsList.length === 0) {
    return <Text>No Platforms...</Text>;
  }

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      refreshing={isFetchingPlatforms}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            fetchPlatforms();
          }}
        />
      }
      data={platformsList}
      renderItem={({ item }) => <PlatformCard {...item} />}
      keyExtractor={(item, index) => index}
    />
  );
};

export default PlatformPage;
