import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef } from "react";

function MessageContainer() {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages } = useAppStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderDMMessages = (message) => {
    return <div
    className={`
      ${message.sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 " : "bg-[#2a2b33]/5 text-white/80 border-white/20"}
       border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
    >
      {message.content}
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
