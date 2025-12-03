import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <section className="legal-page privacy-page">
      <Helmet>
        <title>Privacy Policy | Ingeniare Structural Engineering Consultancy</title>
        <meta
          name="description"
          content="Learn how Ingeniare Structural Engineering Consultancy (ISEC) collects, uses, and protects your personal data for project inquiries, collaborations, and services."
        />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <div className="legal-container">
        <header className="legal-header">
          <p className="legal-badge">Legal &amp; Compliance</p>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: December 2025</p>
          <p className="legal-intro">
            This Privacy Policy explains how{" "}
            <strong>Ingeniare Structural Engineering Consultancy (ISEC)</strong>{" "}
            collects, uses, stores, and protects personal information provided by
            clients, partner firms, students, and website visitors.
          </p>
        </header>

        <div className="legal-body">
          <h2>1. Information We Collect</h2>
          <p>
            We collect only the information necessary for communication,
            project coordination, and service delivery, including:
          </p>
          <ul>
            <li>Basic contact details (name, email address, phone number)</li>
            <li>
              Company or organization details (firm name, role/position, location)
            </li>
            <li>
              Project information shared through forms, emails, or meetings
            </li>
            <li>
              Technical documents you voluntarily provide (plans, reports, photos)
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>Your information is used strictly for:</p>
          <ul>
            <li>Responding to inquiries and project requests</li>
            <li>Preparing proposals, quotations, and technical evaluations</li>
            <li>Coordinating with you and your project team</li>
            <li>
              Sending service-related updates, when you have given consent
            </li>
          </ul>

          <h2>3. Data Protection &amp; Security</h2>
          <p>
            We implement reasonable technical and organizational safeguards to
            protect your data, including restricted access to project files,
            secure storage for sensitive documents, and limited sharing only to
            authorized team members.
          </p>

          <h2>4. Data Sharing</h2>
          <p>
            We do <strong>not</strong> sell or rent your personal data. We may
            share limited information only when:
          </p>
          <ul>
            <li>Required by law, government, or regulatory authorities</li>
            <li>
              Necessary to coordinate with trusted partners directly involved in
              your project (e.g., architects, contractors), and only with
              consent or in line with our engagement
            </li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            Project-related information may be retained for documentation,
            reference, and regulatory requirements. You may request deletion of
            non-essential personal information where legally permitted.
          </p>

          <h2>6. Your Rights</h2>
          <p>You may contact us to:</p>
          <ul>
            <li>Request access to your personal information</li>
            <li>Ask for corrections or updates</li>
            <li>Request deletion of certain data, subject to legal obligations</li>
          </ul>

          <h2>7. Contact</h2>
          <p>
            For questions about this Privacy Policy or how we handle data, you
            may reach us through our{" "}
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

export default PrivacyPolicyPage;
