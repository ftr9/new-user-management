import { Text } from 'react-native';

export const P1 = ({ children, color, weight }) => {
  return (
    <Text
      className={`text-[18px] font-Lato-Regular ${
        color ? color : 'text-secondary'
      } ${weight ? weight : ''} `}
    >
      {children}
    </Text>
  );
};

export const P2 = ({ children, color, weight }) => {
  return (
    <Text
      className={`text-[16px] font-Lato-Regular ${
        color ? color : 'text-secondary'
      } ${weight ? weight : ''} `}
    >
      {children}
    </Text>
  );
};
export const P3 = ({ children, color, weight }) => {
  return (
    <Text
      className={`text-[14px] font-Lato-Regular ${
        color ? color : 'text-secondary'
      } ${weight ? weight : ''} `}
    >
      {children}
    </Text>
  );
};
export const P4 = ({ children, color, weight }) => {
  return (
    <Text
      className={`text-[12px] text-center font-Lato-Regular ${
        color ? color : 'text-secondary'
      } ${weight ? weight : ''} `}
    >
      {children}
    </Text>
  );
};
export const P5 = ({ children, color, weight }) => {
  return (
    <Text
      className={`text-[10px] font-Lato-Regular ${
        color ? color : 'text-secondary'
      } ${weight ? weight : ''} `}
    >
      {children}
    </Text>
  );
};
