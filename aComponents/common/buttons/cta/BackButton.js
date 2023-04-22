import { TouchableOpacity } from 'react-native';

import { Icon } from '@rneui/themed';
import { useRouter, usePathname } from 'expo-router';

const AddPlatformPageRoute = '/pages/admin/platforms/AddPlatform';
const PlatformPageRoute = '/pages/admin/platforms';
const CashInAndOutPageRouteAdmin =
  '/pages/admin/platforms/transactions/CashInAndOut';
const CashInPageRouteAdmin = '/pages/admin/platforms/transactions/CashIn';
const CashOutPageRouteAdmin = '/pages/admin/platforms/transactions/CashOut';
const CashAdminPageRouteAdmin = '/pages/admin/platforms/transactions/Admin';
const AddSubadminPageRoute = '/pages/admin/platforms/AddSubadmin';
const RemoveSubadminPageRoute = '/pages/admin/platforms/RemoveSubadmin';

const BackButton = ({ bgColor }) => {
  const router = useRouter();
  const currentPageName = usePathname();

  return (
    <TouchableOpacity
      onPress={() => {
        if (
          [
            AddPlatformPageRoute,
            CashInAndOutPageRouteAdmin,
            CashInPageRouteAdmin,
            CashOutPageRouteAdmin,
            CashAdminPageRouteAdmin,
            AddSubadminPageRoute,
            RemoveSubadminPageRoute,
          ].includes(currentPageName)
        ) {
          router.replace(PlatformPageRoute);
          return;
        } else if (currentPageName.includes('platforms/DeleteTransaction')) {
          //console.log('?????????');
          router.replace('/pages/admin/platforms/transactions/CashInAndOut');
          return;
        }

        router.back();
      }}
      className={` flex justify-center items-center h-14 w-14 rounded-tl-[40px] rounded-tr-2xl rounded-bl-2xl rounded-br-2xl  ${
        bgColor ? bgColor : 'bg-secondary'
      }`}
    >
      <Icon type="ionicon" name="arrow-back" size={25} />
    </TouchableOpacity>
  );
};

export default BackButton;
