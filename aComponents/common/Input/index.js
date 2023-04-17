import { useEffect, useRef } from 'react';
import { Input } from '@rneui/themed';
import { primaryColor } from '@constants/color';

const InputField = ({
  label,
  placeholder,
  errorMessage,
  hasError,
  canBeFocused,
  onChangeText,
  value,
  isNumericType,
  secureTextEntry,
  maxLength,
}) => {
  const inputRef = useRef();
  useEffect(() => {
    if (canBeFocused) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, []);
  return (
    <Input
      secureTextEntry={secureTextEntry ? true : false}
      keyboardType={isNumericType ? 'numeric' : 'default'}
      selectionColor={primaryColor}
      maxLength={maxLength ? maxLength : 15}
      value={value}
      onChangeText={onChangeText}
      ref={inputRef}
      containerStyle={InputFieldStyle.containerStyle}
      inputContainerStyle={InputFieldStyle.inputContainerStyle}
      errorStyle={[
        InputFieldStyle.errorStyle,
        { marginBottom: hasError ? 25 : 0 },
      ]}
      inputStyle={InputFieldStyle.inputStyle}
      labelStyle={InputFieldStyle.labelStyle}
      label={label}
      placeholder={placeholder}
      errorMessage={hasError ? errorMessage : ''}
    />
  );
};

export default InputField;

const InputFieldStyle = {
  containerStyle: {
    paddingHorizontal: 12,
  },
  inputContainerStyle: {
    borderWidth: 0.5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: 'rgba(24,139,24,0.15)',
    backgroundColor: 'rgba(34,139,34,0.15)',
  },
  errorStyle: {
    fontWeight: '300',
    fontSize: 12,
  },
  inputStyle: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
  },
  labelStyle: {
    color: 'black',
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    fontWeight: 100,
  },
};
