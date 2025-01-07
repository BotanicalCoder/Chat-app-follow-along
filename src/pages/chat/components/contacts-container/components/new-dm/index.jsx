import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
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
  getColor,
  HOST,
  SEARCH_CONTACTS_ROUTE,
} from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";

function NewDM() {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (term) => {
    try {
      if (term.length > 0) {
        const resp = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          {
            term,
          },

          {
            withCredentials: true,
          }
        );

        if (resp.status === 200 && resp.data.data.length > 0) {
          setSearchedContacts(resp.data.data);
        } else {
          setSearchedContacts([]);
        }
      }
    } catch (error) {
      console.log(error);
      setSearchedContacts([]);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none text-white"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 && (
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

          {searchedContacts.length <= 0 && (
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM;
