import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { platformColRef } from '@config/firebaseRefs';
import { documentId, getDocs, orderBy, query, where } from 'firebase/firestore';

const usePlatformsStore = create(
  immer((set, get) => {
    return {
      platformsList: [],
      allPlatformsList: [],
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
        const { platformListIds } = get();
        if (platformListIds.length === 0) {
          set(state => ({
            ...state,
            platformsList: [],
          }));
          return;
        }
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
      fetchAllPlatforms: async () => {
        set(state => ({
          ...state,
          isFetchingPlatforms: true,
          allPlatformsList: [],
        }));
        ////2) get data from firestore
        const datas = await getDocs(query(platformColRef, orderBy('name')));
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
          allPlatformsList: fetchedPlatforms,
        }));
      },
    };
  })
);

export default usePlatformsStore;
