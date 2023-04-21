import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { CheckBox } from '@rneui/themed';
import { P3 } from '@components/common/typography/text';

const CheckBoxCard = ({
  isDisabled,
  onCheckBoxClicked,
  ischecked,
  id,
  title = '',
}) => {
  const [isChecked, setChecked] = useState(ischecked);

  const checkBoxClickHandle = () => {
    setChecked(!isChecked);
    onCheckBoxClicked(isChecked, id);
  };

  return (
    <View
      className={`${
        isChecked ? 'bg-primary-15' : 'bg-tertiary-15'
      } my-2 rounded-md flex-row justify-between items-center pl-4`}
    >
      <P3 color={'text-quaternary'}>
        {title} {isDisabled && '*(Already Inside)'}
      </P3>
      <CheckBox
        containerStyle={{
          backgroundColor: 'transparent',
          borderRadius: 5,
        }}
        size={20}
        uncheckedColor="#E03131"
        checkedColor="#228B22"
        onPress={checkBoxClickHandle}
        disabled={isDisabled}
        checked={isChecked}
      />
    </View>
  );
};

export default CheckBoxCard;
