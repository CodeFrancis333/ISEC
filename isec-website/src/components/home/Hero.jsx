import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="section" id="home">
      <div className="container">
        <div className="row align-items-center gy-4">
          <div className="col-lg-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-uppercase small mb-2" style={{ color: "var(--isec-gold)" }}>
                Ingeniare Structural Engineering Consultancy
              </p>
              <h1 className="display-5 fw-bold mb-3">
                Your Dedicated <span style={{ color: "var(--isec-gold)" }}>Structural</span>{" "}
                Department.
              </h1>
              <p className="lead text-muted">
                ISEC can function as your firm&apos;s structural engineering department – handling
                analysis, design, verification, and documentation so your team can focus on core
                operations.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <button className="btn-isec-primary">
                  Schedule a Strategy Call
                </button>
                <button className="btn-isec-outline">
                  Download Company Profile (PDF)
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
