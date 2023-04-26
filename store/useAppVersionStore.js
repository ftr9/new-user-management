import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useAppVersionStore = create(
  immer(set => {
    return {
      appVersion: '',
      setVersion: version => {
        set(state => {
          state.appVersion = version;
        });
      },
    };
  })
);

export default useAppVersionStore;
