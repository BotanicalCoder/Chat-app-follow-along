import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";

function MessageContainer() {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages} = useAppStore();


  useEffect(() => {

    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, {
          id: selectedChatData._id,
        },
      {
        withCredentials: true,
      });


      if (response.data.data) {
        setSelectedChatMessages(response.data.data);
      }
      } catch (error) {
        console.log(error);
      }
    
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
    }
  },[selectedChatData, selectedChatType, setSelectedChatMessages ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderDMMessages = (message) => {

const sender = message.sender._id || message.sender
    return <div
    className={`${ sender !== selectedChatData._id ? "text-left" : "text-right"}
     `}
    >{
      message.messageType==='text'&&  <div
        className={`
          ${ sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 " : "bg-[#2a2b33]/5 text-white/80 border-white/20"}
          border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>}

        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
    </div>
  }

  const renderMessages = () => {
    let lastDate=null;
    return selectedChatMessages.map((message, index) => {
      // TODO change to date-fns
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");

      const showDate = lastDate !== messageDate;
      lastDate = messageDate;

      return <div key={message._id+index} >
          {showDate && <div className="text-center text-gray-500 my-2 ">{moment(message.timestamp).format("LL")}</div>}

          {
            selectedChatType ==="contact" && renderDMMessages(message)
          }
      </div>
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full md:w-[65vw] lg:w-[70vw] xl:w-full">
      {renderMessages()}

      <div ref={scrollRef} />
    </div>
  );
}

export default MessageContainer;
