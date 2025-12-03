import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const IsecNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

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

        <Navbar.Brand href="/" className="isec-navbar-brand">
          ISEC | Ingeniare Structural Engineering Consultancy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="isec-nav" />

        <Navbar.Collapse id="isec-nav" className="justify-content-end">
          <Nav className="gap-4">

            <NavLink to="/" end className="isec-nav-link">
              Home
            </NavLink>

            <NavLink to="/about" className="isec-nav-link">
              About
            </NavLink>

            <NavLink to="/services" className="isec-nav-link">
              Services
            </NavLink>

            <NavLink to="/portfolio" className="isec-nav-link">
              Portfolio
            </NavLink>

            <NavLink to="/contact" className="isec-nav-link">
              Contact
            </NavLink>

          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default IsecNavbar;
