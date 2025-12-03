// src/pages/PortfolioPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal, Button, Row, Col } from "react-bootstrap";
import {
  FaDraftingCompass,
  FaUniversity,
  FaHandshake,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// You can later replace image paths with real ones in /src/assets
const projects = [
  {
    id: 1,
    category: "Building Structures",
    name: "5-Storey Mixed-Use RC Building – Quezon Province",
    scope: "Full structural analysis & design (NSCP 2015, ACI 318, AISC 360).",
    status: "ongoing",
    date: "2025",
    location: "Quezon Province, Philippines",
    description:
      "A mid-rise mixed-use building designed for commercial and residential occupancy. Ingeniare handled complete structural modeling, code checks, and reinforcement detailing, coordinating closely with the architectural team.",
    images: [
      "/assets/portfolio/building-1a.jpg",
      "/assets/portfolio/building-1b.jpg",
      "/assets/portfolio/building-1c.jpg",
    ],
  },
  {
    id: 2,
    category: "Government / LGU Projects",
    name: "Municipal Public Market Structural Evaluation",
    scope:
      "As-built verification, Structural Analysis Report (SAR), and retrofit recommendations.",
    status: "completed",
    date: "2024",
    location: "Sariaya, Quezon",
    description:
      "Comprehensive evaluation of an existing public market structure, including on-site inspection, structural re-analysis, and preparation of recommendations for strengthening and life extension.",
    images: [
      "/assets/portfolio/market-1a.jpg",
      "/assets/portfolio/market-1b.jpg",
    ],
  },
  {
    id: 3,
    category: "NDT / Concrete Assessment",
    name: "Existing Condotel Concrete Health Assessment",
    scope:
      "Rebound hammer testing, rebar scanning, carbonation assessment, and UPV-based evaluation framework.",
    status: "ongoing",
    date: "2025",
    location: "Manila, Philippines",
    description:
      "Concrete health assessment of an aging condotel structure to support retrofit and reuse decisions. Combined NDT techniques with analytical modeling to estimate in-situ strength and durability.",
    images: [
      "/assets/portfolio/ndt-1a.jpg",
      "/assets/portfolio/ndt-1b.jpg",
      "/assets/portfolio/ndt-1c.jpg",
    ],
  },
  {
    id: 4,
    category: "Slope Protection & Flood Control",
    name: "Riverbank Protection & Slope Stability Study",
    scope:
      "Concept design options, stability checks, and preliminary detailing for mitigation structures.",
    status: "completed",
    date: "2023",
    location: "Quezon Province, Philippines",
    description:
      "Study and preliminary design of slope protection and riverbank structures to mitigate erosion and flooding risks for nearby communities.",
    images: ["/assets/portfolio/slope-1a.jpg"],
  },
  {
    id: 5,
    category: "Special Structures",
    name: "Solar CCTV Pole & Foundation Verification",
    scope:
      "Structural verification of pole, base plate, anchor bolts, and concrete pedestal under wind and seismic loads.",
    status: "completed",
    date: "2024",
    location: "LGU Project",
    description:
      "Verification and optimization of solar-powered CCTV pole foundations to ensure adequate safety against overturning, uplift, and serviceability issues.",
    images: ["/assets/portfolio/cctv-1a.jpg", "/assets/portfolio/cctv-1b.jpg"],
  },
  {
    id: 6,
    category: "Educational / Training Models",
    name: "Structural Steel & RC Teaching Models",
    scope:
      "Parametric models and calculation templates for educational demonstrations and board exam review.",
    status: "completed",
    date: "2023",
    location: "Educational / Internal",
    description:
      "Development of teaching-oriented structural models and design templates to support civil engineering students and reviewees.",
    images: ["/assets/portfolio/edu-1a.jpg"],
  },
  {
    id: 7,
    category: "Research & Development",
    name: "Prototype NDT-Based Concrete Health Index",
    scope: "Concept framework, data mapping, and preliminary scoring system.",
    status: "ongoing",
    date: "2025",
    location: "Ingeniare R&D",
    description:
      "Ongoing research to transform NDT readings into a structured Concrete Health Index that can guide retrofit decisions and long-term monitoring.",
    images: ["/assets/portfolio/rd-1a.jpg", "/assets/portfolio/rd-1b.jpg"],
  },
  {
    id: 8,
    category: "Retrofitting Studies",
    name: "Conceptual Retrofit Schemes for Existing Building",
    scope:
      "Option studies comparing cost, constructability, and performance of retrofit schemes.",
    status: "ongoing",
    date: "2024",
    location: "Confidential Client",
    description:
      "Evaluation of multiple retrofit strategies for an existing structure, balancing cost, constructability, and target performance levels.",
    images: ["/assets/portfolio/retrofit-1a.jpg"],
  },
];

// FULL-WIDTH METRICS SECTION
const metrics = [
  {
    icon: FaDraftingCompass,
    value: "20+",
    line1: "Design Projects",
    line2: "Completed",
  },
  {
    icon: FaUniversity,
    value: "1",
    line1: "Government",
    line2: "Collaboration",
  },
  {
    icon: FaHandshake,
    value: "15+",
    line1: "Partner Firms",
    line2: "Supported",
  },
  {
    icon: FaShieldAlt,
    value: "100%",
    line1: "Code-Compliant",
    line2: "Deliverables",
  },
];

// CLIENT TESTIMONIALS
const testimonials = [
  {
    id: 1,
    name: "Principal Architect",
    company: "ABC Consultancy",
    position: "Lead Architect",
    logo: "/assets/testimonials/client-abc.png",
    feedback:
      "Ingeniare’s design documentation was complete, clear, and well-coordinated with our architectural set. They delivered ahead of our internal deadline.",
  },
  {
    id: 2,
    name: "Project Manager",
    company: "XYZ Builders",
    position: "Construction Project Manager",
    logo: "/assets/testimonials/client-xyz.png",
    feedback:
      "The team was highly responsive and detail-oriented. Their structural solutions helped us optimize material usage without compromising safety.",
  },
  {
    id: 3,
    name: "Municipal Engineer",
    company: "LGU Sariaya",
    position: "Municipal Engineer",
    logo: "/assets/testimonials/client-lgu.png",
    feedback:
      "Ingeniare provided clear evaluation reports and retrofit options that were easy to present to decision-makers and council members.",
  },
];

const INITIAL_LIMIT = 6;

const PortfolioPage = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_LIMIT);
  const currentTestimonial =
    testimonials.length > 0 ? testimonials[testimonialIndex] : null;

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handlePrevTestimonial = () => {
    if (!testimonials.length) return;
    setTestimonialIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    if (!testimonials.length) return;
    setTestimonialIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="section portfolio-page">
      {/* TITLE + INTRO (inside container) */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="portfolio-title">Portfolio</h1>
          <div className="portfolio-title-underline" />
          <p className="portfolio-intro">
            A curated snapshot of Ingeniare’s work across building structures, LGU and
            government projects, NDT-based concrete assessment, and research-driven
            engineering initiatives. Each project reflects our commitment to safety,
            code-compliance, and future-ready design.
          </p>
        </motion.div>
      </div>

      {/* STATS STRIP – full-width */}
      <motion.section
        className="portfolio-metrics"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div className="portfolio-metric-item" key={metric.line1}>
              <div className="portfolio-metric-icon">
                <Icon />
              </div>
              <div className="portfolio-metric-value">{metric.value}</div>
              <div className="portfolio-metric-text">
                <span>{metric.line1}</span>
                <span>{metric.line2}</span>
              </div>
            </div>
          );
        })}
      </motion.section>

      {/* PROJECT CARDS */}
      <div className="container">
        <div className="row mt-4 gy-4">
          {visibleProjects.map((project, index) => (
            <div className="col-md-6" key={project.id}>
              <motion.div
                className="portfolio-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
              >
                <div className="portfolio-card-header">
                  <span className="portfolio-category">{project.category}</span>
                  <span className="portfolio-year">{project.date}</span>
                </div>

                <h2 className="portfolio-name">{project.name}</h2>

                <div className="portfolio-meta">
                  <span
                    className={`status-dot status-${project.status}`}
                    aria-hidden="true"
                  />
                  <span className="portfolio-status">
                    {project.status === "ongoing" ? "Ongoing" : "Completed"}
                  </span>
                  <span className="portfolio-location">
                    {project.location}
                  </span>
                </div>

                <p className="portfolio-scope">
                  <span className="scope-label">Scope:</span> {project.scope}
                </p>

                <button
                  type="button"
                  className="btn-portfolio-details"
                  onClick={() => handleOpenModal(project)}
                >
                  View Project Details
                </button>
              </motion.div>
            </div>
          ))}
        </div>

        {/* VIEW MORE / VIEW LESS */}
        {projects.length > INITIAL_LIMIT && (
          <div className="portfolio-more-wrapper">
            {!showAll ? (
              <button
                type="button"
                className="portfolio-more-btn"
                onClick={() => setShowAll(true)}
              >
                … View more projects
              </button>
            ) : (
              <button
                type="button"
                className="portfolio-more-btn"
                onClick={() => setShowAll(false)}
              >
                View less projects
              </button>
            )}
          </div>
        )}

        {/* CLIENT FEEDBACK / TESTIMONIALS */}
        {currentTestimonial && (
          <section className="portfolio-testimonials">
            <h2 className="testimonial-heading">
              CLIENT FEEDBACK / <br />
              TESTIMONIALS
            </h2>
            <div className="testimonial-underline" />

            <div className="testimonial-content">

              <div className="testimonial-center">
                <div className="testimonial-avatar">
                  {currentTestimonial.logo ? (
                    <img
                      src={currentTestimonial.logo}
                      alt={currentTestimonial.company}
                    />
                  ) : (
                    <div className="testimonial-avatar-placeholder">
                      Logo
                    </div>
                  )}
                </div>

                <p className="testimonial-quote">
                  “{currentTestimonial.feedback}”
                </p>
                <p className="testimonial-author">
                  — {currentTestimonial.position}, {currentTestimonial.company}
                </p>
              </div>
              <div className="testimonial-btn-container">
                <button
                  type="button"
                  className="testimonial-arrow testimonial-arrow-left"
                  onClick={handlePrevTestimonial}
                  aria-label="Previous testimonial"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="testimonial-arrow testimonial-arrow-right"
                  onClick={handleNextTestimonial}
                  aria-label="Next testimonial"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* READY TO COLLABORATE CTA */}
        <section className="portfolio-cta">
          <h2 className="portfolio-cta-heading">
            READY TO COLLABORATE FOR <br />
            YOUR NEXT PROJECT?
          </h2>

          <div className="portfolio-cta-actions">
            <Link to="/contact" className="portfolio-cta-btn-gold">
              Partner With Us
            </Link>
            <Link to="/contact" className="portfolio-cta-btn-maroon">
              Send Project Inquiry
            </Link>
          </div>
        </section>
      </div>

      {/* MODAL */}
      <Modal
        show={!!selectedProject}
        onHide={handleCloseModal}
        size="lg"
        centered
        className="portfolio-modal"
      >
        {selectedProject && (
          <>
            <Modal.Header closeButton>
              <div className="w-100">
                <p className="modal-category">{selectedProject.category}</p>
                <h2 className="modal-title">{selectedProject.name}</h2>
                <div className="modal-meta">
                  <span
                    className={`status-dot status-${selectedProject.status}`}
                  />
                  <span className="modal-status">
                    {selectedProject.status === "ongoing"
                      ? "Ongoing"
                      : "Completed"}
                  </span>
                  <span className="modal-year">{selectedProject.date}</span>
                  <span className="modal-location">
                    {selectedProject.location}
                  </span>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body>
              <Row className="gy-4">
                {/* LEFT: TEXT */}
                <Col md={6}>
                  <div className="modal-text-block">
                    <p className="modal-scope">
                      <span className="scope-label">Scope:</span>{" "}
                      {selectedProject.scope}
                    </p>
                    <p className="modal-description">
                      {selectedProject.description}
                    </p>
                  </div>
                </Col>

                {/* RIGHT: IMAGES */}
                <Col md={6}>
                  <div className="modal-images-block">
                    {selectedProject.images &&
                    selectedProject.images.length > 0 ? (
                      <>
                        {/* Big active image */}
                        <div className="modal-image-main">
                          <img
                            src={selectedProject.images[activeImageIndex]}
                            alt={selectedProject.name}
                          />
                        </div>

                        {/* Thumbnails */}
                        <div className="modal-thumbs">
                          {selectedProject.images.map((img, idx) => (
                            <button
                              key={img}
                              type="button"
                              className={`thumb-btn ${
                                idx === activeImageIndex ? "active" : ""
                              }`}
                              onClick={() => setActiveImageIndex(idx)}
                            >
                              <img
                                src={img}
                                alt={`${selectedProject.name} ${idx + 1}`}
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="no-images-text">
                        Project images to follow.
                      </p>
                    )}

                    {/* Bottom buttons */}
                    <div className="modal-actions">
                      <Button
                        variant="link"
                        className="modal-link-btn"
                        href="/contact"
                      >
                        Request Company Profile
                      </Button>
                      <Button
                        variant="outline-secondary"
                        className="modal-close-btn"
                        onClick={handleCloseModal}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </section>
  );
};

export default PortfolioPage;
