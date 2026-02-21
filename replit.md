# Overview

This project is a React-based school website for "FGS - Болашақ ұрпақ мектебі" (Future Generation School) in Shymkent. It provides comprehensive school information, including dedicated pages for school documents, administration, educational processes, and upbringing work. The application features a fixed contact bar, detailed navigation, engaging content primarily in Kazakh, and is built with modern full-stack technologies in a monorepo structure. Its primary purpose is to serve as a digital hub for the school, offering information to students, parents, and staff while reflecting a modern educational institution.

## Recent Updates
- **Document Management Enhanced**: Added full CRUD operations for school documents at /admin/documents. Features: Add/Edit/Delete documents, PDF file upload from computer or URL, section categories (Мектептің негізгі құжаттары, ДосболLike, Адал азамат, Парламент, etc.), color coding, filter by section. Upload endpoint: POST /api/upload (November 26, 2025)
- **Admin Route Fix**: Fixed issue where /administration page was blank because it was incorrectly matched as admin route. Changed route detection from `location.startsWith("/admin")` to `location.startsWith("/admin/") || location === "/admin"` in App.tsx (November 26, 2025)
- **Admin Panel Implemented**: Full content management system at /admin with session-based authentication. Features: Dashboard with stats, Document management (CRUD for PDFs), Events management, Media gallery (photos/videos), Teachers management, News management. Login: /admin/login, default username "admin". Database tables: events, media, documents, teachers, news. API routes: /api/auth/*, /api/events, /api/documents, /api/media, /api/teachers, /api/news (November 26, 2025)
- **Teachers Section Hidden**: Temporarily hidden "Мұғалімдер" menu item from navigation (both desktop and mobile). Page /primary-teachers remains accessible via direct link. To restore: set `hideTeachers = false` in client/src/components/responsive-navbar.tsx (October 28, 2025)
- **Canteen Page Content Cleanup**: Removed "Өнім жеткізушілер" (Suppliers) and "Жетістіктер мен сертификаттар" (Achievements) sections. Changed "Манды каша" to "Манка ботқасы". Added proper dark mode styles to all input fields and form elements (October 28, 2025)
- **Schedule Page Complete Redesign**: Updated clubs/extracurricular activities schedule for 2025-2026 academic year with data from new images. Page now displays: (1) Additional courses section with 3 courses (Language courses by Пенебек Камилла, Intellectual games club by Шадиева Дидар, Math courses by Шадиева Дидар), (2) Main clubs schedule table with 20 activities including Debates (6 groups by Зиналдинова Раушан), Robotics (3 groups by Ускенбаева Сая), Elective mathematics (7 groups by Байдусенова Жанар), Logic development (4 groups by Шадиева Дидар). Desktop shows full table, mobile displays responsive card view. Director: Бейсебаева Ж.М. (October 21, 2025)
- **SEO Optimization for Google & Yandex**: Comprehensive SEO implementation including react-helmet-async for dynamic meta tags, bilingual SEO configuration, JSON-LD structured data (Organization, EducationalOrganization, LocalBusiness), Open Graph tags, Twitter Cards, hreflang tags for Kazakh/Russian, canonical URLs, robots.txt, sitemap.xml with bilingual support, and Yandex.Metrica integration (October 21, 2025)
- **News Section Photo Update**: Replaced stock photo in news section with real FGS school photo showing students with achievement certificates (iPhone certificate and 100,000₸ certificate) to match article about Жаксыбек Ерхан (October 13, 2025)
- **Adaptive Swipeable Gallery**: Rebuilt photo gallery with Embla Carousel - desktop shows 4 photos with arrow navigation, mobile shows 1 photo with swipe gestures. Features smooth animations, uniform heights (350-400px), rounded corners, shadows, and 16 school event photos (October 13, 2025)
- **Social Media Icons Animation**: Added interactive animations to Instagram, Telegram, and WhatsApp icons (rotate, scale, bounce on hover) with white text in dark mode for better visibility (October 13, 2025)
- **Student Achievement Gallery**: Implemented uniform-height (220px) photo gallery featuring 3 FGS students with НИШ/РФМШ/БИЛ certificates, using object-position: center top to ensure faces are fully visible without cropping (Updated October 20, 2025)
- **Direction Photos Update**: Replaced all three direction photos (ШЫҒАРМАШЫЛЫҚ - children with dombras, ИНТЕЛЛЕКТУАЛДЫ - robotics/LEGO, СПОРТТЫҚ - children with hoops) with real school photos (October 13, 2025)
- **UPay Section Repositioning**: Moved UPay section to the top of students page, displayed before all other content sections while maintaining identical spacing and responsiveness (October 13, 2025)
- **Scrollbar Removal**: Globally hidden scrollbar for all browsers (Chrome, Safari, Firefox, IE) and all devices for cleaner appearance (October 13, 2025)
- **UPay Card Navigation**: Made UPay card accessible and clickable using Link component - now redirects to /students#upay section with keyboard support (October 13, 2025)
- **Grade Levels**: Updated from "1-9 сыныптары" to "0-9 сыныптары" across all pages (October 13, 2025)
- **Administration**: Updated deputy director for academic affairs to Сарсенбаева Алия Раманкуловна (October 13, 2025)
- **Home Page**: Removed all section-specific backgrounds for unified page appearance (October 13, 2025)
- **Application Button Fix**: Fixed "Өтінім жіберу" button to properly scroll to contact form by adding id="apply" to contact section (October 13, 2025)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Design Principles
The application uses a monorepo structure with separate client and server directories, leveraging TypeScript for type safety. It emphasizes a modern, responsive UI/UX with a consistent blue and white color scheme and smooth animations.

## Frontend Architecture
-   **Framework**: React with TypeScript, bundled by Vite.
-   **Routing**: Wouter.
-   **UI Components**: shadcn/ui built on Radix UI primitives.
-   **Styling**: Tailwind CSS with custom CSS variables.
-   **State Management**: React Query for server state.
-   **Forms**: React Hook Form with Zod validation.
-   **UI/UX Decisions**:
    -   **Color Scheme**: Predominantly blue and white, with deep blue gradients. Includes a comprehensive deep dark mode theme with premium gradients.
    -   **Layout**: Fixed left sidebar navigation (250px width, dark green background) with vertical Kazakh menu.
    -   **Animations**: Smooth fade-up, hover effects, scale transforms, and gentle bouncing. Framer Motion for staggered animations.
    -   **Visual Elements**: Use of real photos, circular student profiles, full-screen hero section with school building photo and gradient overlay.
    -   **Content Presentation**: Interactive collapsible FAQ cards, structured sections, dedicated teacher pages, animated photo gallery, director's quote blocks, and animated achievement infographics.
    -   **Language**: Bilingual system for Kazakh and Russian with a language switcher.
    -   **Navigation**: Premium redesigned navigation menu with glassmorphism effects and gradient hover effects.
    -   **Theme Synchronization**: Cross-tab theme synchronization via localStorage.
    -   **Virtual Chat Assistant**: Intelligent chat assistant "FGS Көмекші" with quick actions and WhatsApp integration.

## Backend Architecture
-   **Runtime**: Node.js with Express.js.
-   **Language**: TypeScript.
-   **Database ORM**: Drizzle ORM.
-   **Database**: PostgreSQL (configured for Neon Database).
-   **Session Management**: Connect-pg-simple for PostgreSQL session storage.

## Data Storage Solutions
-   **Primary Database**: PostgreSQL via Neon Database service.
-   **ORM**: Drizzle ORM with migrations.
-   **Schema**: Centralized in `/shared/schema.ts` with Zod validation.
-   **Session Storage**: PostgreSQL-backed sessions.

## Authentication and Authorization
-   **Method**: Session-based authentication using Express sessions with PostgreSQL storage.

## Project Structure
-   **Monorepo Layout**: Client and server code in separate directories.
-   **Shared Types**: Common types and schemas in a `/shared` directory.

# External Dependencies

## Database Services
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **connect-pg-simple**: PostgreSQL session store.

## UI and Component Libraries
-   **Radix UI**: Accessible UI components.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Lucide React**: Icon library.
-   **Embla Carousel**: Touch-friendly carousel.
-   **shadcn/ui**: Reusable UI components.

## Development and Build Tools
-   **Vite**: Fast build tool and development server.
-   **Drizzle Kit**: Database migration and management.
-   **esbuild**: Fast JavaScript bundler.
-   **tsx**: TypeScript execution environment.
-   **Framer Motion**: Animation library.

## Form and Validation
-   **React Hook Form**: Form management.
-   **Zod**: TypeScript-first schema validation.
-   **@hookform/resolvers**: Integration for validation.

## Additional Integrations
-   **React Query**: Server state management and caching.
-   **Wouter**: Lightweight routing library.
-   **date-fns**: Date utility library.
-   **UPay**: Digital currency system for schools (external link integration).