import React from "react";
import { Helmet } from "react-helmet";

const SITE_NAME = "Ingeniare Structural Engineering Consultancy";
const SITE_URL = "https://www.ingeniare-sec.com";
const DEFAULT_TITLE = "Ingeniare Structural Engineering Consultancy | Structural Engineers in the Philippines";
const DEFAULT_DESCRIPTION =
  "Ingeniare Structural Engineering Consultancy provides structural design, evaluation, verification, and concrete assessment services for residential, commercial, industrial, and government projects in the Philippines.";
const DEFAULT_IMAGE = `${SITE_URL}/Ingeniare-Logo.png`;

const baseOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  alternateName: "ISEC",
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  email: "ingeniare.idc@gmail.com",
  telephone: "+63 951 235 9772",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Candelaria",
    addressRegion: "Quezon",
    addressCountry: "PH",
  },
  areaServed: "Philippines",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61555895965392",
    "https://www.linkedin.com",
  ],
};

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  robots = "index,follow",
  type = "website",
  schema,
}) => {
  const canonicalUrl = `${SITE_URL}${path}`;
  const schemaList = [baseOrganizationSchema];

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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemaList.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
