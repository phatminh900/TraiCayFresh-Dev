"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logOutUser } from "@/services/auth.service";
import { toast } from "sonner";

const Logout = () => {
  const router = useRouter();

  const logout = async () => {
    await logOutUser();
    setTimeout(() => {
      toast.success("Đăng xuất tài khoản thành công");
      router.refresh();
    }, 500);
  };
  return (
    <Button onClick={logout} variant='ghost'>
      Đăng xuất
    </Button>
  );
};

export default Logout;
