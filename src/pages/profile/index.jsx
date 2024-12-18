import { useAppStore } from "@/store";

function Profile() {
  const { userInfo } = useAppStore();

  console.log(userInfo);

  return <div>Profile</div>;
}

export default Profile;
