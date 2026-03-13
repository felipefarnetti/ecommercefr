import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GridView = ({ children }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
      {children}
    </div>
  );
};

export default GridView;
