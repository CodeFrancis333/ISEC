import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COOKIE_NAME = "isec_visitor_id";
const SESSION_KEY = "isec_session_id";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const ANALYTICS_ENDPOINT =
  import.meta.env.VITE_ANALYTICS_ENDPOINT ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000/api/analytics/track/" : "");

const createId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getCookie = (name) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};

const setCookie = (name, value) => {
  document.cookie = `${name}=${value}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
};

const getVisitorId = () => {
  const existingVisitorId = getCookie(COOKIE_NAME);
  if (existingVisitorId) return existingVisitorId;

  const visitorId = createId();
  setCookie(COOKIE_NAME, visitorId);
  return visitorId;
};

const getSessionId = () => {
  const existingSessionId = window.sessionStorage.getItem(SESSION_KEY);
  if (existingSessionId) return existingSessionId;

  const sessionId = createId();
  window.sessionStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
};

const sendPageView = (payload) => {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(ANALYTICS_ENDPOINT, blob)) return;
  }

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt normal site navigation.
  });
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!ANALYTICS_ENDPOINT) return;

    const path = `${location.pathname}${location.search}`;

    sendPageView({
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      path,
      title: document.title,
      referrer: document.referrer,
      source: "website",
    });
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
