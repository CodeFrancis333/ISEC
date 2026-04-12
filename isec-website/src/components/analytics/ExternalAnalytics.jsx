import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || "";

const loadScript = ({ id, src, async = true }) => {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = async;
  document.head.appendChild(script);
};

const initializeGoogleAnalytics = () => {
  if (!GA_MEASUREMENT_ID || window.gtag) return;

  loadScript({
    id: "google-analytics-gtag",
    src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
  });

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });
};

const initializeMicrosoftClarity = () => {
  if (!CLARITY_PROJECT_ID || window.clarity) return;

  window.clarity = function clarity() {
    window.clarity.q = window.clarity.q || [];
    window.clarity.q.push(arguments);
  };

  loadScript({
    id: "microsoft-clarity",
    src: `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`,
  });
};

const ExternalAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    initializeGoogleAnalytics();
    initializeMicrosoftClarity();
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}`,
    });
  }, [location.pathname, location.search]);

  return null;
};

export default ExternalAnalytics;
