import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { cashAppColRef } from '@config/firebaseRefs';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import { subAdminColRef } from '@config/firebaseRefs';

const useSubadminsStore = create(
  immer(set => {
    return {
      isFetchingSubadminsData: false,
      subadminsList: [],

      fetchAllSubadmins: async () => {
        set(state => {
          state.isFetchingSubadminsData = true;
          state.subadminsList = [];
        });
        const subadminDocRef = await getDocs(
          query(subAdminColRef, orderBy('username', 'asc'))
        );
        const fetchedSubadmins = [];
        subadminDocRef.forEach(doc => {
          fetchedSubadmins.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        set(state => {
          state.isFetchingSubadminsData = false;
          state.subadminsList = fetchedSubadmins;
        });
      },
    };
  })
);

export default useSubadminsStore;
