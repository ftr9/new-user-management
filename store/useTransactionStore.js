import { platformTransactionColRef } from '@config/firebaseRefs';
import { orderBy, where, getDocs, query, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { platformTransactionDocRef } from '@config/firebaseRefs';
import { transactionLimit } from '@constants/transactionSize';

const useTransactionStore = create(
  immer(set => {
    return {
      isFetchingTransaction: true,
      singleTransaction: {},
      transactionList: [],
      transactionCashInList: [],
      transactionCashOutList: [],
      transactionAdminList: [],
      ////for pagination stuff
      lastVisibleTransaction: null,
      isPaginatingTransactions: false,
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

        //console.log(transactionType);
        const transactionData = await getDocs(query);

        //console.log(transactionData.query);

        let fetchedTransactionData = [];
        transactionData.forEach(transactionDoc => {
          fetchedTransactionData.push({
            id: transactionDoc.id,
            ...transactionDoc.data(),
            createdAt: transactionDoc.data()?.createdAt?.toDate(),
          });
        });

        //console.log(fetchedTransactionData);

        set(state => {
          if (transactionType === 'CASHIN&OUT') {
            state.transactionList = fetchedTransactionData;
          } else if (transactionType === 'CASHIN') {
            state.transactionCashInList = fetchedTransactionData;
          } else if (transactionType === 'CASHOUT') {
            state.transactionCashOutList = fetchedTransactionData;
          } else if (transactionType === 'ADMIN') {
            state.transactionAdminList = fetchedTransactionData;
          }
          state.lastVisibleTransaction =
            transactionData.size === transactionLimit
              ? transactionData.docs[transactionData.docs.length - 1]
              : null;
          state.isFetchingTransaction = false;
        });
      },
      loadMoreTransaction: async (query, transactionType) => {
        set(state => ({ ...state, isPaginatingTransactions: true }));
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
          if (transactionType === 'CASHIN&OUT') {
            state.transactionList = [
              ...state.transactionList,
              ...fetchedTransactionData,
            ];
          } else if (transactionType === 'CASHIN') {
            state.transactionCashInList = [
              ...state.transactionCashInList,
              ...fetchedTransactionData,
            ];
          } else if (transactionType === 'CASHOUT') {
            state.transactionCashOutList = [
              ...state.transactionCashOutList,
              ...fetchedTransactionData,
            ];
          } else if (transactionType === 'ADMIN') {
            state.transactionAdminList = [
              ...state.transactionAdminList,
              ...fetchedTransactionData,
            ];
          }
          state.lastVisibleTransaction =
            transactionData.size === transactionLimit
              ? transactionData.docs[transactionData.docs.length - 1]
              : null;
          state.isPaginatingTransactions = false;
        });
      },
    };
  })
);

export default useTransactionStore;
