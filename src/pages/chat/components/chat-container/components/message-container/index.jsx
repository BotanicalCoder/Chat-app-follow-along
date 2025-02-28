import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {MdFolderZip} from 'react-icons/md';
import {IoMdArrowDown} from 'react-icons/io';
import { IoCloseSharp } from "react-icons/io5";

function MessageContainer() {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages, setIsDownloading, setFileDownloadProgress} = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

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

  const checkIfImage= (filePath)=>{

    const imageRegex= /\.(jpe?g|png|gif|webp|bmp|heic|ico|heif|svg|tiff?)$/i;

    return imageRegex.test(filePath);
  }

  const downloadFile = async (fileURL)=>{
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const response = await apiClient.get(`${HOST}/${fileURL}`, {responseType:'blob', 
        onDownloadProgress:(progressEvent)=>{
          const {loaded, total }= progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        }
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', fileURL.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      return error;
    }finally{
    setIsDownloading(false);
    }
  }

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

      {message.messageType==='file' && <div
        className={`
          ${ sender !== selectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 " : "bg-[#2a2b33]/5 text-white/80 border-white/20"}
          border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
         {checkIfImage(message.fileUrl)?<div className="cursor-pointer"
         onClick={()=>{
          setImageURL(message.fileUrl); 
          setShowImage(true);
        }}
         >
          <img src={`${HOST}/${message.fileUrl}`} alt="file" height={300} width={300} className="object-cover" />
          </div>: 
          
          <div
          className="flex items-center justify-center gap-4"
          >
            <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
            <MdFolderZip className="w-6 h-6" />
            </span>
            <span>
              {message.fileUrl.split('/').pop()}
            </span>
            <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300  " 
            onClick={() => downloadFile(message.fileUrl)}
            >
              <IoMdArrowDown className="w-6 h-6" />
            </span>
          </div>} 
          </div> }

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

      {
        showImage && <div
        className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col"
        > 
          <div>
            <img src={`${HOST}/${imageURL}`} alt="image" className="w-full h-[80vh] bg-cover" />
          </div>

          <div className="flex gap-5 fixed top-0 mt-5" >
          <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300  " 
            onClick={() => downloadFile(`${HOST}/${imageURL}`)}
            >
              <IoMdArrowDown className="w-6 h-6" />
            </button>

            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300  " 
            onClick={() =>{ 
              setShowImage(false);

              setImageURL(null);
            }}
            >
              <IoCloseSharp className="w-6 h-6" />
            </button>
          </div>
        </div>
      }
    </div>
  );
}

export default MessageContainer;
