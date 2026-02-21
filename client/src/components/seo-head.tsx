import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPageSEO, schoolInfo, type pageSEO } from '@shared/seo-config';

interface SeoHeadProps {
  page: keyof typeof pageSEO;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  customKeywords?: string;
}

export default function SeoHead({ 
  page, 
  customTitle, 
  customDescription,
  customImage,
  customKeywords
}: SeoHeadProps) {
  const { language } = useLanguage();
  const seo = getPageSEO(page, language);
  
  const title = customTitle || seo.title;
  const description = customDescription || seo.description;
  const keywords = customKeywords || seo.keywords;
  const canonicalUrl = `https://fgs.kz${seo.path}`;
  const imageUrl = customImage || 'https://fgs.kz/og-image.jpg';
  
  const schoolName = language === 'kz' ? schoolInfo.nameKk : schoolInfo.nameRu;
  const schoolCity = language === 'kz' ? schoolInfo.cityKk : schoolInfo.cityRu;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={schoolName} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={language === 'kz' ? 'Kazakh' : 'Russian'} />
      <meta name="geo.region" content="KZ-10" />
      <meta name="geo.placename" content={schoolCity} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for Bilingual Support */}
      <link rel="alternate" hrefLang="kk" href={`https://fgs.kz${seo.path}?lang=kz`} />
      <link rel="alternate" hrefLang="ru" href={`https://fgs.kz${seo.path}?lang=ru`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={schoolName} />
      <meta property="og:locale" content={language === 'kz' ? 'kk_KZ' : 'ru_KZ'} />
      <meta property="og:locale:alternate" content={language === 'kz' ? 'ru_KZ' : 'kk_KZ'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* VK Social Media */}
      <meta property="vk:image" content={imageUrl} />
      
      {/* Yandex Verification (add your actual verification code here) */}
      <meta name="yandex-verification" content="your-yandex-verification-code" />
      
      {/* Google Site Verification (add your actual verification code here) */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      
      {/* Additional Yandex Meta Tags */}
      <meta name="document-state" content="dynamic" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
    </Helmet>
  );
}