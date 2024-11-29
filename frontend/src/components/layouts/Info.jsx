import { Calendar, Facebook, Mail, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Info() {
  return (
    <div>
      <div className="p-4 border-b-2 flex items-center justify-between">
        <h2 className="md:text-lg font-bold whitespace-nowrap">Info</h2>
        <User className="size-5 text-gray-500 hidden lg:block" />
      </div>
      <div className="grid place-items-center text-center gap-4 border-b-2 py-5">
        <Avatar className="size-20">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid">
          <h3 className="whitespace-nowrap font-bold text-gray-900">
            FullName
          </h3>
          <p className="px-2 text-sm text-gray-500">
            Senior Fullstack Dev at Codetrain
          </p>
        </div>
      </div>
      <Accordion type="multiple" collapsible className="">
        <AccordionItem value="item-1" className="px-4">
          <AccordionTrigger>Contact</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-20">
                <Phone className="size-4" />
                <span>Phone</span>
              </div>
              <p className="font-bold text-gray-800">user@gmail.com</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-20">
                <Mail className="size-4" />
                <span>Email</span>
              </div>
              <p className="font-bold text-gray-800">+233542838165</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-20">
                <Calendar className="size-4" />
                <span>Created</span>
              </div>
              <p className="font-bold text-gray-800">Nov 28, 2024 10 am</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="px-4">
          <AccordionTrigger>Socials</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-20">
                <Facebook className="size-4" />
                <span>Facebook</span>
              </div>
              <p className="font-bold text-gray-800">Promise Uzor</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default Info;
