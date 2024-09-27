import { ListFilter } from "lucide-react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
  
interface TableFilterDropdownProps {
    selectedStatus:string;
    setSelectedStatus:(value: string) => void;
    filterOptions: any;
};

  export default function TableFilterDropdown({filterOptions, selectedStatus, setSelectedStatus} : TableFilterDropdownProps) {
  
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ListFilter className="w-4 h-4" />
            {selectedStatus ? filterOptions.find((f:any) => f.value === selectedStatus)?.label : "Filter"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuLabel>Select a Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filterOptions.map((option:any) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => setSelectedStatus(option.value)}
              className={selectedStatus === option.value ? "bg-gray-100" : ""}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  