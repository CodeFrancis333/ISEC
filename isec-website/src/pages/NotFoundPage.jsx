import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/seo/Seo.jsx";

const NotFoundPage = () => {
  return (
    <section className="section not-found-page">
      <Seo
        title="Page Not Found | Ingeniare"
        description="The page you are looking for could not be found."
        path="/404"
        robots="noindex,nofollow"
      />

      <div className="container">
        <div className="not-found-content">
          <p className="not-found-code">404</p>
          <h1 className="section-title">Page Not Found</h1>
          <p className="section-subtitle">
            The page may have moved, or the link may be incorrect.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn-isec-primary">
              Back to Home
            </Link>
            <Link to="/contact" className="btn-isec-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
