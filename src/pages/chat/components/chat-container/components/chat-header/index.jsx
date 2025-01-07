import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { colors, getColor, HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="relative h-12 w-12 ">
            <Avatar className="h-12 w-12 rounded-full">
              {selectedChatData.img ? (
                <AvatarImage
                  src={`${HOST}/uploads/profiles/${selectedChatData.img}`}
                  alt="profile img"
                  className="w-full object-cover h-full rounded-full bg-black"
                />
              ) : (
                <AvatarFallback
                  className={`uppercase w-32 h-32 md:w-48 md:h-48 rounded-full text-5xl items-center justify-center ${getColor(
                    colors.indexOf(selectedChatData.color)
                  )} `}
                >
                  {`${
                    selectedChatData.first_name
                      ? selectedChatData.first_name.charAt(0)
                      : "N"
                  } ${
                    selectedChatData.last_name
                      ? selectedChatData.last_name.charAt(0)
                      : "A"
                  }`}
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          <div>
            {selectedChatType === "contact" &&
              `${selectedChatData.firstName || selectedChatData.email} ${
                selectedChatData.lastName || ""
              }`}
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all "
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
