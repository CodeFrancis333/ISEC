import React from "react";
import IsecNavbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const Layout = ({ children }) => {
  return (
    <>
      <IsecNavbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
