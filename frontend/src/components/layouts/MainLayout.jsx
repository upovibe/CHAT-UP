import PropTypes from "prop-types";
import Header from "./Header";

const MainLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-grow overflow-auto">{children}</main>
    </div>
  );
};

// PropTypes validation
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
