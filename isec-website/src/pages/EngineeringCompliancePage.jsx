import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const EngineeringCompliancePage = () => {
  return (
    <section className="legal-page compliance-page">
      <Helmet>
        <title>Engineering Compliance Statements | Ingeniare Structural Engineering</title>
        <meta
          name="description"
          content="Read Ingeniare Structural Engineering Consultancy’s compliance statements on codes, standards, professional practice, and ethical structural engineering."
        />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <div className="legal-container">
        <header className="legal-header">
          <p className="legal-badge">Professional Practice</p>
          <h1 className="legal-title">Engineering Compliance Statements</h1>
          <p className="legal-updated">Last updated: December 2025</p>
          <p className="legal-intro">
            Ingeniare Structural Engineering Consultancy (ISEC) operates under
            the laws of the Republic of the Philippines and adheres to
            nationally recognized codes, ethical standards, and professional
            practice guidelines for civil and structural engineering.
          </p>
        </header>

        <div className="legal-body">
          <h2>1. Code Compliance</h2>
          <p>
            Our designs and assessments are primarily guided by the following
            codes and standards, as applicable to the project:
          </p>
          <ul>
            <li>National Structural Code of the Philippines (NSCP)</li>
            <li>
              American Concrete Institute (ACI 318) for reinforced concrete
              design, when adopted
            </li>
            <li>
              AISC 360 for steel design and related specifications, when
              applicable
            </li>
            <li>ASCE 7 for load determination, when appropriate</li>
            <li>
              DPWH manuals and local government regulations for public
              infrastructure
            </li>
          </ul>

          <h2>2. Professional Responsibility</h2>
          <p>
            All structural designs, evaluations, and certifications issued by
            ISEC are prepared, reviewed, or overseen by duly licensed engineers
            in good standing, in accordance with the{" "}
            <strong>Professional Regulation Commission (PRC)</strong> and
            relevant professional codes of ethics.
          </p>

          <h2>3. Limitations of Use</h2>
          <p>
            Our drawings, calculations, and reports are developed for specific
            clients, sites, and conditions. They may not be reused, altered, or
            applied to other projects without our written consent and a proper
            technical review.
          </p>

          <h2>4. Structural Safety &amp; Public Welfare</h2>
          <p>
            We recognize structural engineering as a profession directly
            impacting public safety. ISEC commits to:
          </p>
          <ul>
            <li>Prioritizing life safety and structural reliability</li>
            <li>
              Providing honest technical opinions, especially regarding
              structural risks or deficiencies
            </li>
            <li>
              Recommending further investigation, retrofitting, or restrictions
              of use when needed
            </li>
          </ul>

          <h2>5. Non-Destructive Testing &amp; Evaluation</h2>
          <p>
            When performing NDT and structural evaluations, we interpret results
            within accepted engineering practice, recognizing the limitations of
            field data, instrument accuracy, and existing documentation.
            Conclusions are provided with appropriate assumptions and
            engineering judgment.
          </p>

          <h2>6. Conflicts of Interest</h2>
          <p>
            ISEC aims to avoid conflicts of interest and disclose any potential
            issues that may affect impartiality, especially when acting as a
            third-party checker, evaluator, or certifying engineer.
          </p>

          <h2>7. Contact</h2>
          <p>
            For more information about our compliance practices or to request
            documentation related to a specific project, you may reach us
            through our{" "}
            <Link to="/contact" className="legal-link">
              Contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default EngineeringCompliancePage;
