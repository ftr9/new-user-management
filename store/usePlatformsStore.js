import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { platformColRef } from '@config/firebaseRefs';
import { documentId, getDocs, query, where } from 'firebase/firestore';

const usePlatformsStore = create(
  immer((set, get) => {
    return {
      platformsList: [],
      platformListIds: [],
      activePlatformId: '',
      isFetchingPlatforms: false,
      setActivePlatformId: platformId => {
        set(state => ({ ...state, activePlatformId: platformId }));
      },
      setPlatformsListIds: platformsIds => {
        set(state => ({ ...state, platformListIds: platformsIds }));
      },
      fetchPlatforms: async () => {
        ////1)Set Loading
        set(state => ({
          ...state,
          isFetchingPlatforms: true,
          platformsList: [],
        }));
        ////2) get data from firestore
        const { platformListIds: platformIds } = get();
        const datas = await getDocs(
          query(platformColRef, where(documentId(), 'in', platformIds))
        );
        const fetchedPlatforms = [];
        datas.forEach(platformDoc => {
          fetchedPlatforms.push({
            ...platformDoc.data(),
            id: platformDoc.id,
          });
        });

        set(state => ({
          ...state,
          isFetchingPlatforms: false,
          platformsList: fetchedPlatforms,
        }));
      },
    };
  })
);

export default usePlatformsStore;
