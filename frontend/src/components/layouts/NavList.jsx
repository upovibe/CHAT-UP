import { Link } from 'react-router-dom';
import { Contact, MessageCircle, Clipboard } from 'lucide-react';

const NavList = () => {
  return (
    <ul className="space-x-10 items-center hidden lg:flex">
      <li>
        <Link 
          to="/friends" 
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 font-bold transition-all ease-linear duration-200"
        >
          <Contact className="w-5 h-5 mr-2" />
          My Contacts
        </Link>
      </li>
      <li>
        <Link 
          to="/#" 
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 font-bold transition-all ease-linear duration-200"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Conversation
        </Link>
      </li>
      <li>
        <Link 
          to="/#" 
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 font-bold transition-all ease-linear duration-200"
        >
          <Clipboard className="w-5 h-5 mr-2" />
          Campaign
        </Link>
      </li>
    </ul>
  );
};

export default NavList;
