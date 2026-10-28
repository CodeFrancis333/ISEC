import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "./components/layout/Layout.jsx";

const pages = {
  "/": () => import("./pages/HeroPage.jsx"),
  "/about": () => import("./pages/AboutPage.jsx"),
  "/services": () => import("./pages/ServicesPage.jsx"),
  "/portfolio": () => import("./pages/PortfolioPage.jsx"),
  "/contact": () => import("./pages/ContactPage.jsx"),
  "/resources": () => import("./pages/ResourcesPage.jsx"),
  "/resources/crack-mapping": () => import("./pages/CrackMappingPage.jsx"),
  "/resources/steel-deck-design": () => import("./features/deck/SteelDeckPage.jsx"),
  "/resources/nscp-2015-wind-map": () => import("./features/wind/WindMapPage.tsx"),
  "/free-structural-assessment-scope-guide": () => import("./pages/StructuralAssessmentGuidePage.jsx"),
  "/privacy-policy": () => import("./pages/PrivacyPolicyPage.jsx"),
  "/terms-of-service": () => import("./pages/TermsOfServicePage.jsx"),
  "/engineering-compliance-statements": () => import("./pages/EngineeringCompliancePage.jsx"),
  "/thank-you": () => import("./pages/ThankYouPage.jsx"),
  "/404": () => import("./pages/NotFoundPage.jsx"),
};

export async function render(path) {
  if (!pages[path]) throw new Error(`Missing prerender route: ${path}`);
  const { default: Page } = await pages[path]();
  const body = renderToString(<StaticRouter location={path}><Layout><Page /></Layout></StaticRouter>);
  const helmet = Helmet.renderStatic();
  return {
    // Preserve visible content before JS starts, including animated page sections.
    body: body.replace(/opacity:0(?=;|")/g, "opacity:1"),
    head: [helmet.title, helmet.meta, helmet.link, helmet.script].map((item) => item.toString()).join("\n"),
  };
}
