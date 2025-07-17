import { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuToggle, title, actions }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="bg-white border-b border-secondary-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-secondary-900">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search students, classes..."
            className="hidden md:block w-80"
          />
          {actions}
        </div>
      </div>
    </header>
  );
};

export default Header;