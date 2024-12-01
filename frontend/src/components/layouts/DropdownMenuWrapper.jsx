import PropTypes from "prop-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DropdownMenuWrapper = ({ triggerElement, menuItems, className }) => {
  return (
    <DropdownMenu>
      {/* Ensure that the triggerElement is properly handled */}
      <DropdownMenuTrigger asChild>
        {triggerElement}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`w-fit ${className || ""}`}>
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
