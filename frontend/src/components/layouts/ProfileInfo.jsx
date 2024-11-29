import { Calendar, Facebook, Mail, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/store/useAuth";
import { format } from "date-fns";

function ProfileInfo() {
  const { authUser } = useAuth();

  if (!authUser) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Loading profile...</p>
      </div>
    );
  }

  const { fullName, bio, email, userName, phoneNumber, avatar, createdAt } =
    authUser;

  return (
    <div>
      {/* Header */}
      <div className="p-4 border-b-2 flex items-center justify-between">
        <h2 className="md:text-lg font-bold whitespace-nowrap">Profile Info</h2>
        <User className="size-5 text-gray-500 hidden lg:block" />
      </div>

      {/* Profile Details */}
      <div className="grid place-items-center text-center gap-4 border-b-2 py-5">
        <Avatar className="size-20">
          <AvatarImage
            src={avatar || "https://via.placeholder.com/150"}
            alt={fullName || "Avatar"}
          />
          <AvatarFallback>
            {(fullName || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="grid">
          <h3 className="whitespace-nowrap font-bold text-gray-900">
            {fullName || "N/A"}
          </h3>
          <p className="px-2 text-sm text-gray-500">
            {bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Accordion for Additional Info */}
      <Accordion type="multiple" collapsible>
        {/* Contact Section */}
        <AccordionItem value="item-1" className="px-4">
          <AccordionTrigger>Contact</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {/* Username */}
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-24">
                <Mail className="size-4" />
                <span>Username</span>
              </div>
              <p className="font-bold text-gray-800">
                {userName || "Not provided"}
              </p>
            </div>
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-24">
                <Phone className="size-4" />
                <span>Phone</span>
              </div>
              <p className="font-bold text-gray-800">
                {phoneNumber || "Not provided"}
              </p>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-24">
                <Mail className="size-4" />
                <span>Email</span>
              </div>
              <p className="font-bold text-gray-800">
                {email || "Not provided"}
              </p>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-24">
                <Calendar className="size-4" />
                <span>Created</span>
              </div>
              <p className="font-bold text-gray-800">
                {createdAt
                  ? format(new Date(createdAt), "MMM dd, yyyy h:mm a")
                  : "N/A"}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Socials Section */}
        <AccordionItem value="item-2" className="px-4">
          <AccordionTrigger>Socials</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {/* Facebook */}
            <div className="flex items-start gap-4">
              <div className="text-gray-500 flex items-start gap-1 font-semibold w-24">
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

export default ProfileInfo;
