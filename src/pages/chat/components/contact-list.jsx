import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { colors, getColor, HOST } from "@/utils/constants";

function ContactList({contacts, isChannel=false}) {
    const {
        selectedChatData, 
        setSelectedChatData, 
        setSelectedChatType, 
        selectedChatType,
        setSelectedChatMessages
    } =  useAppStore();

    const handleClick = (contact) => {
        setSelectedChatData(contact);
        setSelectedChatType(isChannel ? "channel" : "contact");
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }
    };

    return (
        <div
        className="mt-5"
        >
            {
               contacts.map((contact)=>{
                  return  <div
                  key={contact._id}
                  className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff] " : "hover:bg[#f1f1f111]"}`}
                  onClick={()=>handleClick(contact)}
                  > 
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !isChannel && <Avatar
                            className="w-10 h-10 rounded-full"
                            >
                                {
                                    contact.img ? (
                                                    <AvatarImage
                                                      src={`${HOST}/uploads/profiles/${contact.img}`}
                                                      alt="profile img"
                                                      className="w-full object-cover h-full rounded-full bg-black"
                                                    />
                                                  ) : (
                                                    <AvatarFallback
                                                      className={`
                                                        ${
                                                        selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border-2 border-white/50 " : getColor(
                                                            colors.indexOf(contact.color)
                                                          )
                                                        }
                                                        
                                                        uppercase w-10 h-10 rounded-full text-sm items-center justify-center`}
                                                    >
                                                      {`${
                                                        contact.first_name
                                                          ? contact.first_name.charAt(0)
                                                          : "N"
                                                      } ${
                                                        contact.last_name
                                                          ? contact.last_name.charAt(0)
                                                          : "A"
                                                      }`}
                                                    </AvatarFallback>
                                                  )
                                }
                            </Avatar>
                        }

                        {
                           isChannel && <div
                                className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full"
                            >
                                    #
                                </div>
                        }

                        {
                            isChannel ? <span>
                                {contact.name}
                            </span>: <span>
                                {
                                    `${contact.first_name} ${contact.last_name}`
                                }
                            </span>
                        }
                    </div>
                  </div>
               }) 
            }
        </div>
      );
}

export default ContactList;