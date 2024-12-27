import { Calendar, Facebook, Mail, Phone, User, UserCheck, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import Loading from "@/components/ui/Loading";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { useAuth } from "@/stores/useAuth";

const ProfileInfo = ({ selectedProfile, onClose }) => {
  const { visibilityPreferences } = useAuth();

  if (!selectedProfile) {
    return <Loading />;
  }

  const { fullName, bio, email, userName, phoneNumber, avatar, createdAt } = selectedProfile;

  return (
    <div className="h-[calc(100vh-4.1rem)] flex flex-col">
      {/* Header */}
      <div className="px-3 h-14 border-b-2 flex items-center justify-between">
        <h2 className="md:text-lg font-bold whitespace-nowrap">Profile Info</h2>
        {/* Close button for large screens */}
        <Button
          className="rounded-full size-9 hidden lg:flex items-center" variant="outline"
          onClick={onClose}
        >
          <X className="size-5 " />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto">
        {/* Profile Details */}
        <div className="grid place-items-center text-center gap-4 border-b-2 py-5">
          <Avatar className="size-20 border-4 border-blue-500">
            <AvatarImage src={avatar} />
            <AvatarFallback>
              {fullName
                ? `${fullName.charAt(0)}${fullName.split(" ")[1]?.charAt(0)}`
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="grid">
            <h3 className="whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">
              {fullName || "N/A"}
            </h3>
            <p className="px-2 text-sm text-gray-500">
              {bio || "No bio available"}
            </p>
          </div>
        </div>

        {/* Accordion for Additional Info */}
        <Accordion type="multiple" collapsible="true">
          {/* Contact Section */}
          <AccordionItem value="item-1" className="px-4">
            <AccordionTrigger>Contact</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              {/* Email */}
              {visibilityPreferences?.showEmail && (
                <div className="flex items-start gap-4">
                  <div className="text-gray-500 flex items-center gap-2 font-semibold w-24">
                    <Mail className="size-4" />
                    <span>Email</span>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="font-bold text-gray-800 dark:text-gray-400 whitespace-nowrap hover:underline"
                  >
                    {email || "Not provided"}
                  </a>
                </div>
              )}
              {/* Username */}
              <div className="flex items-start gap-4">
                <div className="text-gray-500 flex items-center gap-2 font-semibold w-24">
                  <User className="size-4" />
                  <span>Username</span>
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-400 whitespace-nowrap">
                  {userName || "Not provided"}
                </p>
              </div>
              {/* Phone */}
              {visibilityPreferences?.showPhone && (
                <div className="flex items-start gap-4">
                  <div className="text-gray-500 flex items-center gap-2 font-semibold w-24">
                    <Phone className="size-4" />
                    <span>Phone</span>
                  </div>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="font-bold text-gray-800 dark:text-gray-400 whitespace-nowrap hover:underline"
                  >
                    {phoneNumber || "Not provided"}
                  </a>
                </div>
              )}

              {/* Created At */}
              <div className="flex items-start gap-4">
                <div className="text-gray-500 flex items-center gap-2 font-semibold w-24">
                  <Calendar className="size-4" />
                  <span>Created</span>
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-400 whitespace-nowrap">
                  {createdAt
                    ? format(new Date(createdAt), "MMM dd, yyyy h:mm a")
                    : "N/A"}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Account Status */}
          {visibilityPreferences?.showStatus && (
            <AccordionItem value="item-3" className="px-4">
              <AccordionTrigger>Status</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                {/* Account Status */}
                <div className="flex items-start gap-4">
                  <div className="text-gray-500 flex text-left items-center gap-2 font-semibold w-24">
                    <UserCheck className="size-4" />
                    <span>Account</span>
                  </div>
                  <p className="font-bold text-green-500 whitespace-nowrap flex items-center gap-1">
                    <span className="size-2 bg-green-500 rounded-full"></span>Active
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Socials Section */}
          <AccordionItem value="item-2" className="px-4">
            <AccordionTrigger>Socials</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              {/* Facebook */}
              <div className="flex items-start gap-4">
                <div className="text-gray-500 flex items-start gap-2 font-semibold w-24">
                  <Facebook className="size-4" />
                  <span>Facebook</span>
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-400 whitespace-nowrap">
                  Promise Uzor
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

ProfileInfo.propTypes = {
  selectedProfile: PropTypes.object, // Profile data (either authenticated user or friend)
  onClose: PropTypes.func.isRequired,
};

export default ProfileInfo;

