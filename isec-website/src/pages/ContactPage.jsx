import React from "react";
import { motion as Motion } from "framer-motion";
import Seo from "../components/seo/Seo.jsx";

const FORM_NAME = "contact";

const ContactPage = () => {
  return (
    <>
      <Seo
        title="Contact Ingeniare | Structural Engineering Inquiries"
        description="Contact Ingeniare Structural Engineering Consultancy for structural design, evaluation, verification, NDT assessment, and project collaboration inquiries."
        path="/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Ingeniare",
          url: "https://www.ingeniare-sec.com/contact",
        }}
      />
      <section className="section">
        <div className="container">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title">Contact & Inquiries</h1>
          <p className="section-subtitle">
            Tell us about your project, and we&apos;ll help you decide how ISEC
            can serve as your structural engineering department or verification
            partner.
          </p>
        </Motion.div>

        <div className="row mt-4 gy-4">
          <div className="col-lg-6">
            <Motion.div
              className="card-isec p-4 h-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="h5 mb-3" style={{ color: "var(--isec-gold)" }}>
                Send a Message
              </h2>

              <p className="small text-muted">
                This form submits through Netlify and can forward inquiries to
                your Gmail notification address.
              </p>

              <form
                name={FORM_NAME}
                method="POST"
                action="/thank-you.html"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
              >
                <input type="hidden" name="form-name" value={FORM_NAME} />

                <p className="d-none">
                  <label>
                    Don&apos;t fill this out if you&apos;re human:
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="mb-3">
                  <label className="form-label" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="contact-org">
                    Organization / Firm
                  </label>
                  <input
                    id="contact-org"
                    type="text"
                    className="form-control"
                    name="organization"
                    placeholder="Company / LGU / Developer"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="contact-brief">
                    Project Brief
                  </label>
                  <textarea
                    id="contact-brief"
                    className="form-control"
                    rows="4"
                    name="projectBrief"
                    placeholder="Short description of your project and what structural help you need."
                    required
                  />
                </div>

                <button type="submit" className="btn-isec-primary">
                  Submit Inquiry
                </button>
              </form>
            </Motion.div>
          </div>

          <div className="col-lg-6">
            <Motion.div
              className="card-isec p-4 h-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="h5 mb-3" style={{ color: "var(--isec-gold)" }}>
                Contact Details
              </h2>
              <p className="small mb-2">
                <strong>Email:</strong> ingeniare.idc@gmail.com
              </p>
              <p className="small mb-2">
                <strong>Mobile / Viber:</strong> +63 951 235 9772
              </p>
              <p className="small mb-2">
                <strong>Location:</strong> Malabanban Norte, Candelaria,
                Quezon, Philippines
              </p>
              <hr />
              <p className="small text-muted mb-0">
                If you prefer, you may also reach out through our Facebook page
                or LinkedIn.
              </p>
            </Motion.div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
