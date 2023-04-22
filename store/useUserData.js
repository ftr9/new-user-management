import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useUserData = create(
  immer(set => {
    return {
      user: {},
      setUser: fetchedUser => {
        set(state => {
          state.user = fetchedUser;
        });
      },
      unSetUser: () => {
        set(state => {
          state.user = {};
        });
      },
    };
  })
);

export default useUserData;
