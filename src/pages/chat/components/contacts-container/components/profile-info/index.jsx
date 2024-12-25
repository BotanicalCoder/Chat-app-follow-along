import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaEdit } from "react-icons/fa";
import { IoPowerSharp } from "react-icons/io5";
import { useAppStore } from "@/store";
import { colors, getColor, HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

function ProfileInfo() {
  const { userInfo, setUserInfo } = useAppStore();

  const { first_name, last_name, img, color } = userInfo;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const resp = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );

      if (resp.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);

      toast.error("Unable to logout");
    }
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="relative h-12 w-12 ">
          <Avatar className="h-12 w-12 rounded-full">
            {img ? (
              <AvatarImage
                src={`${HOST}/uploads/profiles/${img}`}
                alt="profile img"
                className="w-full object-cover h-full rounded-full bg-black"
              />
            ) : (
              <AvatarFallback
                className={`uppercase w-32 h-32 md:w-48 md:h-48 rounded-full text-5xl items-center justify-center ${getColor(
                  colors.indexOf(color)
                )} `}
              >
                {`${first_name ? first_name.charAt(0) : "N"} ${
                  last_name ? last_name.charAt(0) : "A"
                }`}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div>
          {first_name && last_name ? (
            <h1 className="text-white font-bold">
              {first_name} {last_name}
            </h1>
          ) : (
            <h1 className="text-white font-bold">Anonymous</h1>
          )}
        </div>
      </div>

      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaEdit
                className="text-purple-500 text-xl font-medium"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl font-medium"
                onClick={handleLogout}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
