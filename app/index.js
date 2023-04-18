import { Redirect } from 'expo-router';

const RootPage = () => {
  return <Redirect href={'/pages/login'} />;
};

export default RootPage;
