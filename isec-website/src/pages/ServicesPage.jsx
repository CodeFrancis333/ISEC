// src/pages/ServicesPage.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaDraftingCompass,
  FaUniversity,
  FaHandshake,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const serviceBlocks = [
  {
    title: "STRUCTURAL ANALYSIS & DESIGN",
    intro:
      "Ingeniare provides complete structural engineering design solutions for buildings, foundations, and special structures. " +
      "Our work ensures compliance with NSCP 2015, ACI 318, AISC 360, and ASCE 7 while optimizing safety, material efficiency, " +
      "and constructability.",
    bullets: [
      "Structural design of residential, commercial, and industrial buildings",
      "Steel portal frame design for warehouses and long-span facilities",
      "Foundation design (isolated, combined, mat, raft, and pile-supported)",
      "Telecom tower and billboard structure design",
      "Water tank design (RC elevated tanks, steel tanks with RC ring beams)",
      "Mezzanine design for gyms, malls, and commercial spaces",
      "CFST/HSS structural systems for modern building applications",
      "Seismic and wind load analysis for compliance and optimization",
      "Response spectrum and time-history analysis for critical structures",
    ],
  },
  {
    title: "STRUCTURAL EVALUATION & VERIFICATION",
    intro:
      "This category focuses on assessing the safety, stability, and performance of existing " +
      "buildings. Ingeniare evaluates structural conditions, identifies weaknesses, verifies as-built " +
      "compliance, and provides actionable recommendations for repairs or retrofitting.",
    bullets: [
      "Rapid Visual Screening (RVS) for schools, offices, and commercial buildings",
      "Detailed Structural Evaluation (DSE) for old buildings and facilities",
      "Load capacity verification for beams, columns, slabs, and foundations",
      "Structural integrity certification for occupancy and real estate requirements",
      "Pre- and post-disaster damage assessment (earthquake, typhoon, flood)",
      "Crack mapping, settlement investigation, and structural distress diagnosis",
      "Retrofitting recommendation reports (FRP, jacketing, enlargement, bracing)",
      "As-built modeling and verification of existing structures",
    ],
  },
  {
    title: "CONCRETE NON-DESTRUCTIVE TESTING & ASSESSMENT",
    intro:
      "Ingeniare performs non-destructive testing to measure concrete strength, durability, and integrity without damaging the structure. " +
      "Using RH, UPV, carbonation testing, and rebar scanning, we support decision-making for retrofitting, compliance, and safety certification.",
    bullets: [
      "Rebound Hammer strength assessment for beams, columns, walls, slabs",
      "UPV testing for internal flaw detection and SONREB strength correlation",
      "Carbonation depth testing for durability and corrosion risk evaluation",
      "Concrete uniformity tests for quality control in old buildings",
      "Rebar scanning to verify cover thickness and rebar locations",
      "NDT-supported retrofitting studies and structural condition reports",
      "Safe coring layout planning for destructive tests",
    ],
  },
  {
    title: "STRUCTURAL CONSULTANCY SERVICES",
    intro:
      "Ingeniare supports architectural firms, contractors, developers, and homeowners through outsourced structural design, QA/QC checking, technical expertise, and on-call " +
      "consultation. We function as a dedicated engineering partner to enhance coordination and project efficiency.",
    bullets: [
      "Full structural design outsourcing for architectural firms",
      "QA/QC checking of contractor drawings and calculations",
      "Value engineering for optimized material usage and reduced project costs",
      "Structural verification of proposed design changes (VO's)",
      "On-call engineering support for construction sites",
      "Solar panel structural assessments and mounting evaluations",
      "Homebuyer structural inspections for real estate transactions",
    ],
  },
  {
    title: "SPECIALIZED REPORTS & CERTIFICATIONS",
    intro:
      "Ingeniare produces formal engineering documentation required for permits, safety verification, installation approval, and as-built compliance. " +
      "Our reports follow industry standards and regulatory requirements for both private and public sector projects.",
    bullets: [
      "Structural Analysis Report (SAR) for building permit application",
      "Structural Integrity Certification (SIC) for existing buildings",
      "Roof and truss certification for new or renovated structures",
      "Solar panel structural certification for residential and commercial roofs",
      "NDT Concrete Assessment Reports for old buildings",
      "As-built structural verification for turnover and compliance",
      "Temporary structures safety certification for stages, scaffolding, booths, LED walls",
    ],
  },
  {
    title: "OTHER INGENIARE SERVICES",
    intro:
      "This category supports project planning, technical due diligence, budgeting, and construction execution. " +
      "Ingeniare provides feasibility studies, cost evaluation, hazard analysis, and on-site inspection to guide clients toward safe and efficient project delivery.",
    bullets: [
      "Feasibility studies for residential, commercial, mixed-use, and municipal projects",
      "Structural expansion feasibility (additional storeys, mezzanines)",
      "Public market, terminal, and slaughterhouse feasibility studies",
      "Preliminary structural options and Class D cost estimates",
      "Technical due diligence for property buyers and developers",
      "Zoning, easement, and hazard compliance reviews",
      "Reinforcement checking and pre-pour inspection during construction",
      "Roof/truss installation supervision and structural punch listing",
    ],
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

const ServicesPage = () => {
  return (
    <section className="services-page">

      {/* MAIN CONTENT CONTAINER */}
      <div className="services-container">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="services-main-title">INGENIARE SERVICES</h1>
          <div className="services-title-underline" />
          <p className="services-intro">
            <span className="services-gold">
              Ingeniare Structural Engineering Consultancy
            </span>{" "}
            provides a comprehensive suite of structural design, verification,
            and concrete health assessment services for residential, commercial,
            industrial, and municipal projects. Every engagement is grounded in
            code-compliant analysis, clear documentation, and practical
            solutions.
          </p>
        </motion.div>

        {/* Service Blocks */}
        {serviceBlocks.map((service, index) => (
          <motion.section
            key={service.title}
            className="service-block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
          >
            <div className="service-number">{index + 1}</div>

            <div className="service-content">
              <h2 className="service-title services-gold">{service.title}</h2>

              <p className="service-paragraph">{service.intro}</p>

              <h3 className="service-subheading services-maroon">
                Key Deliverables:
              </h3>
              <ul className="service-list">
                {service.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="service-actions">
                <Link to="/contact" className="service-btn primary">
                  Inquire Service
                </Link>
                <Link to="/portfolio" className="service-btn ghost">
                  View Portfolio
                </Link>
              </div>
            </div>
          </motion.section>
        ))}

      </div> {/* END services-container */}

      {/* FULL-WIDTH METRICS SECTION */}
      <motion.section
        className="services-metrics"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div className="services-metric-item" key={metric.line1}>
              <div className="services-metric-icon"><Icon /></div>
              <div className="services-metric-value">{metric.value}</div>
              <div className="services-metric-text">
                <span>{metric.line1}</span>
                <span>{metric.line2}</span>
              </div>
            </div>
          );
        })}
      </motion.section>

    </section>
  );
};

export default ServicesPage;
