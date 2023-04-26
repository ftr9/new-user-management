import { View, Text, Dimensions, LogBox } from 'react-native';
import React from 'react';
import CardInfoHeader from '../CardInfoHeader';
import DottedIconButton from '@components/common/buttons/cta/DottedIconButton';
import FormsPopup from '@components/common/popup/FormPopUp';
import { H1 } from '@components/common/typography/heading';
import { tertiaryColor } from '@constants/color';
import { useRouter } from 'expo-router';
import AreYouSure from '@components/common/popup/AreYouSure';
import useCaStore from '@store/useCaStore';
import usePlatformsStore from '@store/usePlatformsStore';
import useUserData from '@store/useUserData';
import {
  addDoc,
  arrayRemove,
  collection,
  deleteField,
  getDoc,
  query,
  getDocs,
  increment,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  runTransaction,
  doc,
} from 'firebase/firestore';
import {
  platformColRef,
  platformDocRef,
  cashAppDocRef,
  platformTransactionColRef,
  subAdminColRef,
  subAdminDocRef,
} from '@config/firebaseRefs';
import { db } from '@config/firebase';

/////Warning hide
LogBox.ignoreLogs([
  "@firebase/firestore: Firestore (9.19.1): RestConnection RPC 'Commit'  failed with error: ",
]);

const PlatformCard = props => {
  const { expandedActiveCaCard } = useCaStore();
  const { fetchPlatforms, setActivePlatformId } = usePlatformsStore();
  const router = useRouter();

  return (
    <View className="border-[0.8px] my-3 py-3 px-[6px] border-primary rounded-md">
      <CardInfoHeader
        documentId={props.id}
        title={props.name}
        amount={props?.balances[expandedActiveCaCard]?.totalBalance}
        currentPage={'platforms'}
        userOrGroupsCount={
          props?.balances[expandedActiveCaCard]?.totalSubadmins
        }
        refetchData={fetchPlatforms}
      />
      <View className="flex-row justify-between mt-3 mb-2">
        <View className="w-[49%]">
          <DottedIconButton
            onClick={() => {
              setActivePlatformId(props.id);
              router.push('/pages/admin/platforms/transactions/CashInAndOut');
            }}
            title={'Statements'}
            iconType={{ name: 'document-text-outline', type: 'ionicon' }}
          />
        </View>
        <View className="w-[49%]">
          <PlatformCard.SellBalanceBtn {...props} />
        </View>
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <View className="w-[49%]">
          <PlatformCard.RechargeBtn {...props} />
        </View>
        <View className="w-[49%]">
          <PlatformCard.RedeemBtn {...props} />
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <View className="w-[49%]">
          <PlatformCard.AddSubadmin {...props} />
        </View>
        <View className="w-[49%]">
          <PlatformCard.RemoveSubAdmin {...props} />
        </View>
      </View>

      <View>
        <PlatformCard.DeleteBtn {...props} />
      </View>
    </View>
  );
};

PlatformCard.AddSubadmin = props => {
  const router = useRouter();
  return (
    <DottedIconButton
      onClick={() => {
        router.push(
          `/pages/admin/platforms/AddSubadmin?platformId=${props.id}`
        );
      }}
      title={'Add Subadmin'}
      iconType={{
        type: 'ionicon',
        name: 'person-add-outline',
      }}
    />
  );
};

PlatformCard.RechargeBtn = props => {
  const { id } = props;
  const { user } = useUserData();
  const { expandedActiveCaCard } = useCaStore();
  const { fetchPlatforms } = usePlatformsStore();

  return (
    <FormsPopup>
      <FormsPopup.CtaButton iconName={'add'}>Recharge</FormsPopup.CtaButton>
      <FormsPopup.BottomsSheet>
        <FormsPopup.Header title={'Recharge'} />
        <FormsPopup.FormsNumericInputField
          label={'Enter recharge amount'}
          placeholder={'Recharge Amount'}
        />
        <FormsPopup.FormsTextInputField1
          label={'Enter the remarks (*optional)'}
          placeholder={'Remarks'}
        />
        <FormsPopup.FormsSubmitButton
          submitClickHandle={async context => {
            const {
              inputValue,
              inputValue1,
              setError,
              setSubmitStatus,
              setErrorStatus,
              resetFormsState,
            } = context;
            const value = parseFloat(inputValue);
            if (value <= 0 || isNaN(value)) {
              setError('* Balance should be more than zero.');
              setErrorStatus(true);
              return;
            }

            setSubmitStatus(true);
            ////2) get platform balance
            const platform = await getDoc(platformDocRef(id));
            if (!platform.exists()) {
              alert('failed to recharge !! something went wrong');
              setSubmitStatus(false);
              return;
            }

            ////3) Add to the transaction of platform
            await addDoc(platformTransactionColRef(platform.id), {
              amount: value,
              closingAmount:
                platform.data().balances[expandedActiveCaCard].totalBalance +
                value,
              isDeleted: false,
              caId: expandedActiveCaCard,
              isCashIn: true,
              isAdmin: true,
              userName: `Admin(${inputValue1 ? inputValue1 : 'XXXX'})`,
              userId: user.id,
              createdAt: serverTimestamp(),
            });

            ////4) Add to the total Balance of platforms
            await updateDoc(platformDocRef(id), {
              [`balances.${expandedActiveCaCard}.totalBalance`]:
                increment(value),
            });

            ////5) Add to the total Balance of CA
            await updateDoc(cashAppDocRef(expandedActiveCaCard), {
              totalBalance: increment(value),
            });

            alert(`Recharged ${value}$ successfully.`);
            resetFormsState();

            ////6)fetch again everything
            fetchPlatforms();
          }}
        >
          Recharge
        </FormsPopup.FormsSubmitButton>
      </FormsPopup.BottomsSheet>
    </FormsPopup>
  );
};

PlatformCard.SellBalanceBtn = props => {
  const { id } = props;
  const { user } = useUserData();
  const { expandedActiveCaCard } = useCaStore();
  const { fetchPlatforms } = usePlatformsStore();
  return (
    <FormsPopup>
      <FormsPopup.CtaButton
        bgColor={'bg-tertiary-20'}
        borderColor={'border-tertiary'}
        iconName={'remove-outline'}
      >
        Sell Balance
      </FormsPopup.CtaButton>
      <FormsPopup.BottomsSheet>
        <FormsPopup.Header title={'Sell Balance'} />
        <FormsPopup.FormsNumericInputField
          label={'Enter the selling amount'}
          placeholder={'Selling Amount'}
        />
        <FormsPopup.FormsTextInputField1
          label={'Enter the remarks (*required)'}
          placeholder={'Remarks'}
        />
        <FormsPopup.FormsSubmitButton
          submitClickHandle={async context => {
            const {
              inputValue,
              inputValue1,
              setError,
              setError1,
              setErrorStatus,
              setErrorStatus1,
              setSubmitStatus,
              resetFormsState,
            } = context;
            const amount = parseFloat(inputValue);
            if (amount < 0 || isNaN(amount)) {
              setError('* Amount should not be negative.');
              setErrorStatus(true);
              return;
            }
            if (inputValue1.length === 0) {
              setError1('* Remarks is required');
              setErrorStatus1(true);
              return;
            }
            setSubmitStatus(true);
            try {
              await runTransaction(db, async transaction => {
                /////1) fetch platform
                const platformDoc = await transaction.get(platformDocRef(id));
                if (!platformDoc.exists()) {
                  alert('something went wrong !!! cannot sell balance');
                  return;
                }

                const platformBalance =
                  platformDoc.data().balances[expandedActiveCaCard]
                    .totalBalance;

                if (platformBalance < amount) {
                  throw Error('* Balance Insufficient');
                }

                /////2) add to transaction
                const transactionDoc = doc(platformTransactionColRef(id));
                transaction.set(transactionDoc, {
                  amount: -1 * amount,
                  caId: expandedActiveCaCard,
                  closingAmount: platformBalance - amount,
                  createdAt: serverTimestamp(),
                  isAdmin: true,
                  isCashIn: false,
                  isBalanceSold: true,
                  isDeleted: false,
                  userId: user.id,
                  userName: `Admin(${inputValue1 ? inputValue1 : 'XXXX'})`,
                });

                ////3) update platform Balance
                transaction.update(platformDocRef(id), {
                  [`balances.${expandedActiveCaCard}.totalBalance`]: increment(
                    -1 * amount
                  ),
                });

                ////4) update cash App balance
                transaction.update(cashAppDocRef(expandedActiveCaCard), {
                  totalBalance: increment(-1 * amount),
                });
              });
              setSubmitStatus(false);
              resetFormsState();
              alert(`Sold ${amount}$ successfully`);
              fetchPlatforms();
            } catch (err) {
              setError(err.message);
              setErrorStatus(true);
              setSubmitStatus(false);
            }
          }}
        >
          Sell Balance
        </FormsPopup.FormsSubmitButton>
      </FormsPopup.BottomsSheet>
    </FormsPopup>
  );
};

PlatformCard.RedeemBtn = props => {
  const { id } = props;
  const { user } = useUserData();
  const { expandedActiveCaCard } = useCaStore();

  return (
    <FormsPopup>
      <FormsPopup.CtaButton
        bgColor={'bg-tertiary-20'}
        borderColor={'border-tertiary'}
        iconName={'remove-outline'}
      >
        Redeem
      </FormsPopup.CtaButton>
      <FormsPopup.BottomsSheet>
        <FormsPopup.Header title={'Redeem Balance'} />
        <FormsPopup.FormsNumericInputField
          label={'Enter the redeem amount'}
          placeholder={'Redeem Amount'}
        />
        <FormsPopup.FormsTextInputField1
          label={'Enter the remarks (*optional)'}
          placeholder={'Remarks'}
        />
        <FormsPopup.FormsSubmitButton
          submitClickHandle={async context => {
            const {
              inputValue,
              inputValue1,
              setError,
              setErrorStatus,
              setSubmitStatus,
              resetFormsState,
            } = context;

            const amount = parseFloat(inputValue);

            if (amount <= 0 || isNaN(amount)) {
              setError('* amount cannot be negative or zero');
              setErrorStatus(true);
              return;
            }

            setSubmitStatus(true);
            await addDoc(platformTransactionColRef(id), {
              amount: -1 * amount,
              caId: expandedActiveCaCard,
              closingAmount: 0.0,
              createdAt: serverTimestamp(),
              isAdmin: true,
              isCashIn: false,
              isDeleted: false,
              userId: user.id,
              userName: `Admin ${inputValue1 ? inputValue1 : 'XXXX'}`,
            });
            alert(`Redeemed ${amount}$ successfully.`);
            resetFormsState();
          }}
        >
          Redeem
        </FormsPopup.FormsSubmitButton>
      </FormsPopup.BottomsSheet>
    </FormsPopup>
  );
};

PlatformCard.DeleteBtn = props => {
  const { expandedActiveCaCard } = useCaStore();
  const { platformListIds, setPlatformsListIds, fetchPlatforms } =
    usePlatformsStore();
  const onYesPress = async ctx => {
    const { setPopupVisible, setSubmitStatus } = ctx;

    setSubmitStatus(true);
    ////1) get subadmins
    const totalSubadmins = await getDocs(
      query(
        subAdminColRef,
        where(`balances.${expandedActiveCaCard}`, 'array-contains', props.id)
      )
    );

    const subAdminsId = [];
    totalSubadmins.forEach(data => {
      subAdminsId.push(data.id);
    });

    const batch = writeBatch(db);
    subAdminsId.forEach(subadmin => {
      batch.update(subAdminDocRef(subadmin), {
        [`balances.${expandedActiveCaCard}`]: arrayRemove(props.id),
      });
    });
    await batch.commit();

    ////2) get platform
    const platformDoc = await getDoc(platformDocRef(props.id));

    ////3) update cash App
    await updateDoc(cashAppDocRef(expandedActiveCaCard), {
      platforms: arrayRemove(props.id),
      totalBalance: increment(
        -1 * platformDoc.data().balances[expandedActiveCaCard].totalBalance
      ),
      totalGroups: increment(-1),
    });

    ////4) update platform
    await updateDoc(platformDocRef(props.id), {
      [`balances.${expandedActiveCaCard}`]: deleteField(),
      totalSubadmins: increment(-1 * subAdminsId.length),
    });

    ////5) remove platform Id from platformListID's
    setPlatformsListIds(
      platformListIds.filter(platformId => platformId !== props.id)
    );
    setSubmitStatus(false);
    setPopupVisible(false);
    alert('Removed platform successfully.');
    ////6 fetch all the remaining platforms
    fetchPlatforms();
  };

  return (
    <AreYouSure>
      <AreYouSure.CtaBtn
        iconName={'trash-outline'}
        bgColor={'bg-tertiary-20'}
        borderColor={'border-tertiary'}
      >
        Remove Platform
      </AreYouSure.CtaBtn>
      <AreYouSure.BottomSheet
        onYesPress={onYesPress}
        title={'Are you sure want to remove this platform ?'}
      />
    </AreYouSure>
  );
};

PlatformCard.RemoveSubAdmin = props => {
  const router = useRouter();

  return (
    <DottedIconButton
      title={'Del Subadmin'}
      onClick={() => {
        router.push(
          `/pages/admin/platforms/RemoveSubadmin?platformId=${props.id}`
        );
      }}
      bgColor={'bg-tertiary-20'}
      borderColor={'border-tertiary'}
      iconType={{
        name: 'person-remove-outline',
        type: 'ionicon',
      }}
    />
  );
};

export default PlatformCard;
