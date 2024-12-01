import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { FilterIcon } from "lucide-react";
  
  const Filter = () => {
    return (
      <div className="p-4 border-b flex items-center justify-between">
        {/* Left dropdown: Display options (hidden on smaller screens) */}
        <div className="">
          <Select>
            <SelectTrigger className="w-fit focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Paginate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5-open">5 Open</SelectItem>
              <SelectItem value="10-open">10 Open</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>
  
        {/* Right dropdown: Filter options */}
        <Select>
          <div>
            <SelectTrigger className="w-fit focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder={<div className="whitespace-nowrap flex items-center gap-1">
                <span>Filter by</span><FilterIcon className="size-3 text-gray-500" />
                </div>} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="5-days">Last 5 Days</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
            </SelectContent>
          </div>
        </Select>
      </div>
    );
  };
  
  export default Filter;
  