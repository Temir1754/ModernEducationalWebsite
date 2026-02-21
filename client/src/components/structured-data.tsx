import { Helmet } from 'react-helmet-async';
import { organizationSchema, schoolInfo } from '@shared/seo-config';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type?: 'organization' | 'breadcrumb' | 'person';
  breadcrumbs?: BreadcrumbItem[];
  personData?: {
    name: string;
    jobTitle: string;
    worksFor: string;
    description?: string;
  };
}

export default function StructuredData({ 
  type = 'organization',
  breadcrumbs,
  personData
}: StructuredDataProps) {
  const { language } = useLanguage();
  
  const getOrganizationSchema = () => {
    return JSON.stringify(organizationSchema);
  };
  
  const getBreadcrumbSchema = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `https://fgs.kz${item.url}`
      }))
    };
    
    return JSON.stringify(breadcrumbList);
  };
  
  const getPersonSchema = () => {
    if (!personData) return null;
    
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": personData.name,
      "jobTitle": personData.jobTitle,
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": language === 'kz' ? schoolInfo.nameKk : schoolInfo.nameRu
      },
      "description": personData.description || ""
    };
    
    return JSON.stringify(person);
  };
  
  const getLocalBusinessSchema = () => {
    const localBusiness = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": language === 'kz' ? schoolInfo.nameKk : schoolInfo.nameRu,
      "image": "https://fgs.kz/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": language === 'kz' ? schoolInfo.cityKk : schoolInfo.cityRu,
        "addressCountry": "KZ"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 42.3333,
        "longitude": 69.6
      },
      "telephone": schoolInfo.phoneKk,
      "email": schoolInfo.emailKk,
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      "priceRange": "$$"
    };
    
    return JSON.stringify(localBusiness);
  };
  
  return (
    <Helmet>
      {type === 'organization' && (
        <>
          <script type="application/ld+json">
            {getOrganizationSchema()}
          </script>
          <script type="application/ld+json">
            {getLocalBusinessSchema()}
          </script>
        </>
      )}
      
      {type === 'breadcrumb' && breadcrumbs && (
        <script type="application/ld+json">
          {getBreadcrumbSchema()}
        </script>
      )}
      
      {type === 'person' && personData && (
        <script type="application/ld+json">
          {getPersonSchema()}
        </script>
      )}
    </Helmet>
  );
}
