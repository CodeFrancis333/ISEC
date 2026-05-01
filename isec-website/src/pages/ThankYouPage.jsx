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
      <section className="section thank-you-page">
        <div className="container">
          <Motion.div
            className="card-isec p-4 p-md-5 text-center thank-you-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="section-title thank-you-title">Thank you.</h1>
            <p className="thank-you-text">
              Your inquiry has been received. We&apos;ll get back to you through the
              contact details you provided.
            </p>
            <p className="thank-you-contact">
              For urgent concerns: <strong>ingeniare.idc@gmail.com</strong> or
              <strong> +63 951 235 9772</strong>
            </p>

            <div className="thank-you-actions">
              <Link to="/" className="btn-isec-primary">
                Back to Home
              </Link>
              <Link to="/contact" className="btn thank-you-secondary-action">
                Send Another Inquiry
              </Link>
            </div>
          </Motion.div>
        </div>
      </section>
    </>
  );
};

export default ThankYouPage;
