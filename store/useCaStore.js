import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cashAppColRef } from '@config/firebaseRefs';
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
        if (caIds.length === 0) {
          set(state => ({
            ...state,
            caList: [],
          }));
          return;
        }
        set(state => {
          state.isFetchingCa = true;
          caList = [];
        });

        const datas = await getDocs(
          query(cashAppColRef, where(documentId(), 'in', caIds.slice(0, 10)))
        );
        const fetchedCashApps = [];
        datas.forEach(caDocs => {
          fetchedCashApps.push({ ...caDocs.data(), id: caDocs.id });
        });
        ////if caIds is more than 10
        if (caIds.length > 10) {
          const moreDatas = await getDocs(
            query(cashAppColRef, where(documentId(), 'in', caIds.slice(10, 20)))
          );
          moreDatas.forEach(caDocs => {
            fetchedCashApps.push({ ...caDocs.data(), id: caDocs.id });
          });
        }
        ////if caIds is more than 20
        if (caIds.length > 20) {
          const moreDatas = await getDocs(
            query(cashAppColRef, where(documentId(), 'in', caIds.slice(20, 30)))
          );
          moreDatas.forEach(caDocs => {
            fetchedCashApps.push({ ...caDocs.data(), id: caDocs.id });
          });
        }
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
