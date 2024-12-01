import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { SettingsIcon } from "lucide-react";
  import Settings from "@/pages/settings/Settings";
  

const SettingsDialog = () => {
  return (
    <Dialog>
    <DialogTrigger className="flex items-center gap-2 cursor-pointer px-2 py-1.5 text-sm w-full transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent rounded-md">
      <SettingsIcon className="size-4" />
      Setings
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
          <Settings />
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}

export default SettingsDialog