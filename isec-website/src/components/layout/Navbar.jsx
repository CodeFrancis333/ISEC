import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";

const IsecNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`isec-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>

        <Navbar.Brand
          as={Link}
          to="/"
          className="isec-navbar-brand"
          onClick={handleScrollTop}
        >
          <img 
            src="/Ingeniare-Logo.png"
            alt="ISEC Logo"
            className="isec-navbar-logo" 
          />
          ISEC | Ingeniare Structural Engineering Consultancy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="isec-nav" />

        <Navbar.Collapse id="isec-nav" className="justify-content-end">
          <Nav className="gap-4">

            <NavLink to="/" end className="isec-nav-link" onClick={handleScrollTop}>
              Home
            </NavLink>

            <NavLink to="/about" className="isec-nav-link" onClick={handleScrollTop}>
              About
            </NavLink>

            <NavLink to="/services" className="isec-nav-link" onClick={handleScrollTop}>
              Services
            </NavLink>

            <NavLink to="/portfolio" className="isec-nav-link" onClick={handleScrollTop}>
              Portfolio
            </NavLink>

            <NavLink to="/contact" className="isec-nav-link" onClick={handleScrollTop}>
              Contact
            </NavLink>

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default IsecNavbar;
