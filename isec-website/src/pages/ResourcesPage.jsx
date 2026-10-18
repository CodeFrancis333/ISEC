import { Link } from "react-router-dom";
import { FaBookOpen, FaWind, FaGlobeAsia, FaProjectDiagram, FaLayerGroup, FaArrowRight } from "react-icons/fa";
import Seo from "../components/seo/Seo.jsx";
import "../styles/resources.css";

const resources = [
  {
    title: "Free Structural Scope Guide",
    description: "Plan a structural assessment with a clearer scope before requesting quotations or preparing procurement documents.",
    icon: <FaBookOpen />,
    category: "Planning guide",
    path: "/free-structural-assessment-scope-guide",
  },
  {
    title: "NSCP 2015 Wind Speed Map",
    description: "A planned map for exploring wind speeds across the Philippines under NSCP 2015.",
    icon: <FaWind />,
    category: "Wind engineering",
  },
  {
    title: "Spectral Acceleration Map of Philippines",
    description: "A planned resource for exploring spectral acceleration across the Philippines.",
    icon: <FaGlobeAsia />,
    category: "Seismic engineering",
  },
  {
    title: "Truss Parametric 2D Design",
    description: "A planned tool for exploring parametric truss layouts and design in two dimensions.",
    icon: <FaProjectDiagram />,
    category: "Structural design",
  },
  {
    title: "Steel Deck Design",
    description: "A planned design tool for steel deck systems.",
    icon: <FaLayerGroup />,
    category: "Structural design",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Seo
        title="Resources | Ingeniare Structural Engineering Consultancy"
        description="Explore Ingeniare's free structural scope guide and upcoming engineering maps and design tools for the Philippines."
        path="/resources"
      />
      <section className="resources-header">
        <div className="container">
          <p className="resources-eyebrow">INGENIARE KNOWLEDGE & TOOLS</p>
          <h1>Resources</h1>
          <p className="resources-intro">Practical guidance for your next project, with engineering maps and design tools on the way.</p>
        </div>
      </section>
      <section className="section resources-library" aria-label="Engineering resources">
        <div className="container">
          <div className="resources-grid">
            {resources.map(({ title, description, icon, category, path }) => (
              <article className={`resource-card${path ? " resource-card-available" : ""}`} key={title}>
                <div className="resource-card-top">
                  <span className="resource-icon" aria-hidden="true">{icon}</span>
                  <span className={`resource-status${path ? " is-available" : ""}`}>{path ? "Available now Â· Free" : "Coming soon"}</span>
                </div>
                <p className="resource-category">{category}</p>
                <h2>{title}</h2>
                <p className="resource-description">{description}</p>
                <div className="resource-card-action">
                  {path ? (
                    <Link to={path} className="resource-link">Get the free guide <FaArrowRight aria-hidden="true" /></Link>
                  ) : (
                    <span className="resource-planned">Planned for development</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
