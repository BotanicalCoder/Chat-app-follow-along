import { useAppStore } from "@/store";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  colors,
  DELETE_PROFILE_IMAGE_ROUTE,
  getColor,
  HOST,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

function Profile() {
  const { userInfo, setUserInfo } = useAppStore();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const validateProfile = () => {
    if (firstName === "" || lastName === "") {
      toast.error("first name and last name are required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    try {
      if (!validateProfile()) return;

      const resp = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        {
          first_name: firstName,
          last_name: lastName,
          image,
          color: colors[selectedColor],
        },
        {
          withCredentials: true,
        }
      );

      if (resp.status === 200) {
        toast.success("Profile updated successfully");
        setUserInfo(resp.data.data);
        navigate("/chat");
      } else {
        toast.error(resp.data.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.first_name);
      setLastName(userInfo.last_name);
      setImage(
        userInfo.img ? `${HOST}/uploads/profiles/${userInfo.img}` : null
      );
      setSelectedColor(colors.indexOf(userInfo.color));
    }
  }, [userInfo]);

  const handleNavigate = () => {
    if (userInfo.profile_setup) {
      navigate("/chat");
      return;
    }
    toast.error("Please complete your profile setup");
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        // add  image preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImage(reader.result);
        };

        // send the image to the server
        const formData = new FormData();
        formData.append("profile-image", file);

        const resp = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });

        if (resp.status === 200) {
          toast.success("Profile image updated successfully");
          setUserInfo(resp.data.data);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
      setImage(null);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const resp = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (resp.status === 200) {
        setImage(null);
        setUserInfo(resp.data.data);
        toast.success("Profile image deleted successfully");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Unable to delete image");
    }
  };

  return (
    <div className="bg-[#1b1c24] h-screen flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-white/90 text-4xl lg:text-6xl cursor-pointer"
            onClick={handleNavigate}
          />
        </div>

        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:h-48 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile img"
                  className="w-full object-cover h-full rounded-full bg-black"
                />
              ) : (
                <AvatarFallback
                  className={`uppercase w-32 h-32 md:w-48 md:h-48 rounded-full text-5xl items-center justify-center ${getColor(
                    selectedColor
                  )} `}
                >
                  {`${firstName ? firstName.charAt(0) : "N"} ${
                    lastName ? lastName.charAt(0) : "A"
                  }`}
                </AvatarFallback>
              )}
            </Avatar>

            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                {image ? (
                  <FaTrash
                    className="text-white text-3xl cursor-pointer"
                    onClick={handleDeleteImage}
                  />
                ) : (
                  <FaPlus
                    className="text-white text-3xl cursor-pointer"
                    onClick={handleFileInputClick}
                  />
                )}
              </div>
            )}

            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef}
              name="profile-image"
              accept=".png .jpg .jpeg .svg .webp"
            />
          </div>

          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 !text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                value={userInfo.email}
                disabled
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>

            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`h-8 w-8 rounded-full transition-all duration-300 ${color} cursor-pointer ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-2"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                />
              ))}
            </div>
          </div>
          <div className="w-full">
            <Button
              className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
