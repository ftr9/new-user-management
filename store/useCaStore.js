import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cashAppColRef, subAdminColRef } from '@config/firebaseRefs';
import { documentId, getDocs, orderBy, query, where } from 'firebase/firestore';

const useCaStore = create(
  immer(set => {
    return {
      caList: [],
      expandedActiveCaCard: '',
      isFetchingCa: false,
      setActiveCaCard: id => {
        set(state => ({ ...state, expandedActiveCaCard: id }));
      },
      unSetActiveCaCard: () => {
        set(state => ({ ...state, expandedActiveCaCard: '' }));
      },
      fetchAdminCa: adminId => {
        return async () => {
          ////1)Set Loading
          set(state => ({ ...state, isFetchingCa: true, caList: [] }));
          ////2) get data from firestore
          const datas = await getDocs(
            query(
              cashAppColRef,
              where('adminId', '==', adminId),
              orderBy('createdAt', 'desc')
            )
          );
          const fetchedCashApps = [];
          datas.forEach(caDocs => {
            fetchedCashApps.push({ ...caDocs.data(), id: caDocs.id });
          });

          set(state => ({
            ...state,
            isFetchingCa: false,
            caList: fetchedCashApps,
          }));
        };
      },
      fetchSubadminCa: async caIds => {
        set(state => {
          state.isFetchingCa = true;
          caList = [];
        });
        const datas = await getDocs(
          query(cashAppColRef, where(documentId(), 'in', caIds))
        );
        const fetchedCashApps = [];
        datas.forEach(caDocs => {
          fetchedCashApps.push({ ...caDocs.data(), id: caDocs.id });
        });
        set(state => ({
          ...state,
          isFetchingCa: false,
          caList: fetchedCashApps,
        }));
      },
    };
  })
);

export default useCaStore;
