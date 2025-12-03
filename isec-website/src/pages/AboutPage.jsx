import React from "react";
import bgCore from "../assets/core-values-background.png";
import wendiPic from "../assets/wendi.jfif";
import edrickPic from "../assets/code.jpg";

const AboutPage = () => {
  return (
    <div className="about-page">

      {/* ================== ABOUT INGENIARE ================== */}
      <section className="about-section">
        <h1 className="about-title">ABOUT INGENIARE</h1>
        <div className="about-title-underline"></div>

        <p>
          <strong>Ingeniare</strong> is a multidisciplinary structural engineering
          consultancy that partners with architectural firms, MEPF consultants,
          contractors, developers, and local government units (LGUs) to deliver
          code-compliant, cost-efficient, and future-ready engineering solutions.
        </p>
        <br></br>
        <p>
          We serve as your on-demand structural department, providing expertise
          in design, coordination, and research-backed engineering, ensuring
          that every structure is engineered with both safety and intelligence
          in mind.
        </p>
        <br></br>
        <a href="/services" className="about-link">Explore Ingeniare Services</a>
      </section>

      {/* ================== MISSION & VISION ================== */}
      <section className="mv-section">
        <h2 className="mv-title">INGENIARE<br/>MISSION & VISION</h2>
        <div className="about-title-underline mv-underline"></div>

        <div className="mv-container">

          <div className="mv-block">
            <h3 className="mv-sub">:: OUR MISSION</h3>
            <p className="mv-text">
              To deliver precise, code-compliant, and innovative structural
              engineering solutions that empower architects, contractors,
              developers, and LGUs to build safer, smarter, and more
              sustainable structures—transforming every project into a benchmark
              of integrity, efficiency, and resilience.
            </p>
          </div>

          <div className="mv-block">
            <h3 className="mv-sub">:: OUR VISION</h3>
            <p className="mv-text">
              To become the Philippines’ most trusted authority in structural
              engineering, pioneering research-based assessment frameworks,
              intelligent design systems, and digital structural health
              technologies that redefine how the built environment is designed,
              evaluated, and preserved.
            </p>
          </div>

        </div>
      </section>

      {/* ================== CORE VALUES ================== */}
      <section
        className="core-section"
        style={{ backgroundImage: `url(${bgCore})` }}
      >
        <h2 className="core-title">INGENIARE CORE VALUES</h2>
        <div className="about-title-underline core-underline"></div>

        <ul className="core-list">
          <li><strong className="cv-gold" >INTEGRITY –</strong> We uphold the highest ethical and professional standards in every project, ensuring safety and compliance above all.</li>
          <li><strong className="cv-gold">PRECISION –</strong> Every calculation, drawing, and recommendation reflects accuracy grounded in science and engineering principles.</li>
          <li><strong className="cv-gold">INNOVATION –</strong> We continuously evolve through research and technology, integrating new tools, data-driven analysis, and AI to stay future-ready.</li>
          <li><strong className="cv-gold">COLLABORATION –</strong> We work closely with architects, contractors, and government partners, believing that great structures are built by unified teams.</li>
          <li><strong className="cv-gold">ACCOUNTABILITY –</strong> We take ownership of our designs, decisions, and impacts, protecting both the public and our partners’ trust.</li>
          <li><strong className="cv-gold">RESILIENCE –</strong> We design with the future in mind, creating structures that can withstand disasters, adapt to change, and last generations.</li>
          <li><strong className="cv-gold">SERVICE TO NATION –</strong> We align every project with public safety, sustainable growth, and the advancement of engineering practice in the Philippines.</li>
        </ul>

        <a href="/portfolio" className="future-btn">VIEW OUR PORTFOLIO</a>
      </section>

      {/* ================== WHO WE SERVE / OUR PARTNERS ================== */}
      <section 
        className="about-two-col-section"
        style={{ backgroundImage: `url(${bgCore})` }}
      >
      <div className="about-two-col-inner">
          {/* LEFT COLUMN – WHO WE SERVE */}
          <div className="about-col">
            <h2 className="about-section-heading">WHO WE SERVE</h2>
            <div className="who-title-underline" />

            <p className="about-text">
              <strong>ARCHITECTURAL FIRMS:</strong> Seamless structural coordination and design
              validation.
            </p>
            <p className="about-text">
              <strong>CONTRACTORS:</strong> Reliable analysis and reanalysis support for on-site
              decisions.
            </p>
            <p className="about-text">
              <strong>DEVELOPERS:</strong> Feasibility studies and structural options for
              cost-efficient construction.
            </p>
            <p className="about-text">
              <strong>LOCAL GOVERNMENT UNITS &amp; GOVERNMENT AGENCIES:</strong> Technical
              evaluation, retrofitting, and infrastructure design support.
            </p>
          </div>
          

          {/* RIGHT COLUMN – OUR PARTNERS */}
          <div className="about-col">
            <h2 className="about-section-heading">OUR PARTNERS</h2>
            <div className="who-title-underline" />

            <p className="about-text">
              At <strong>INGENIARE</strong>, collaboration is our foundation. We work alongside
              firms and institutions that share our commitment to engineering excellence and
              national progress.
            </p>

            <h3 className="about-subheading about-text">CURRENT &amp; CONTINUING COLLABORATIONS</h3>
            <ul className="about-list">
              <li className="about-text">Architectural Studios &amp; Design Firms</li>
              <li className="about-text">Construction &amp; General Contracting Companies</li>
              <li className="about-text">Local Government Units</li>
              <li className="about-text">Academic &amp; Research Institutions</li>
              <li className="about-text">Private Developers &amp; Contractors</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================== OUR DESIGN PHILOSOPHY ================== */}
      <section className="about-philosophy">
        <div className="about-philo-inner">
          <h2 className="about-philo-title">OUR DESIGN PHILOSOPHY</h2>
          <div className="about-title-underline philo-underline" />

          <p className="cv-gold about-philo-highlight">
            Engineering with purpose, built for safety, driven by data,
            sustained by innovation.
          </p>

          <p>
            Every Ingeniare project is grounded in Philippine building codes and
            international standards such as NSCP 2015, AISC 360, ACI 318/562, ASCE
            41, and ISO 13822.
          </p>

          <p>
            We combine analytical precision with design practicality, ensuring
            that every structure is safe, buildable, and future-ready.
          </p>
        </div>
      </section>
      {/* ================== OUR FOUNDERS ================== */}
      <section className="about-page founders-section">

        <h2 className="about-section-heading center">OUR FOUNDERS</h2>
        <div className="about-heading-underline center"></div>

        {/* Founder 1 */}
        <div className="founder-row">
          <div className="founder-photo">
            <img src={wendiPic} alt="Engr. Wendhel Q. Lubay" />
            <p className="founder-name">Engr. Wendhel Q. Lubay</p>
            <p className="founder-role">Owner / Principal Engineer</p>
          </div>

          <div className="founder-text">
            {/* Your full text here */}
            <p><strong className="gold-text">Engr. Wendhel Lubay</strong> is a licensed Civil Engineer and the <span className="gold-text">Principal Engineer</span> of 
              Ingeniare Structural Engineering Consultancy (ISEC). With a decade of experience spanning academia, 
              structural design, and government service, she brings deep technical expertise and a strong command of 
              code-compliant engineering practice. She previously served as a <span className="gold-text">university professor for nine years (9)</span>, 
              where she strengthened her mastery of structural analysis and design while mentoring future engineers. 
              <span className="gold-text"> Since 2014,</span> she has actively handled diverse structural projects—from residential and commercial to 
              industrial—preparing full structural analysis, detailing, permit-ready plans, and engineering reports.
            </p>
            <p>
              In her <span className="gold-text">government role as Project Inspector / Structural Engineer</span> under the Municipal Engineering 
              Office of LGU Sariaya, she manages structural inspections, post-calamity assessments, Programs of Work, 
              and municipal project evaluations. She has also developed several institutional tools, such as road
               condition evaluation systems, contingency plans, and departmental work programs. Through this combined 
               experience, she leads ISEC’s engineering direction, ensuring that every structural solution the firm 
               delivers is safe, efficient, and grounded in professional excellence.
            </p>
          </div>
        </div>

        {/* Founder 2 */}
        <div className="founder-row reverse">
          <div className="founder-text">
            {/* Full text here */}
            <p><strong className="gold-text">Edrick Francis G. Herrera</strong> is the <span className="gold-text">Co-Owner and Managing Director</span> of ISEC,
              bringing a multidisciplinary background in civil engineering, programming, electronics, marketing 
              strategy, and Lean Six Sigma. His diverse skill set enables him to build internal systems and 
              digital workflows that streamline ISEC’s operations, improve productivity, and modernize its 
              service delivery. He leads the firm’s theoretical and analytical studies—including feasibility 
              studies, value engineering, hazard assessments, and Non-Destructive Testing (NDT) frameworks—strengthening 
              the firm’s research-backed approach to structural consulting.
            </p>
            <p>
              As a <span className="gold-text">head of ISEC’s Research & Development and Marketing divisions</span>, he develops engineering tools,
              device concepts, branding systems, and marketing strategies that position Ingeniare as a modern, 
              tech-driven consultancy. His ability to merge technical engineering with innovation, system design,
              and market direction gives ISEC a competitive edge—allowing the firm to deliver forward-thinking 
              solutions that are both technically sound and strategically aligned with client needs and industry trends.
            </p>
          </div>

          <div className="founder-photo">
            <img src={edrickPic} alt="Edrick Francis G. Herrera" />
            <p className="founder-name">Edrick Francis G. Herrera</p>
            <p className="founder-role">Co-Owner / Managing Director</p>
          </div>
        </div>

      </section>

    </div>
  );
};

export default AboutPage;
