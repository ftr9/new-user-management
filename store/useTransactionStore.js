import { platformTransactionColRef } from '@config/firebaseRefs';
import { orderBy, where, getDocs, query, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { platformTransactionDocRef } from '@config/firebaseRefs';

const useTransactionStore = create(
  immer(set => {
    return {
      isFetchingTransaction: true,
      singleTransaction: {},
      transactionList: [],
      transactionCashInList: [],
      transactionCashOutList: [],
      transactionAdminList: [],
      getTransaction: async (platformId, transactionId) => {
        set(state => {
          state.isFetchingTransaction = true;
        });
        const transactionDoc = await getDoc(
          platformTransactionDocRef(platformId, transactionId)
        );
        set(state => {
          state.singleTransaction = {
            id: transactionDoc.id,
            ...transactionDoc.data(),
            createdAt: transactionDoc.data().createdAt?.toDate(),
          };
          state.isFetchingTransaction = false;
        });
      },
      fetchTransaction: async (query, transactionType) => {
        set(state => {
          state.isFetchingTransaction = true;
          if (transactionType === 'CASHIN&OUT') {
            state.transactionList = [];
          } else if (transactionType === 'CASHIN') {
            state.transactionCashInList = [];
          } else if (transactionType === 'CASHOUT') {
            state.transactionCashOutList = [];
          } else if (transactionType === 'ADMIN') {
            state.transactionAdminList = [];
          }
        });

        const transactionData = await getDocs(query);

        let fetchedTransactionData = [];
        transactionData.forEach(transactionDoc => {
          fetchedTransactionData.push({
            id: transactionDoc.id,
            ...transactionDoc.data(),
            createdAt: transactionDoc.data()?.createdAt?.toDate(),
          });
        });

        set(state => {
          state.isFetchingTransaction = false;
          if (transactionType === 'CASHIN&OUT') {
            state.transactionList = fetchedTransactionData;
          } else if (transactionType === 'CASHIN') {
            state.transactionCashInList = fetchedTransactionData;
          } else if (transactionType === 'CASHOUT') {
            state.transactionCashOutList = fetchedTransactionData;
          } else if (transactionType === 'ADMIN') {
            state.transactionAdminList = fetchedTransactionData;
          }
        });
      },
    };
  })
);

export default useTransactionStore;
