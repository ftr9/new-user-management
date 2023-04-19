import { platformTransactionColRef } from '@config/firebaseRefs';
import { orderBy, where, getDocs, query } from 'firebase/firestore';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useTransactionStore = create(
  immer(set => {
    return {
      isFetchingTransaction: true,
      transactionList: [],
      fetchTransaction: async (documentId, caId) => {
        set(state => {
          state.isFetchingTransaction = true;
        });

        const transactionData = await getDocs(
          query(
            platformTransactionColRef(documentId),
            where('caId', '==', caId),
            orderBy('createdAt', 'desc')
          )
        );
        let fetchedTransactionData = [];
        transactionData.forEach(transactionDoc => {
          fetchedTransactionData.push({
            id: transactionDoc.id,
            ...transactionDoc.data(),
          });
        });

        set(state => {
          state.isFetchingTransaction = false;
          state.transactionList = fetchedTransactionData;
        });
      },
    };
  })
);

export default useTransactionStore;
