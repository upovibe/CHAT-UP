import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ThemeSettings from "@/components/layouts/ThemeSettings";
import AccountSettings from "@/pages/settings/AccountSettings";
import { Palette, UserCog } from "lucide-react";

const Settings = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <UserCog />
            <span>Account</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <AccountSettings />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
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
