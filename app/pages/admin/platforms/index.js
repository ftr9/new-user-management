import { View, Text, FlatList } from 'react-native';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import PlatformCard from '@components/common/cards/admin/PlatformCard';
import { useRouter } from 'expo-router';

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
  const datas = new Array(3).fill('a');
  return (
    <FlatList
      data={datas}
      renderItem={() => <PlatformCard />}
      keyExtractor={(item, index) => index}
    />
  );
};

export default PlatformPage;
