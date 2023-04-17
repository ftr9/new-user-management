import { View, Text } from 'react-native';
import React from 'react';
import DashBoardHeader from '@components/common/header/DashBoardHeader';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import { P3 } from '@components/common/typography/text';
import FormsPopup from '@components/common/popup/FormPopUp';

const EditSubadmin = () => {
  return (
    <>
      <DashBoardHeader />
      <DataDisplayContainer>
        <EditSubadmin.Card />
        <EditSubadmin.Card />
        <EditSubadmin.Card />
        <EditSubadmin.Card />
        <EditSubadmin.Card />
        <EditSubadmin.Card />
        <EditSubadmin.Card />
      </DataDisplayContainer>
    </>
  );
};

EditSubadmin.Card = () => {
  return (
    <View className="flex-row bg-primary-10 my-2 py-2 px-3 rounded-md justify-between items-center">
      <P3 color={'text-quaternary'}>Subash </P3>
      <FormsPopup>
        <FormsPopup.CtaButton iconName={'key-outline'}>
          Set Password
        </FormsPopup.CtaButton>
        <FormsPopup.BottomsSheet>
          <FormsPopup.Header title={'Set new Password'} />
          <FormsPopup.FormsTextInputField
            placeholder={'new password'}
            label={'Enter new password'}
          />
          <FormsPopup.FormsSubmitButton
            submitClickHandle={context => {
              alert('hello world');
            }}
          >
            Set
          </FormsPopup.FormsSubmitButton>
        </FormsPopup.BottomsSheet>
      </FormsPopup>
    </View>
  );
};

export default EditSubadmin;
