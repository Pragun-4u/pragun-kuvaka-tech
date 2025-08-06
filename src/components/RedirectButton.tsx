"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { LogOut, MoveUpRight } from "lucide-react";
import { ConfirmDialog } from "./shared/ConfirmDialog";
import { logoutSetCookie } from "@/app/action";
import { toast } from "sonner";

function RedirectButton() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname?.includes("/dashboard");

  const handleLogout = async () => {
    const res = await logoutSetCookie();
    if (res.status) {
      router.push("/");
      toast.success("Logged out successfully!");
    } else {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="flex justify-start items-center gap-4">
      {!isDashboard && (
        <Button
          className="cursor-pointer font-bold"
          onClick={() => router.push("/dashboard")}
        >
          <MoveUpRight className="mr-2 h-4 w-4" />
          <span>View dashboard</span>
        </Button>
      )}
      <ConfirmDialog
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to log in again to access your chatrooms."
        trigger={
          <Button variant="outline" className="cursor-pointer bg-background">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        }
        onConfirm={handleLogout}
        confirmText="Yes, Logout"
        cancelText="No, Cancel"
      />
    </div>
  );
}

export default RedirectButton;
