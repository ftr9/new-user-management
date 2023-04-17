import { Button } from '@rneui/themed';
import { primaryColor } from '@constants/color';

const NormalButton = ({ title, onClick, color, size, isLoading }) => {
  return (
    <Button
      title={title}
      buttonStyle={{
        backgroundColor: color ? color : primaryColor,
        borderRadius: 50,
        borderWidth: 0,
        paddingVertical: size === 'small' ? 8 : 15,
      }}
      containerStyle={{
        width: '100%',
        borderRadius: 50,
      }}
      loading={isLoading}
      titleStyle={{
        fontWeight: '800',
        fontSize: 14,
        fontFamily: 'Lato-Regular',
      }}
      onPress={onClick}
    />
  );
};

export default NormalButton;
