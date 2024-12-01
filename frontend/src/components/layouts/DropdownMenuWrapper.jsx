import PropTypes from "prop-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "lucide-react";

const DropdownMenuWrapper = ({ triggerElement, menuItems, className }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{triggerElement}</DropdownMenuTrigger>
      <DropdownMenuContent className={`absolute w-fit ${className || ""}`}>
        {menuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className={`cursor-pointer whitespace-nowrap ${item.className || ""}`}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick?.(e);
            }}
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2 text-gray-500">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DropdownMenuWrapper.propTypes = {
  triggerElement: PropTypes.node.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      onClick: PropTypes.func,
      className: PropTypes.string,
      disabled: PropTypes.bool,
      icon: PropTypes.node,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default DropdownMenuWrapper;
