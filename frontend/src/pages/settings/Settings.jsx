import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ThemeSettings from "@/components/layouts/ThemeSettings";
import AccountUpdate from "@/pages/settings/AccountUpdate";
import AccountSettings from "@/pages/settings/AccountSettings";
import { Palette, UserCog, UserPen } from "lucide-react";

const Settings = () => {
  return (
      <Accordion type="multiple" collapsible className="w-full h-[95vh] md:h-[70vh] lg:h-[60vh] overflow-auto">
        <div className="border-b pb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className=" text-sm">Manage your account settings.</p>
        </div>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <UserPen />
              <span>Account Update</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AccountUpdate />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <UserCog />
              <span>Account Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AccountSettings />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Palette />
              <span>Theme</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ThemeSettings />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
  );
};

export default Settings;
