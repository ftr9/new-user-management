import { View, Text } from 'react-native';
import React from 'react';
import moment from 'moment';
import useTransactionStore from '@store/useTransactionStore';
import { useSearchParams } from 'expo-router';
import LoadingIndication from '@components/common/Loading';
import { useEffect } from 'react';
import usePlatformsStore from '@store/usePlatformsStore';
import useCaStore from '@store/useCaStore';
import { useRouter } from 'expo-router';
import AreYouSure from '@components/common/popup/AreYouSure';
import { Divider } from '@rneui/themed';
import { H4 } from '@components/common/typography/heading';
import { P3 } from '@components/common/typography/text';
import { tertiaryColor } from '@constants/color';
import BackButton from '@components/common/buttons/cta/BackButton';
import DataDisplayContainer from '@components/common/display/DataDisplayContainer';
import useUserData from '@store/useUserData';
import { updateDoc, increment, runTransaction } from 'firebase/firestore';
import {
  cashAppDocRef,
  platformDocRef,
  platformTransactionDocRef,
} from '@config/firebaseRefs';
import { db } from '@config/firebase';

const DeleteTransaction = () => {
  const { transactionId } = useSearchParams();
  const { getTransaction, singleTransaction, isFetchingTransaction } =
    useTransactionStore();
  const { activePlatformId } = usePlatformsStore();
  const { expandedActiveCaCard } = useCaStore();
  const { user } = useUserData();

  const router = useRouter();

  useEffect(() => {
    getTransaction(activePlatformId, transactionId);
  }, []);

  if (isFetchingTransaction) {
    return <LoadingIndication title={'Loading transaction !!!'} />;
  }

  if (Object.values(singleTransaction).length === 0) {
    <View className="flex-1 justify-between items-center">
      <Text>Transaction Does not exists !!</Text>
    </View>;
  }

  const singleTransactionUsername = singleTransaction?.userName?.split('(')[0];
  const singleTransactionRemarks = singleTransaction?.userName?.split('(')[1];

  return (
    <DataDisplayContainer>
      <View className="my-3">
        <BackButton bgColor={'bg-primary-20'} />
      </View>

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
        {!singleTransaction.isDeleted &&
          singleTransaction.userId === user.id && (
            <AreYouSure>
              <AreYouSure.CtaNormalBtn
                title={'Delete'}
                bgColor={tertiaryColor}
              ></AreYouSure.CtaNormalBtn>
              <AreYouSure.BottomSheet
                title={'Delete Transaction'}
                onYesPress={async context => {
                  const { setSubmitStatus, setPopupVisible } = context;
                  setSubmitStatus(true);
                  try {
                    await runTransaction(db, async transaction => {
                      if (singleTransaction.isDeleted) {
                        throw new Error('the transaction is already deleted');
                      }
                      if (singleTransaction.isCashIn) {
                        const transactionDoc = await transaction.get(
                          platformDocRef(activePlatformId)
                        );

                        if (
                          transactionDoc.data()?.balances[expandedActiveCaCard]
                            .totalBalance < singleTransaction.amount
                        ) {
                          throw new Error('Balance Insufficient.');
                        }

                        ////1) minus the balance of CAsh app
                        transaction.update(
                          cashAppDocRef(expandedActiveCaCard),
                          {
                            totalBalance: increment(
                              -1 * singleTransaction.amount
                            ),
                          }
                        );

                        ////2) minus the balance of platform
                        transaction.update(platformDocRef(activePlatformId), {
                          [`balances.${expandedActiveCaCard}.totalBalance`]:
                            increment(-1 * singleTransaction.amount),
                        });

                        /////3) update the transaction isDeleted to true;
                        transaction.update(
                          platformTransactionDocRef(
                            activePlatformId,
                            transactionId
                          ),
                          {
                            isDeleted: true,
                          }
                        );
                      } else {
                        ////1) minus the balance of CAsh app
                        transaction.update(
                          cashAppDocRef(expandedActiveCaCard),
                          {
                            totalBalance: increment(
                              Math.abs(singleTransaction.amount)
                            ),
                          }
                        );

                        ////2) minus the balance of platform
                        transaction.update(platformDocRef(activePlatformId), {
                          [`balances.${expandedActiveCaCard}.totalBalance`]:
                            increment(Math.abs(singleTransaction.amount)),
                        });

                        /////3) update the transaction isDeleted to true;
                        transaction.update(
                          platformTransactionDocRef(
                            activePlatformId,
                            transactionId
                          ),
                          {
                            isDeleted: true,
                          }
                        );
                      }
                      setSubmitStatus(false);
                      alert('Deleted Transaction Successfully.');
                    });
                    router.back();
                  } catch (e) {
                    alert(e.message);
                    setSubmitStatus(false);
                    setPopupVisible(false);
                  }
                }}
              ></AreYouSure.BottomSheet>
            </AreYouSure>
          )}
      </View>
    </DataDisplayContainer>
  );
};

export default DeleteTransaction;
