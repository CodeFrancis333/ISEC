import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Seo from "../components/seo/Seo.jsx";

const ThankYouPage = () => {
  return (
    <>
      <Seo
        title="Thank You | Ingeniare"
        description="Inquiry submission confirmation for Ingeniare Structural Engineering Consultancy."
        path="/thank-you"
        robots="noindex,nofollow"
      />
      <section className="section">
        <div className="container">
        <Motion.div
          className="card-isec p-4 p-md-5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-uppercase small mb-2" style={{ color: "var(--isec-gold)" }}>
            Inquiry Received
          </p>
          <h1 className="section-title mb-3">Thank You</h1>
          <p className="section-subtitle mb-4">
            Your inquiry has been submitted successfully. We&apos;ll review your
            message and get back to you through the email address you provided.
          </p>
          <Link to="/" className="btn-isec-primary">
            Back to Home
          </Link>
        </Motion.div>
        </div>
      </section>
    </>
  );
};

export default ThankYouPage;
