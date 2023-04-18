import { View } from 'react-native';
import { H5 } from '../typography/heading';
import IconStaticButton from '../buttons/static/IconStaticBtn';
import NormalStaticButton from '../buttons/static/NormalStaticBtn';
import FormsPopup from '../popup/FormPopUp';

const CardInfoHeader = () => {
  return (
    <View className="w-[100%]  bg-secondary flex-row flex-wrap justify-between items-center">
      <View className="flex-row">
        <H5>Hello</H5>
        <FormsPopup>
          <FormsPopup.CircularCtaButton />
          <FormsPopup.BottomsSheet>
            <FormsPopup.Header title={'Edit name'} />
            <FormsPopup.FormsSubmitButton
              submitClickHandle={context => {
                console.log(context);
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
          title={'+$50'}
        />
        <IconStaticButton title={10} />
      </View>
    </View>
  );
};

export default CardInfoHeader;
