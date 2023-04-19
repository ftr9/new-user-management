import { View } from 'react-native';
import { H6 } from '../typography/heading';
import IconStaticButton from '../buttons/static/IconStaticBtn';
import NormalStaticButton from '../buttons/static/NormalStaticBtn';
import FormsPopup from '../popup/FormPopUp';
import { updateDoc } from 'firebase/firestore';
import { cashAppDocRef, platformDocRef } from '@config/firebaseRefs';

const CardInfoHeader = ({
  documentId = '',
  title = '',
  amount = 0,
  userOrGroupsCount = 0,
  refetchData,
  currentPage,
}) => {
  return (
    <View className="w-[100%]  bg-secondary flex-row flex-wrap justify-between items-center">
      <View className="flex-row">
        <H6>{title.length > 10 ? title.slice(0, 9) + '..' : title}</H6>
        <FormsPopup>
          <FormsPopup.CircularCtaButton />
          <FormsPopup.BottomsSheet>
            <FormsPopup.Header title={'Edit name'} />
            <FormsPopup.FormsTextInputField
              label={'Enter new Group Name'}
              placeholder={'group name'}
            />
            <FormsPopup.FormsSubmitButton
              submitClickHandle={async context => {
                const {
                  inputValue,
                  setError,
                  setErrorStatus,
                  setSubmitStatus,
                  setPopupVisible,
                  setInputValue,
                } = context;

                if (inputValue.length <= 2) {
                  setErrorStatus(true);
                  setError('*name must have atleast three characters');
                  return;
                }

                setSubmitStatus(true);
                if (currentPage === 'dashboard') {
                  await updateDoc(cashAppDocRef(documentId), {
                    name: inputValue,
                  });
                }

                if (currentPage === 'platforms') {
                  await updateDoc(platformDocRef(documentId), {
                    name: inputValue,
                  });
                }
                setSubmitStatus(false);
                alert(`changed CA Name successfully`);
                setPopupVisible(false);
                setError('');
                setErrorStatus(false);
                setInputValue('');
                refetchData();
              }}
            >
              Edit
            </FormsPopup.FormsSubmitButton>
          </FormsPopup.BottomsSheet>
        </FormsPopup>
      </View>

      <View className="flex-row">
        <NormalStaticButton
          style={'border-primary border-[0.5px] mr-2'}
          title={`+${amount === 0 ? '0.0' : amount} ` + ' $'}
        />
        <IconStaticButton title={userOrGroupsCount} />
      </View>
    </View>
  );
};

export default CardInfoHeader;
