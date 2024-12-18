export const createAuthSlice = (set) => ({
  userInfo: undefined,
  seUserInfo: (userInfo) => set({ userInfo }),
});
