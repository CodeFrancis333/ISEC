import React, { useState } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    projectBrief: "",
  });

  const [status, setStatus] = useState(null); // "sending" | "success" | "error"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Network error");

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        organization: "",
        projectBrief: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title">Contact & Inquiries</h1>
          <p className="section-subtitle">
            Tell us about your project, and we&apos;ll help you decide how ISEC can serve as your
            structural engineering department or verification partner.
          </p>
        </motion.div>

        <div className="row mt-4 gy-4">
          <div className="col-lg-6">
            <motion.div
              className="card-isec p-4 h-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="h5 mb-3" style={{ color: "var(--isec-gold)" }}>
                Send a Message
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Organization / Firm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company / LGU / Developer"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Project Brief</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="projectBrief"
                    value={formData.projectBrief}
                    onChange={handleChange}
                    placeholder="Short description of your project and what structural help you need."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-isec-primary"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Submit Inquiry"}
                </button>

                {status === "success" && (
                  <p className="small mt-2 text-success">
                    Thank you! Your inquiry has been sent.
                  </p>
                )}
                {status === "error" && (
                  <p className="small mt-2 text-danger">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </motion.div>
          </div>

          <div className="col-lg-6">
            <motion.div
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
                <strong>Location:</strong> (Malabanban Norte, Candelaria Quezon, Philippines)
              </p>
              <hr />
              <p className="small text-muted mb-0">
                Scan our QR code, Facebook page, or LinkedIn link here...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
