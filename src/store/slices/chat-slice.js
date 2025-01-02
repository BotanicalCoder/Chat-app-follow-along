export const createChatSlice = (
  set
  // get
) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  setSelectedChatType: (chatType) =>
    set(() => ({ selectedChatType: chatType })),
  setSelectedChatData: (chatData) =>
    set(() => ({ selectedChatData: chatData })),
  setSelectedChatMessages: (chatMessages) =>
    set(() => ({ selectedChatMessages: chatMessages })),
  closeChat: () =>
    set(() => ({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    })),
});
