import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ContactsContainer from "./components/contacts-container";

function Chat() {
  const { userInfo, selectedChatType, 
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
   } = useAppStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profile_setup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">

    {
      isUploading && <div
      className="h-screen w-screen fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg"
      >
          <h5 className="text-5xl animate-pulse" >
              Uploading file...
          </h5>

          {
            fileUploadProgress
          }%

        </div>
    }

  {
      isDownloading && <div
      className="h-screen w-screen fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg"
      >
          <h5 className="text-5xl animate-pulse" >
              Downloading file...
          </h5>

          {
            fileDownloadProgress
          }%
          
        </div>
    }

      <ContactsContainer />

      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default Chat;
