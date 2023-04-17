import { Text } from 'react-native';

export const H1 = ({ children, color }) => {
  return (
    <Text
      className={`text-[28px] font-Lato-bold font-extrabold ${
        color ? color : 'text-secondary'
      }`}
    >
      {children}
    </Text>
  );
};
export const H2 = ({ children, color }) => {
  return (
    <Text
      className={`text-[26px] font-Lato-bold font-extrabold ${
        color ? color : 'text-secondary'
      }`}
    >
      {children}
    </Text>
  );
};
export const H3 = ({ children, color }) => {
  return (
    <Text
      className={`text-[24px] font-Lato-bold font-extrabold ${
        color ? color : 'text-secondary'
      }`}
    >
      {children}
    </Text>
  );
};
export const H4 = ({ children, color }) => {
  return (
    <Text
      className={`text-[22px] font-Lato-bold font-extrabold ${
        color ? color : ''
      }`}
    >
      {children}
    </Text>
  );
};
export const H5 = ({ children, color }) => {
  return (
    <Text
      className={`text-[20px] font-Lato-bold font-extrabold ${
        color ? color : ''
      }`}
    >
      {children}
    </Text>
  );
};
export const H6 = ({ children, color }) => {
  return (
    <Text
      className={`text-[18px] font-Lato-bold font-extrabold ${
        color ? color : ''
      }`}
    >
      {children}
    </Text>
  );
};
export const H7 = ({ children, color }) => {
  return (
    <Text
      className={`text-[16px] font-Lato-bold font-extrabold ${
        color ? color : ''
      }`}
    >
      {children}
    </Text>
  );
};
export const H8 = ({ children, color }) => {
  return (
    <Text
      className={`text-[14px] font-Lato-bold font-extrabold ${
        color ? color : ''
      }`}
    >
      {children}
    </Text>
  );
};
