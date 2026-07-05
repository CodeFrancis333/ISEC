import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import Seo from "../components/seo/Seo.jsx";

const FORM_NAME = "structural-assessment-scope-guide";
const GUIDE_DOWNLOAD_PATH = "/downloads/structural-assessment-scope-guide.pdf";
const GUIDE_DOWNLOAD_URL = `${window.location.origin}${GUIDE_DOWNLOAD_PATH}`;

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const triggerGuideDownload = () => {
  const link = document.createElement("a");
  link.href = GUIDE_DOWNLOAD_PATH;
  link.download = "structural-assessment-scope-guide.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const StructuralAssessmentGuidePage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailIsValid = isValidEmail(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!emailIsValid) {
      setErrorMessage("Enter a valid email address before downloading the guide.");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error("Unable to process your guide request right now.");
      }

      triggerGuideDownload();
      form.reset();
      setEmail("");
      setTouched(false);
      setSuccessMessage(
        "Your guide download should start automatically. We have also recorded your request for notification through Netlify Forms."
      );
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to process your guide request right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Free Structural Assessment Scope Guide | Ingeniare"
        description="Download Ingeniare's free Structural Assessment Scope Guide to understand what scope items to include before requesting quotations or preparing procurement documents."
        path="/free-structural-assessment-scope-guide"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Free Structural Assessment Scope Guide",
          url: "https://www.ingeniare-sec.com/free-structural-assessment-scope-guide",
        }}
      />

      <section className="section guide-landing-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Motion.div
                id="guide-download-form"
                className="card-isec p-4 p-md-5 guide-form-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
              >
                <h2 className="h3 guide-form-title">
                  Free Structural Assessment Scope Guide
                </h2>
                <p className="guide-lead guide-form-lead">
                  Planning to request a Structural Integrity Evaluation for an
                  existing building?
                </p>
                <p className="guide-copy">
                  This guide is helpful for building owners, administrators,
                  facility managers, and decision-makers who want a clearer and
                  more professional basis for requesting structural assessment
                  services.
                </p>
                <p className="guide-copy mb-4">
                  Enter your email below to download the guide and understand
                  what scope items should be considered before asking for
                  quotations.
                </p>

                <form
                  name={FORM_NAME}
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <input type="hidden" name="form-name" value={FORM_NAME} />
                  <input
                    type="hidden"
                    name="guide"
                    value="Free Structural Assessment Scope Guide"
                  />

                  <p className="d-none">
                    <label>
                      Don&apos;t fill this out if you&apos;re human:
                      <input name="bot-field" />
                    </label>
                  </p>

                  <label className="form-label guide-label" htmlFor="guide-email">
                    Email Address
                  </label>
                  <input
                    id="guide-email"
                    type="email"
                    className={`form-control ${
                      touched && !emailIsValid ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                  {touched && !emailIsValid ? (
                    <div className="invalid-feedback d-block">
                      Enter a valid email address to continue.
                    </div>
                  ) : null}

                  {errorMessage ? (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                      {errorMessage}
                    </div>
                  ) : null}

                  {successMessage ? (
                    <div className="alert alert-success mt-3 mb-0" role="alert">
                      {successMessage}{" "}
                      <a href={GUIDE_DOWNLOAD_URL} download>
                        Download again
                      </a>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="btn-isec-primary mt-4"
                    disabled={!emailIsValid || isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Download Guide"}
                  </button>
                </form>
              </Motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StructuralAssessmentGuidePage;
