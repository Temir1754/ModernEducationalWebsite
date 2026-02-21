# FGS School Admin Panel Design Guidelines

## Design Approach
**Selected System**: Material Design 3 with modern admin dashboard refinements
**Rationale**: Material Design excels at data-heavy applications with clear information hierarchy, robust form patterns, and native dark mode support - perfect for content management systems.

## Layout Architecture

**Dashboard Structure**: Fixed sidebar (280px) + main content area with top navigation bar (64px height)

**Sidebar Navigation**:
- School logo/name at top (80px height)
- Navigation groups: Dashboard, Content Management (Events, News, Media, Documents), People (Teachers, Students), Settings
- Active state: Subtle blue background (blue-50 in light, blue-900 in dark)
- Icons from Material Icons CDN
- User profile section at bottom with avatar, name, role

**Main Content Area**:
- Top bar: Page title (left), search bar (center), notifications + profile (right)
- Content uses max-width container (max-w-7xl) with px-8 py-6 padding
- Responsive: Sidebar collapses to hamburger menu on mobile

## Typography System
**Fonts**: Inter (via Google Fonts) - single family with weight variations
- Page titles: text-2xl, font-semibold
- Section headers: text-lg, font-medium
- Body text: text-base, font-normal
- Labels/meta: text-sm, font-medium
- Table headers: text-xs, font-semibold, uppercase, tracking-wide

## Spacing Primitives
**Standard Units**: Use Tailwind's 4, 6, 8, 12, 16 for consistent rhythm
- Card padding: p-6
- Section spacing: mb-8
- Form field spacing: space-y-4
- Grid gaps: gap-6
- Button padding: px-4 py-2

## Component Library

**Cards (Content Containers)**:
- White background (light) / gray-800 (dark) with subtle border
- Rounded corners (rounded-lg)
- Shadow: shadow-sm with hover:shadow-md transition
- Header section with title + action button
- Divider between header and content (border-b)

**Data Tables**:
- Alternating row backgrounds for readability
- Sticky header row
- Action column (right-aligned) with icon buttons
- Sortable column headers with sort indicators
- Pagination footer: items per page + page numbers + total count

**Form Inputs**:
- Full-width inputs with clear labels above
- Border style: border-2 with focus:border-blue-500 ring
- Height: h-11 for consistency
- Helper text below in text-sm text-gray-600
- Required field indicator: red asterisk
- Error states: red border + error message below

**Buttons**:
- Primary: Blue background, white text, medium weight
- Secondary: Blue outline, blue text
- Ghost: Transparent with blue text for tertiary actions
- Icon buttons: 40x40px touch targets
- Sizes: sm (px-3 py-1.5), md (px-4 py-2), lg (px-6 py-3)

**Action Modals**:
- Overlay with backdrop blur
- Centered modal (max-w-lg for forms, max-w-3xl for content)
- Header with title + close button
- Footer with action buttons (right-aligned)

**Dashboard Widgets**:
- Stat cards: 4-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Each card shows: metric value (text-3xl, font-bold), label, trend indicator (arrow + percentage)
- Charts use Chart.js library
- Recent activity feed: timeline layout with timestamps

**Media Management**:
- Grid view: 3-4 columns of image thumbnails with overlay info on hover
- List view: Table with thumbnail, name, type, size, date, actions
- Upload zone: Dashed border drag-drop area with file browser fallback

## Dark Mode Implementation
- Background: gray-900 for main areas, gray-800 for cards
- Text: gray-100 for primary, gray-400 for secondary
- Borders: gray-700
- Toggle switch in top navigation bar
- All components must support both themes seamlessly

## No Hero Images
Admin panels focus on functionality over marketing imagery. Dashboard leads directly with stat cards and recent activity.

## Critical Features
- Breadcrumb navigation below top bar for deep pages
- Inline editing for table cells (double-click to edit)
- Bulk actions: Checkbox column in tables with action bar when items selected
- Toast notifications for actions (top-right corner, auto-dismiss)
- Empty states: Centered illustration + helpful text + CTA button
- Loading states: Skeleton screens for tables/cards
- Filter panels: Collapsible side panel with form controls
- Export buttons: Download as CSV/PDF for tables

**Page Layouts**:
- List pages: Filters (top) + table + pagination
- Create/Edit: Two-column form (8/4 split) with preview pane on right
- Dashboard: Stats row + 2-column grid (activity feed + quick actions)