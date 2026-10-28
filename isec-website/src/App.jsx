import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AnalyticsTracker from "./components/analytics/AnalyticsTracker.jsx";
import ExternalAnalytics from "./components/analytics/ExternalAnalytics.jsx";
import Layout from "./components/layout/Layout.jsx";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";

import HeroPage from "./pages/HeroPage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import CrackMappingPage from "./pages/CrackMappingPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import StructuralAssessmentGuidePage from "./pages/StructuralAssessmentGuidePage.jsx";
import ThankYouPage from "./pages/ThankYouPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import EngineeringCompliancePage from "./pages/EngineeringCompliancePage";
const WindMapPage = lazy(() => import("./features/wind/WindMapPage.tsx"));
const SteelDeckPage = lazy(() => import("./features/deck/SteelDeckPage.jsx"));


function App() {
  return (
    <>
      <ExternalAnalytics />
      <AnalyticsTracker />
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/crack-mapping" element={<CrackMappingPage />} />
          <Route path="/resources/steel-deck-design" element={<Suspense fallback={<p className="container py-5" role="status">Loading steel deck design...</p>}><SteelDeckPage /></Suspense>} />
          <Route path="/resources/nscp-2015-wind-map" element={<Suspense fallback={<p className="container py-5" role="status">Loading wind map…</p>}><WindMapPage /></Suspense>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/free-structural-assessment-scope-guide"
            element={<StructuralAssessmentGuidePage />}
          />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route
            path="/engineering-compliance-statements"
            element={<EngineeringCompliancePage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
