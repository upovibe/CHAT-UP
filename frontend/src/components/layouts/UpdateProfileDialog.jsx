import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { UserPen } from "lucide-react";
import EditProfile from "@/pages/settings/EditProfile";

const UpdateDialog = () => {
  return (
    <Dialog>
    <DialogTrigger className="flex items-center gap-2 cursor-pointer px-2 py-1.5 text-sm w-full transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent rounded-md mb-1">
      <UserPen className="size-4" />
      Update Profile
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
          <EditProfile />
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}

export default UpdateDialog