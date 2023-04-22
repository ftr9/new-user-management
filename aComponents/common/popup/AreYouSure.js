import { BottomSheet } from '@rneui/themed';
import DottedIconButton from '../buttons/cta/DottedIconButton';
import { createContext, useContext, useState } from 'react';
import { primaryColor, secondaryColor, tertiaryColor } from '@constants/color';
import { View } from 'react-native';
import { H6 } from '../typography/heading';
import NormalButton from '../buttons/cta/NormalButton';

const AreYouSureContext = createContext();

const AreYouSure = ({ children }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSubmitting, setSubmitStatus] = useState(false);
  return (
    <AreYouSureContext.Provider
      value={{
        isPopupVisible,
        setPopupVisible,
        isSubmitting,
        setSubmitStatus,
      }}
    >
      {children}
    </AreYouSureContext.Provider>
  );
};

AreYouSure.CtaBtn = ({ children, iconName, bgColor, borderColor }) => {
  const { setPopupVisible } = useContext(AreYouSureContext);

  return (
    <DottedIconButton
      onClick={() => {
        setPopupVisible(true);
      }}
      title={children}
      borderColor={borderColor}
      bgColor={bgColor}
      iconType={{
        name: iconName,
        type: 'ionicon',
      }}
    />
  );
};

AreYouSure.CtaNormalBtn = ({ title }) => {
  const { setPopupVisible } = useContext(AreYouSureContext);
  return (
    <NormalButton
      size={'small'}
      title={title}
      color={tertiaryColor}
      onClick={() => {
        setPopupVisible(true);
      }}
    />
  );
};

AreYouSure.BottomSheet = ({ title, onYesPress }) => {
  const { setPopupVisible, isPopupVisible } = useContext(AreYouSureContext);
  return (
    <BottomSheet
      backdropStyle={{
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
      isVisible={isPopupVisible}
      onBackdropPress={() => {
        setPopupVisible(false);
      }}
    >
      <View className="bg-secondary rounded-md mx-2 mb-[10vh] p-3 ">
        <AreYouSure.Header title={title} />
        <View className="flex-row justify-between items-center">
          <View className="w-[49%]">
            <AreYouSure.YesBtn onBtnPress={onYesPress} />
          </View>
          <View className="w-[49%]">
            <AreYouSure.NoBtn />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

AreYouSure.Header = ({ title }) => {
  return (
    <View className="my-3">
      <H6 color={'text-quaternary'}>{title}</H6>
    </View>
  );
};

const YesBtn = ({ onBtnPress }) => {
  const context = useContext(AreYouSureContext);
  return (
    <View className="my-2">
      <NormalButton
        onClick={() => {
          onBtnPress(context);
        }}
        title={'Yes'}
        color={tertiaryColor}
        isLoading={context.isSubmitting}
      ></NormalButton>
    </View>
  );
};
AreYouSure.YesBtn = YesBtn;
const NoBtn = () => {
  const { setPopupVisible } = useContext(AreYouSureContext);
  return (
    <View>
      <NormalButton
        onClick={() => setPopupVisible(false)}
        title={'No'}
        color={primaryColor}
      />
    </View>
  );
};

AreYouSure.NoBtn = NoBtn;

export default AreYouSure;
