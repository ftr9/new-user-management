import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheet, Avatar } from '@rneui/themed';
import { H6 } from '../typography/heading';
import InputField from '../Input';
import NormalButton from '../buttons/cta/NormalButton';
import DottedIconButton from '../buttons/cta/DottedIconButton';
import { useState, useContext, createContext } from 'react';
import { primaryColor } from '@constants/color';

/**This starts here finaly.......✨🧨🎉✨✨🧨🎉🎉 */

const FormsPopupContext = createContext();

export const FormsPopup = ({ children }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputValue1, setInputValue1] = useState('');
  const [error, setError] = useState('');
  const [hasError, setErrorStatus] = useState(false);
  const [error1, setError1] = useState('');
  const [hasError1, setErrorStatus1] = useState(false);
  const [isSubmitting, setSubmitStatus] = useState(false);

  const resetFormsState = () => {
    setPopupVisible(false);
    setInputValue('');
    setInputValue1('');
    setError('');
    setErrorStatus(false);
    setError1('');
    setErrorStatus1(false);
    setSubmitStatus(false);
  };

  return (
    <FormsPopupContext.Provider
      value={{
        isPopupVisible,
        setPopupVisible,
        inputValue,
        setInputValue,
        inputValue1,
        setInputValue1,
        hasError,
        hasError1,
        setErrorStatus,
        setErrorStatus1,
        error,
        error1,
        setError,
        setError1,
        isSubmitting,
        setSubmitStatus,
        resetFormsState,
      }}
    >
      {children}
    </FormsPopupContext.Provider>
  );
};

function BottomsSheet({ children }) {
  const { isPopupVisible, setPopupVisible } = useContext(FormsPopupContext);

  const backDropPressHandle = () => {
    setPopupVisible(false);
  };
  return (
    <BottomSheet
      onBackdropPress={backDropPressHandle}
      isVisible={isPopupVisible}
      scrollViewProps={{
        keyboardShouldPersistTaps: 'handled',
      }}
      backdropStyle={{
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <View className="w-[95%] py-4 bg-white mx-auto rounded-xl mb-[10vh]">
        {children}
      </View>
    </BottomSheet>
  );
}
FormsPopup.BottomsSheet = BottomsSheet;

FormsPopup.CtaButton = ({ children, iconName, bgColor, borderColor }) => {
  const { setPopupVisible } = useContext(FormsPopupContext);
  return (
    <View>
      <DottedIconButton
        onClick={() => setPopupVisible(true)}
        title={children}
        bgColor={bgColor}
        borderColor={borderColor}
        iconType={{ type: 'ionicon', name: iconName ? iconName : 'add' }}
      />
    </View>
  );
};

FormsPopup.CircularCtaButton = () => {
  const { setPopupVisible } = useContext(FormsPopupContext);
  return (
    <TouchableOpacity
      onPress={() => {
        setPopupVisible(true);
      }}
    >
      <Avatar
        size={25}
        rounded
        containerStyle={{
          backgroundColor: primaryColor,
          marginLeft: 15,
        }}
        icon={{
          name: 'pencil',
          type: 'font-awesome',
        }}
      ></Avatar>
    </TouchableOpacity>
  );
};

const FormsPopUpHeader = ({ title }) => {
  const { setPopupVisible } = useContext(FormsPopupContext);
  return (
    <View className="flex-row justify-between items-center p-3 ">
      <H6>{title}</H6>
      <Avatar
        size={50}
        rounded
        icon={{ name: 'close', type: 'ionicon' }}
        containerStyle={{
          backgroundColor: '#E03131',
        }}
        onPress={() => setPopupVisible(false)}
      ></Avatar>
    </View>
  );
};
FormsPopup.Header = FormsPopUpHeader;

const FormsNumericInputField = ({ label, placeholder }) => {
  const { inputValue, setInputValue, hasError, error } =
    useContext(FormsPopupContext);
  return (
    <InputField
      label={label}
      placeholder={placeholder}
      errorMessage={error}
      hasError={hasError}
      canBeFocused={true}
      isNumericType={true}
      onChangeText={val => setInputValue(val)}
      value={inputValue.toString()}
    />
  );
};
FormsPopup.FormsNumericInputField = FormsNumericInputField;

const FormsTextInputField = ({ label, placeholder }) => {
  const { inputValue, setInputValue, hasError, error } =
    useContext(FormsPopupContext);
  return (
    <InputField
      label={label}
      placeholder={placeholder}
      errorMessage={error}
      hasError={hasError}
      canBeFocused={true}
      isNumericType={false}
      onChangeText={val => setInputValue(val)}
      value={inputValue}
      maxLength={50}
    />
  );
};
FormsPopup.FormsTextInputField = FormsTextInputField;

const FormsTextInputField1 = ({ label, placeholder }) => {
  const { inputValue1, setInputValue1, hasError1, error1 } =
    useContext(FormsPopupContext);
  return (
    <InputField
      label={label}
      placeholder={placeholder}
      errorMessage={error1}
      hasError={hasError1}
      canBeFocused={false}
      isNumericType={false}
      maxLength={100}
      onChangeText={val => setInputValue1(val)}
      value={inputValue1}
    />
  );
};
FormsPopup.FormsTextInputField1 = FormsTextInputField1;

function FormsSubmitButton({ children, submitClickHandle, color }) {
  const context = useContext(FormsPopupContext);
  return (
    <View className="px-3 mb-3">
      <NormalButton
        color={color}
        isLoading={context.isSubmitting}
        onClick={() => {
          submitClickHandle(context);
        }}
        title={children}
      ></NormalButton>
    </View>
  );
}
FormsPopup.FormsSubmitButton = FormsSubmitButton;

export default FormsPopup;
