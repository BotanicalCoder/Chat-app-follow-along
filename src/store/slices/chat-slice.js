
export const createChatSlice = (
  set,
  get
) => ({
  selectedChatType: undefined,
  directMessagesContact: [],
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
      directMessagesContact: [],
    })),
    addMessage: (message) => {

    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType =  get().selectedChatType;

    set({
      selectedChatMessages:[
        ...selectedChatMessages,
        {
          ...message,
          recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
        }
      ]
    })
   
  },
  setDirectMessagesContact: (dmContacts) =>
    set(() => ({ directMessagesContact: dmContacts })),
  isUploading:false,
  isDownloading:false,
  fileUploadProgress:0,
  fileDownloadProgress:0,
  setIsUploading: (isUploading) =>
    set(() => ({ isUploading })),
  setIsDownloading: (isDownloading) =>
    set(() => ({ isDownloading })),
  setFileUploadProgress: (fileUploadProgress) =>
    set(() => ({ fileUploadProgress })),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set(() => ({ fileDownloadProgress })),
});
