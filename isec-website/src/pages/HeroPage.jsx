import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPuzzlePiece,
  FaLightbulb,
  FaShieldAlt,
  FaProjectDiagram,
  FaCheckCircle,
  FaChartLine,
  FaSearch,
  FaHandshake,
  FaAward,
  FaBookOpen,
  FaFlask,
  FaCogs,
} from "react-icons/fa";

import heroImage from "../assets/hero-cranes.jpg";

const HeroPage = () => {
  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero-landing"
        style={{ "--hero-image": `url(${heroImage})` }}
      >
        <div className="container hero-landing-inner">
          <div className="row">
            <div className="col-lg-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="hero-title">
                  INGENIARE STRUCTURAL
                  <br />
                  ENGINEERING CONSULTANCY
                </h1>

                <p className="hero-tagline mt-3">
                  Geniusly Engineered. Where safety meets innovation.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Link to="/services" className="btn-hero-outline">Our Services</Link>
                  <Link to="/contact" className="btn-hero-solid">Contact Us</Link>
                </div>

                <p style={{
                    fontSize: "1.1rem",
                    color: "#fff",
                    marginTop: "1.5rem",
                    marginBottom: "0.3rem"
                  }}>
                    Your on-demand structural department.
                  </p>

                  <div style={{
                    width: "180px",
                    height: "4px",
                    backgroundColor: "#F3CB49",
                    borderRadius: "2px"
                  }} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* MAROON INTRO BAND */}
      <section className="home-intro">
        <div className="container">
          <p>
            At <span className="intro-highlight">Ingeniare</span>, we believe that true confidence
            begins with structural integrity.
          </p>
          <p>
            From concept to construction, we integrate engineering precision, digital analysis, and
            future-ready innovation to deliver structures that are strong, sustainable, and
            compliant with modern standards.
          </p>
          <p>
            Every project we handle, whether a residential building, commercial space, bridge, or
            government facility, is engineered with one vision:
          </p>

          <p className="intro-vision">
            | To ensure safety, optimize cost, and extend the life of every structure.
          </p>

          <div className="intro-buttons">
            <Link to="/about" className="btn-intro-outline">About Us</Link>
            <Link to="/services" className="btn-intro-solid">Our Services</Link>
          </div>
        </div>
      </section>

      {/* GOLD DIAGONAL VALUE STRIP */}
      <div className="home-value-strip-wrapper">
        <section className="home-value-strip">
          <div className="container">
            <div className="row gy-4 text-center">
              <div className="col-md-4">
                <div className="value-icon">
                  <FaPuzzlePiece />
                </div>
                <div className="value-title">Plug-in Structural Department</div>
                <p className="value-text">
                  Reduce overhead costs by up to 40% annually by integrating Ingeniare as your
                  structural department.
                </p>
              </div>

              <div className="col-md-4">
                <div className="value-icon">
                  <FaLightbulb />
                </div>
                <div className="value-title">Partner-Driven Innovation</div>
                <p className="value-text">
                  Leverage our ongoing research and development in digital design, retrofitting
                  systems, and AI-based technologies.
                </p>
              </div>

              <div className="col-md-4">
                <div className="value-icon">
                  <FaShieldAlt />
                </div>
                <div className="value-title">Cost Reduction &amp; Risk Transfer</div>
                <p className="value-text">
                  Lower liability and project cost. Ingeniare takes full structural responsibility
                  for all analyses and design documentation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* WHY CLIENTS CHOOSE US */}
      <section className="why-choose">
        <div className="container">
          <div className="row gy-4">
            {/* LEFT COLUMN */}
            <div className="col-lg-5">
              <div className="why-choose-body">
                <h2 className="why-choose-title">WHY CLIENTS CHOOSE US</h2>
                  <div className="hero-paragraph-container">
                    <p>
                      From concept to construction, Ingeniare delivers design precision, coordination
                      clarity, and research-backed structural intelligence, ensuring every project
                      stands safe, strong, and smart.
                    </p>

                    <p>
                      <span>Who we serve:</span> Architects, Contractors, Developers, and LGUs.
                    </p>
                    <p>
                      <span>What we do:</span> Provide structural engineering design and solutions.
                    </p>
                    <p>
                      <span>How we do it:</span> With compliance, cost-efficiency, and innovation.
                    </p>
                  </div>

                <Link to="/portfolio" className="btn-why-resources">View Ingeniare Resources</Link>
                <div className="why-choose-caption">
                  View past projects &amp; feedbacks
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-lg-7">
              <div className="why-choose-right">
                <div className="why-choose-bg" />

                <div className="why-choose-list">
                  <div className="why-choose-item">
                    <div className="why-choose-icon">
                      <FaProjectDiagram />
                    </div>
                    <div>
                      <div className="why-choose-text-title">INTEGRATED EXPERTISE</div>
                      <p className="why-choose-text-body">
                        From feasibility to final design, Ingeniare delivers cohesive,
                        multi-disciplinary coordination under one roof.
                      </p>
                    </div>
                  </div>

                  <div className="why-choose-item">
                    <div className="why-choose-icon">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <div className="why-choose-text-title">
                        CODE-COMPLIANT &amp; RELIABLE
                      </div>
                      <p className="why-choose-text-body">
                        Every design is checked against NSCP 2015, AISC 360, and DPWH standards,
                        assuring safety and regulatory compliance.
                      </p>
                    </div>
                  </div>

                  <div className="why-choose-item">
                    <div className="why-choose-icon">
                      <FaChartLine />
                    </div>
                    <div>
                      <div className="why-choose-text-title">LEAN &amp; ADAPTIVE APPROACH</div>
                      <p className="why-choose-text-body">
                        Our consultancy adapts to client needs, whether full structural design or
                        coordination support, providing efficient, scalable solutions.
                      </p>
                    </div>
                  </div>

                  <div className="why-choose-item">
                    <div className="why-choose-icon">
                      <FaSearch />
                    </div>
                    <div>
                      <div className="why-choose-text-title">
                        RESEARCH-GROUNDED PRACTICE
                      </div>
                      <p className="why-choose-text-body">
                        We apply the latest structural research, software tools, and data analysis
                        to deliver optimized, science-based designs.
                      </p>
                    </div>
                  </div>

                  <div className="why-choose-item">
                    <div className="why-choose-icon">
                      <FaHandshake />
                    </div>
                    <div>
                      <div className="why-choose-text-title">
                        COMMITMENT TO NATION-BUILDING
                      </div>
                      <p className="why-choose-text-body">
                        Every project contributes to safer communities, sustainable development, and
                        public welfare across the Philippines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE / PARTNER + CERTIFICATIONS */}
      <section className="home-cta-band">
        <div className="container">
          {/* Explore our services */}
          <div className="mb-5">
            <h3 className="home-cta-title">EXPLORE OUR SERVICES</h3>
            <p className="home-cta-subtitle">
              Learn about our frameworks in design, coordination, and advanced engineering.
            </p>
            <Link to="/services" className="btn-cta-white">Our Services</Link>
          </div>

          {/* Partner with us */}
          <div className="mb-4">
            <h3 className="home-cta-title">PARTNER WITH US</h3>
            <p className="home-cta-subtitle">
              <strong className="ingeniare-gold">Ingeniare</strong> welcomes collaborations with architectural, construction, 
              and government organizations that value compliance, efficiency, and 
              intelligent design.
            </p>
            <p className="home-cta-subtitle">
              If your firm seeks a structural partner to enhance capability, 
              reduce cost, and ensure quality, we’d love to connect.
            </p>
            <Link to="/contact" className="btn-cta-outline-gold">Contact Us</Link>
          </div>

          {/* Certifications */}
          <div className="home-cert-strip">
            <div className="row home-cert-row gy-3">
              <div className="col-6 col-md-3">
                <div className="home-cert-item">
                  <div className="home-cert-icon">
                    <FaAward />
                  </div>
                  <div>NSCP 2015 Certified Practices</div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="home-cert-item">
                  <div className="home-cert-icon">
                    <FaBookOpen />
                  </div>
                  <div>AISC 360 &amp; ACI 318 Compliant</div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="home-cert-item">
                  <div className="home-cert-icon">
                    <FaFlask />
                  </div>
                  <div>Research-Driven Structural Solutions</div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="home-cert-item">
                  <div className="home-cert-icon">
                    <FaCogs />
                  </div>
                  <div>Future-Ready Engineering Frameworks</div>
                </div>
              </div>
            </div>

            <p className="home-cert-caption">
              We bridge design, data, and durability. Helping architects, contractors, and LGUs
              build safer, smarter, and longer-lasting structures for the Philippines.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroPage;
