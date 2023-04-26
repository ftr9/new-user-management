import { View, Text } from 'react-native';

import useCaStore from '@store/useCaStore';
import useTransactionStore from '@store/useTransactionStore';

import { useRouter, useSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  getDoc,
  increment,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';
import { H3, H4 } from '@components/common/typography/heading';
import usePlatformsStore from '@store/usePlatformsStore';
import LoadingIndication from '@components/common/Loading';
import { P3 } from '@components/common/typography/text';
import { Divider } from '@rneui/themed';
import moment from 'moment';
import NormalButton from '@components/common/buttons/cta/NormalButton';
import { tertiaryColor } from '@constants/color';
import {
  cashAppDocRef,
  platformDocRef,
  platformTransactionDocRef,
} from '@config/firebaseRefs';
import AreYouSure from '@components/common/popup/AreYouSure';
import { db } from '@config/firebase';

const DeleteTransaction = () => {
  const { TransactionId } = useSearchParams();
  const { getTransaction, isFetchingTransaction, singleTransaction } =
    useTransactionStore();
  const { activePlatformId } = usePlatformsStore();
  const { expandedActiveCaCard } = useCaStore();
  const router = useRouter();

  useEffect(() => {
    getTransaction(activePlatformId, TransactionId);
  }, []);

  if (isFetchingTransaction) {
    return <LoadingIndication title={'Fetching Transaction !!!'} />;
  }

  if (Object.values(singleTransaction).length === 0) {
    <View className="flex-1 justify-between items-center">
      <Text>Transaction Does not exists !!</Text>
    </View>;
  }

  const singleTransactionUsername = singleTransaction?.userName?.split('(')[0];
  const singleTransactionRemarks = singleTransaction?.userName?.split('(')[1];

  return (
    <View className="">
      <View className="my-3">
        <H4 color={'text-tertiary'}>Update Transaction</H4>
      </View>
      <View
        className={` p-2 ${
          singleTransaction.isCashIn ? 'bg-primary-20' : 'bg-tertiary-20'
        } rounded-xl ${
          singleTransaction.isCashIn ? 'bg-primary20' : 'bg-tertiary20'
        }`}
      >
        <P3 color={'text-primary'}>Username : {singleTransactionUsername}</P3>
        <View className="my-1">
          <P3 color={'text-quaternary'}>
            Date :{moment(singleTransaction?.createdAt).format('LL')} .{' '}
            {moment(singleTransaction?.createdAt).format('LT')}
          </P3>
        </View>

        <P3 color={'text-quaternary'}>Amount : {singleTransaction.amount}</P3>

        <View className="my-1">
          <P3 color={'text-quaternary'}>
            Remarks :{' '}
            {singleTransactionRemarks?.slice(
              0,
              singleTransactionRemarks.length - 1
            )}
          </P3>
        </View>

        <Divider
          width={0.5}
          style={{
            width: '80%',
            marginVertical: 15,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          color="#228B22"
        ></Divider>
        {!singleTransaction.isDeleted && (
          <AreYouSure>
            <AreYouSure.CtaNormalBtn
              title={'Delete'}
              bgColor={tertiaryColor}
            ></AreYouSure.CtaNormalBtn>
            <AreYouSure.BottomSheet
              title={'Delete Transaction'}
              onYesPress={async context => {
                const { setSubmitStatus } = context;
                setSubmitStatus(true);
                try {
                  await runTransaction(db, async transaction => {
                    if (singleTransaction.isCashIn) {
                      const platform = await transaction.get(
                        platformDocRef(activePlatformId)
                      );

                      if (
                        platform.data()?.balances[expandedActiveCaCard]
                          ?.totalBalance < singleTransaction.amount
                      ) {
                        throw new Error('Balance Insufficient.');
                      }

                      ////1) minus the balance of CAsh app
                      transaction.update(cashAppDocRef(expandedActiveCaCard), {
                        totalBalance: increment(-1 * singleTransaction.amount),
                      });

                      ////2) minus the balance of platform
                      transaction.update(platformDocRef(activePlatformId), {
                        [`balances.${expandedActiveCaCard}.totalBalance`]:
                          increment(-1 * singleTransaction.amount),
                      });

                      /////3) update the transaction isDeleted to true;
                      transaction.update(
                        platformTransactionDocRef(
                          activePlatformId,
                          TransactionId
                        ),
                        {
                          isDeleted: true,
                        }
                      );
                    } else {
                      ////1) minus the balance of CAsh app
                      transaction.update(cashAppDocRef(expandedActiveCaCard), {
                        totalBalance: increment(
                          singleTransaction?.isBalanceSold
                            ? Math.abs(singleTransaction.amount)
                            : 0
                        ),
                      });

                      ////2) minus the balance of platform
                      transaction.update(platformDocRef(activePlatformId), {
                        [`balances.${expandedActiveCaCard}.totalBalance`]:
                          increment(
                            singleTransaction?.isBalanceSold
                              ? Math.abs(singleTransaction.amount)
                              : 0
                          ),
                      });

                      /////3) update the transaction isDeleted to true;
                      transaction.update(
                        platformTransactionDocRef(
                          activePlatformId,
                          TransactionId
                        ),
                        {
                          isDeleted: true,
                        }
                      );
                    }
                  });
                  setSubmitStatus(false);
                  alert('Deleted Transaction Successfully.');
                  router.back();
                } catch (err) {
                  alert(err.message);
                  setSubmitStatus(false);
                }
              }}
            ></AreYouSure.BottomSheet>
          </AreYouSure>
        )}
      </View>
    </View>
  );
};

export default DeleteTransaction;
