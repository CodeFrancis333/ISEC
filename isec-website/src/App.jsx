import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";

import HeroPage from "./pages/HeroPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
