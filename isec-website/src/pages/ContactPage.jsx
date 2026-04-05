import React, { useState } from "react";
import { motion as Motion } from "framer-motion";

const FORM_NAME = "contact";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    projectBrief: "",
    "bot-field": "",
  });
  const [status, setStatus] = useState(null);

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
      const payload = new URLSearchParams({
        "form-name": FORM_NAME,
        ...formData,
      });

      const res = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });

      if (!res.ok) throw new Error("Network error");

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        organization: "",
        projectBrief: "",
        "bot-field": "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
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
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value={FORM_NAME} />
                <input
                  type="hidden"
                  name="bot-field"
                  value={formData["bot-field"]}
                  onChange={handleChange}
                />
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
                  />
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
  );
};

export default ContactPage;
