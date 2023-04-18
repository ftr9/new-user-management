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
    };
  })
);

export default useUserData;
