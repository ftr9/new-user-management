import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { P3 } from '@components/common/typography/text';

const DottedIconButton = ({
  title,
  onClick,
  bgColor,
  borderColor,
  iconType,
}) => {
  const backgroundColor = bgColor ? bgColor : 'bg-primary-20';
  const bordColor = borderColor ? borderColor : 'border-primary';
  return (
    <TouchableOpacity
      onPress={onClick}
      className={`flex-row px-3 py-2  justify-between border-[0.8px] items-center border-dashed  ${backgroundColor} ${bordColor} `}
    >
      <P3 color={'text-quaternary'} weight={'font-semibold'}>
        {title}
      </P3>
      <View
        className={`${bordColor} border-[1px] ml-2 py-[5px] px-[7px]  border-dotted 
         justify-center items-center`}
      >
        <Icon name={iconType.name} type={iconType.type} size={14} />
      </View>
    </TouchableOpacity>
  );
};

export default DottedIconButton;
