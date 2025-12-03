import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaViber,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="isec-footer">
      <Container>
        <Row className="gy-4">
          {/* Brand + socials */}
          <Col md={4}>
            <div className="footer-brand">
              <div className="footer-brand-title">INGENIARE</div>
              <div className="footer-brand-sub">
                STRUCTURAL ENGINEERING CONSULTANCY
              </div>
              <div className="footer-brand-tagline">
                Geniusly Engineered. Where safety meets innovation.
              </div>
            </div>

            <div className="footer-social">
              <a
                href="https://www.facebook.com/profile.php?id=61555895965392"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
              >
                <span className="footer-social-icon">
                  <FaFacebookF />
                </span>
                Ingeniare Structural Engineering Consultancy
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
              >
                <span className="footer-social-icon">
                  <FaLinkedinIn />
                </span>
                Ingeniare Structural Engineering Consultancy
              </a>
            </div>
          </Col>

          {/* Explore + Engage */}
          <Col md={3}>
            <div className="footer-column-title">Explore</div>
            <ul className="footer-links">
              <li>
                <NavLink to="/about">About Ingeniare</NavLink>
              </li>
              <li>
                <NavLink to="/services">Core &amp; Advanced Services</NavLink>
              </li>
              <li>
                <NavLink to="/about">Why Clients Choose Us</NavLink>
              </li>
              <li>
                <NavLink to="/portfolio">Portfolio</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            </ul>

            <div className="footer-column-title mt-3">Engage</div>
            <ul className="footer-links">
              <li>
                <NavLink to="/contact">Partner With Us</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Work With Our Team</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Submit a Project Inquiry</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Request a Structural Audit</NavLink>
              </li>
            </ul>
          </Col>

          {/* Contact info */}
          <Col md={3}>
            <div className="footer-column-title">Contact Information</div>
            <ul className="footer-contact">
              <li>
                <span className="footer-contact-icon">
                  <FaMapMarkerAlt />
                </span>
                Malabanban Norte, Candelaria, Quezon
              </li>
              <li>
                <span className="footer-contact-icon">
                  <FaPhoneAlt />
                </span>
                +63 916 490 0217
              </li>
              <li>
                <span className="footer-contact-icon">
                  <FaViber />
                </span>
                +63 951 235 9772
              </li>
              <li>
                <span className="footer-contact-icon">
                  <FaEnvelope />
                </span>
                ingeniare.idc@gmail.com
              </li>
              <li>
                <span className="footer-contact-icon">
                  <FaClock />
                </span>
                <div>
                  Office Hours:
                  <br />
                  Monday – Saturday, 9:00 AM – 5:00 PM (PHT)
                </div>
              </li>
            </ul>
          </Col>

          {/* Legal documents */}
          <Col md={2}>
            <div className="footer-column-title">Legal Documents</div>
            <ul className="footer-links">
              <li>
                <NavLink to="/privacy-policy">Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to="/terms-of-service">Terms of Service</NavLink>
              </li>
              <li>
                <NavLink to="/engineering-compliance-statements">Engineering Compliance Statements</NavLink>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          © {year} Ingeniare Structural Engineering Consultancy. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
