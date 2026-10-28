import { Link } from "react-router-dom";
import { FaBookOpen, FaWind, FaGlobeAsia, FaProjectDiagram, FaLayerGroup, FaArrowRight } from "react-icons/fa";
import Seo from "../components/seo/Seo.jsx";
import "../styles/resources.css";

const resources = [
  {
    title: "Crack Mapping",
    description: "Meet our free Android alpha for offline AI crack tracing. Explore its current limitations and help Ingeniare Research improve it.",
    icon: <FaProjectDiagram />,
    category: "Ingeniare Research",
    path: "/resources/crack-mapping",
    status: "Alpha / Android",
    action: "Explore crack mapping",
  },
  {
    title: "Free Structural Scope Guide",
    description: "Plan a structural assessment with a clearer scope before requesting quotations or preparing procurement documents.",
    icon: <FaBookOpen />,
    category: "Planning guide",
    path: "/free-structural-assessment-scope-guide",
  },
  {
    title: "NSCP 2015 Wind Speed Map",
    description: "Explore Philippine locations and NSCP occupancy categories. Wind-speed data validation is in progress.",
    icon: <FaWind />,
    category: "Wind engineering",
    path: "/resources/nscp-2015-wind-map",
    status: "Map preview",
    action: "Open wind map",
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
    description: "Review steel deck gravity calculations with visible formulas, catalog comparisons and an exportable PDF calculation report.",
    icon: <FaLayerGroup />,
    category: "Structural design",
    path: "/resources/steel-deck-design",
    status: "Preliminary worksheet",
    action: "Open steel deck design",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Seo
        title="Free Engineering Tools & Resources | Ingeniare Philippines"
        description="Explore Ingeniare's free engineering resources: offline Android crack mapping, a structural assessment guide, a Philippine wind map, and steel deck calculations."
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
            {resources.map(({ title, description, icon, category, path, status, action }) => (
              <article className={`resource-card${path ? " resource-card-available" : ""}`} key={title}>
                <div className="resource-card-top">
                  <span className="resource-icon" aria-hidden="true">{icon}</span>
                  <span className={`resource-status${path ? " is-available" : ""}`}>{status || (path ? "Available now / Free" : "Coming soon")}</span>
                </div>
                <p className="resource-category">{category}</p>
                <h2>{title}</h2>
                <p className="resource-description">{description}</p>
                <div className="resource-card-action">
                  {path ? (
                    <Link to={path} className="resource-link">{action || "Get the free guide"} <FaArrowRight aria-hidden="true" /></Link>
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
