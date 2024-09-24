import React, { useState } from "react";
import Select from "react-select";
import "./styles/Collection.css";

import SquirrelCollection from "./SquirrelCollection";
import TagCollection from "./TagCollection";

const Collection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  }>({ value: "collection", label: "다람쥐" });

  const options = [
    { value: "collection", label: "다람쥐" },
    { value: "tag", label: "태그" },
  ];

  const handleLayoutChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  return (
    <div className="collection-container">
      <h1 className="title">컬렉션</h1>

      {selectedOption.value === "collection" && <SquirrelCollection />}
      {selectedOption.value === "tag" && <TagCollection />}
    </div>
  );
};

export default Collection;
