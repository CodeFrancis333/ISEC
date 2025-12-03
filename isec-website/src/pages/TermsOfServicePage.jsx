import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const TermsOfServicePage = () => {
  return (
    <section className="legal-page terms-page">
      <Helmet>
        <title>Terms of Service | Ingeniare Structural Engineering Consultancy</title>
        <meta
          name="description"
          content="Read the terms and conditions governing the use of Ingeniare Structural Engineering Consultancy’s website, services, and project engagements."
        />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <div className="legal-container">
        <header className="legal-header">
          <p className="legal-badge">Legal &amp; Compliance</p>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-updated">Last updated: December 2025</p>
          <p className="legal-intro">
            These Terms of Service govern your use of the{" "}
            <strong>Ingeniare Structural Engineering Consultancy (ISEC)</strong>{" "}
            website and outline the conditions for engaging our structural
            engineering services.
          </p>
        </header>

        <div className="legal-body">
          <h2>1. Use of the Website</h2>
          <p>
            By accessing this website, you agree to use it only for legitimate
            informational and professional purposes. You must not attempt to
            disrupt, damage, or misuse any part of the site or its content.
          </p>

          <h2>2. No General Engineering Advice</h2>
          <p>
            All materials on this website are for{" "}
            <strong>information and awareness</strong> only. They do not
            constitute site-specific structural engineering advice. Project
            decisions should always be based on a formal engagement with a
            licensed engineer and a complete review of actual site conditions,
            drawings, and documents.
          </p>

          <h2>3. Engagement of Services</h2>
          <p>
            A professional engagement with ISEC is formalized only when both
            parties agree in writing, typically through:
          </p>
          <ul>
            <li>Signed proposal or contract</li>
            <li>Approved scope of work and fees</li>
            <li>Clear project deliverables and timelines</li>
          </ul>
          <p>
            Initial consultations, messages, or preliminary discussions do not
            automatically create a binding engineering responsibility unless
            confirmed in a formal agreement.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All logos, branding, text, layouts, and design frameworks on this
            site are the intellectual property of Ingeniare Structural
            Engineering Consultancy unless otherwise stated. They may not be
            copied, reproduced, or redistributed without written permission.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            ISEC will not be liable for any loss or damage arising from the use
            of this website or misuse of information taken out of context. For
            signed projects, liability is strictly bound by the terms stated in
            the specific contract or agreement.
          </p>

          <h2>6. Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time to reflect
            changes in regulations, practice, or internal policies. The date at
            the top of this page indicates the latest revision.
          </p>

          <h2>7. Contact</h2>
          <p>
            For clarifications about these Terms, you may reach us via our{" "}
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

export default TermsOfServicePage;
