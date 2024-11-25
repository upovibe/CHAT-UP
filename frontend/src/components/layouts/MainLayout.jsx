import React, { Children } from "react";
import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <>
    <div>
    <Header />
    <div>{children}</div>
    </div>
    </>
  );
};

export default MainLayout;
