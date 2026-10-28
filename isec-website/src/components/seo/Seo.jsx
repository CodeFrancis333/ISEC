import React from "react";
import { Helmet } from "react-helmet";

const SITE_NAME = "INGENIARE STRUCTURAL ENGINEERING CONSULTANCY";
const SITE_URL = "https://www.ingeniare-sec.com";
const DEFAULT_TITLE = "Ingeniare Structural Engineering Consultancy | Structural Engineers in the Philippines";
const DEFAULT_DESCRIPTION =
  "Ingeniare Structural Engineering Consultancy provides structural design, evaluation, verification, and concrete assessment services for residential, commercial, industrial, and government projects in the Philippines.";
const DEFAULT_IMAGE = `${SITE_URL}/Ingeniare-Logo.png`;

const baseOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ["Ingeniare", "ISEC", "Ingeniare Structural Engineering Consultancy"],
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  email: "ingeniare.idc@gmail.com",
  telephone: "+63 951 235 9772",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10th Floor Parkway Corporate Center, Filinvest City, Alabang",
    addressLocality: "Muntinlupa City",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
  },
  areaServed: "Philippines",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61555895965392",
  ],
};

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  imageAlt = "INGENIARE STRUCTURAL ENGINEERING CONSULTANCY",
  robots = "index,follow",
  type = "website",
  schema,
}) => {
  const canonicalUrl = `${SITE_URL}${path}`;
  const schemaList = [baseOrganizationSchema, {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: "Ingeniare",
    inLanguage: "en-PH",
    publisher: { "@id": `${SITE_URL}/#organization` },
  }];

  if (schema) {
    schemaList.push(...(Array.isArray(schema) ? schema : [schema]));
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content="en_PH" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {schemaList.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
