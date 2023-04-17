import { View, FlatList, Text, RefreshControl } from 'react-native';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import FormsPopup from '@components/common/popup/FormPopUp';
import ListDisplayHeader from '@components/common/header/ListDisplayHeader';
import { primaryColor, secondaryColor } from '@constants/color';
import { useState } from 'react';
import AdminCaCard from '@components/common/cards/admin/CaCard';
import { useRouter } from 'expo-router';

const AdminDashBoard = () => {
  return (
    <>
      <DashBoardHeader />
      <DataDisplayContainer>
        <View className="py-3">
          <AdminDashBoard.CreateNewCA />
        </View>

        <View className="flex-row justify-between">
          <View className="w-[52%]">
            <AdminDashBoard.CreateSubadmin />
          </View>
          <View className="w-[46%]">
            <AdminDashBoard.EditSubadmin />
          </View>
        </View>

        <ListDisplayHeader>
          <ListDisplayHeader.LeftContent title={"Your CA's"} />
        </ListDisplayHeader>
        <AdminDashBoard.DataDisplay />
      </DataDisplayContainer>
    </>
  );
};

AdminDashBoard.DataDisplay = () => {
  const Datas = new Array(5).fill('5');
  const [refreshing, setRefreshing] = useState(false);
  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            progressBackgroundColor={primaryColor}
            colors={[secondaryColor]}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                setRefreshing(false);
              }, 2000);
            }}
          />
        }
        data={Datas}
        renderItem={({ item }) => {
          return <AdminCaCard />;
        }}
        indicatorStyle={'black'}
        keyExtractor={(item, index) => index}
      />
    </>
  );
};

AdminDashBoard.CreateNewCA = () => {
  return (
    <FormsPopup>
      <FormsPopup.CtaButton>Create New CA</FormsPopup.CtaButton>
      <FormsPopup.BottomsSheet>
        <FormsPopup.Header title={'Create New CA'} />
        <FormsPopup.FormsTextInputField
          placeholder={'CA name'}
          label={'Enter the CA Name'}
        ></FormsPopup.FormsTextInputField>
        <FormsPopup.FormsSubmitButton
          submitClickHandle={context => {
            alert('created successfully...');
          }}
        >
          Create
        </FormsPopup.FormsSubmitButton>
      </FormsPopup.BottomsSheet>
    </FormsPopup>
  );
};

AdminDashBoard.CreateSubadmin = () => {
  return (
    <DottedIconButton
      title={'Create Subadmin'}
      iconType={{
        name: 'person-add-outline',
        type: 'ionicon',
      }}
    ></DottedIconButton>
  );
};

AdminDashBoard.EditSubadmin = () => {
  const router = useRouter();
  return (
    <DottedIconButton
      onClick={() => {
        router.push('/pages/admin/EditSubadmin');
      }}
      title={'Edit Subadmin'}
      iconType={{ name: 'pencil', type: 'font-awesome' }}
    />
  );
};

export default AdminDashBoard;
