import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { useEffect, useState } from "react";
  import { FaPlus } from "react-icons/fa6";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import Lottie from "react-lottie";
  import {
    animationDefaultOptions,
    colors,
    GET_ALL_CONTACTS_ROUTE,
    getColor,
    HOST,
    SEARCH_CONTACTS_ROUTE,
  } from "@/utils/constants";
  import { apiClient } from "@/lib/api-client";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/mulitiselect";
  
  function CreateChannel() {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
  
    const [openNewChannelModal, setOpenNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
     const getAllContacts = async () => {
      try {
        const resp = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
            withCredentials:true
        });
        setAllContacts(resp.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllContacts();
    },[])

const createNewChannel = async () => {
    try {
        
    } catch (error) {
        return error;
    }
};

    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaPlus
                className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                onClick={() => setOpenNewChannelModal(true)}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
             Create New Channel
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
  
        <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
            <DialogHeader>
              <DialogTitle>Please fill up the details to create a new channel</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <Input
                placeholder="Channel Name"
                className="rounded-lg p-6 bg-[#2c2e3b] border-none text-white"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
            </div>

            <div>
                <MultipleSelector className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                defaultOptions ={allContacts}
                placeholder="Search Contacts"
                value={selectedContacts}
                onChange={(e) => setSelectedContacts(e)}
                emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600" >No contacts found</p>
                    }
                />
            </div>

            <div>
                <Button
                className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300  "
                onClick={createNewChannel}
                >
                    Create Channel
                </Button>
            </div>
  
            {/* {searchedContacts.length > 0 && (
              <ScrollArea className="h-[250px]">
                <div className="flex flex-col gap-5">
                  {searchedContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => selectNewContact(contact)}
                    >
                      <div className="relative h-12 w-12 ">
                        <Avatar className="h-12 w-12 rounded-full">
                          {contact.img ? (
                            <AvatarImage
                              src={`${HOST}/uploads/profiles/${contact.img}`}
                              alt="profile img"
                              className="w-full object-cover h-full rounded-full bg-black"
                            />
                          ) : (
                            <AvatarFallback
                              className={`uppercase w-32 h-32 md:w-48 md:h-48 rounded-full text-5xl items-center justify-center ${getColor(
                                colors.indexOf(contact.color)
                              )} `}
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
                          )}
                        </Avatar>
                      </div>
  
                      <div className="flex flex-col">
                        <span>
                          {`${contact.first_name ? contact.first_name : "N"} ${
                            contact.last_name ? contact.last_name : "A"
                          }`}
                        </span>
                        <span className="text-xs">{contact.email || ""}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
   */}
            {/* {searchedContacts.length <= 0 && (
              <div className="flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all mt-5 md:mt-0">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={100}
                  width={100}
                  options={animationDefaultOptions}
                />
  
                <div className="text-opacity-80 text-white flex flex-col items-center gap-5 mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                  <h3 className="poppins-medium">
                    Hi<span className="text-purple-500">! </span>
                    Search new
                    <span className="text-purple-500"> contact</span>
                  </h3>
                </div>
              </div>
            )} */}
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  export default CreateChannel;
  