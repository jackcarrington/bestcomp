# Galveston Family Lawyers - Brand Styles Blueprint

**Extracted from WordPress Site for Astro Rebuild**

This document contains the complete brand identity and styling extracted from the original WordPress site to ensure consistent branding in the Astro framework rebuild.

---

## 🎨 **Brand Color Palette**

### Primary Colors
```css
:root {
  /* Primary Brand Colors */
  --brand-red: #ed1e24;           /* Primary accent color */
  --brand-orange: #d26b20;         /* Secondary accent/CTA color */
  --brand-orange-alt: #d26b21;     /* Orange variant */

  /* Neutral Colors */
  --text-primary: #000000;         /* Headings and emphasis */
  --text-secondary: #666666;       /* Body text */
  --text-tertiary: #7a7a7a;        /* Subtle text */
  --text-muted: #555555;           /* Muted text */

  /* Background Colors */
  --bg-white: #ffffff;
  --bg-light-gray: #f7f7f7;
  --bg-hover: #f1f1f1;

  /* Utility Colors */
  --border-light: rgba(0, 0, 0, 0.05);
  --shadow-soft: rgba(0, 0, 0, 0.1);
  --overlay-dark: rgba(0, 0, 0, 0.5);
  --overlay-black: rgba(0, 0, 0, 0.85);
}
```

### Accent Color Variations (from theme)
```css
/* Additional accent colors found in theme */
--green-success: #2ea85c;
--green-alt: #357b49;
--blue-info: #2bb8ed;
--blue-accent: #0693e3;
--purple-accent: #9b51e0;
--teal-accent: #33baab;
--red-error: #cf2e2e;
```

---

## ✍️ **Typography System**

### Font Families
```css
:root {
  /* Primary Fonts */
  --font-heading: 'Oswald', sans-serif;          /* All headings */
  --font-body: 'Public Sans', Arial, sans-serif; /* Body text */
  --font-ui: 'Open Sans', sans-serif;            /* UI elements */
  --font-decorative: 'DM Serif Text', serif;     /* Optional decorative */

  /* System Font Stack (fallback) */
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
}
```

### Font Sizes & Scale
```css
/* Base Configuration */
body {
  font-family: var(--font-body);
  font-size: 1em;
  line-height: 1.65em;
  color: var(--text-secondary);
  -webkit-font-smoothing: antialiased;
  overflow-wrap: break-word;
}

/* Heading Hierarchy */
h1 {
  font-family: var(--font-heading);
  font-size: 3em;              /* Desktop: ~48px */
  font-weight: 200;            /* Light weight */
  line-height: 1.2em;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

h2 {
  font-family: var(--font-heading);
  font-size: 2em;              /* Desktop: ~32px */
  font-weight: 600;            /* Semi-bold */
  line-height: 1.3em;
  letter-spacing: -0.02em;
  text-transform: capitalize;
  color: var(--text-primary);
}

h3 {
  font-family: var(--font-heading);
  font-size: 1.5em;            /* Desktop: ~24px */
  font-weight: 600;
  line-height: 1.4em;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* Body Text */
p {
  margin: 0 0 1.3em;
  padding: 0;
}

/* Links */
a {
  color: var(--brand-red);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--brand-orange);
}

/* Lists */
ul {
  margin: 0 0 1.4em 1.6em;
  padding: 0;
}

li {
  margin: 0 0 1em;
  padding: 0;
}
```

### Responsive Typography
```css
/* Tablet Landscape (1260px and below) */
@media (max-width: 1260px) {
  h1 { font-size: 2.4em; }  /* ~38px */
  h2 { font-size: 2em; }    /* ~32px */
}

/* Mobile (680px and below) */
@media (max-width: 680px) {
  h1 { font-size: 1.9em; }   /* ~30px */
  h2 { font-size: 1.6em; }   /* ~26px */
  h3 { font-size: 1.35em; }  /* ~22px */
}

/* Extra Small Mobile (480px and below) */
@media (max-width: 480px) {
  h1 { font-size: 1.5em; }   /* ~24px */
  h2 { font-size: 1em; }     /* ~16px */
}
```

---

## 📐 **Layout & Spacing System**

### Container Widths
```css
/* Main Content Container */
.pagewidth {
  margin: 0 auto;
  max-width: 100%;
  width: 1160px;
}

/* Responsive Container Widths */
@media (max-width: 1260px) {
  .pagewidth {
    max-width: 94%;
  }
}

@media (max-width: 760px) {
  .pagewidth {
    max-width: 90%;
  }
}
```

### Grid System (Column Layout)
```css
/* 4-Column Grid */
.col4-1 {
  float: left;
  width: 22.6%;
  margin-left: 3.2%;
}

.col4-2 {
  float: left;
  width: 48.4%;
  margin-left: 3.2%;
}

/* 3-Column Grid */
.col3-1 {
  float: left;
  width: 31.2%;
  margin-left: 3.2%;
}

/* First Column (no left margin) */
.col4-1.first,
.col4-2.first,
.col3-1.first {
  clear: left;
  margin-left: 0;
}

/* Mobile: Full Width */
@media (max-width: 680px) {
  .col3-1,
  .col4-2 {
    margin-left: 0;
    max-width: 100%;
    width: 100%;
  }
}
```

### Spacing Variables
```css
:root {
  /* Gutter System */
  --gutter-standard: 3.2%;
  --gutter-narrow: 1.6%;
  --gutter-none: 0;

  /* Padding Values */
  --padding-small: 5px;
  --padding-medium: 10px;
  --padding-large: 20px;
  --padding-xlarge: 30px;
  --padding-xxlarge: 50px;

  /* Section Spacing */
  --section-padding-top: 50px;
  --section-padding-bottom: 50px;
  --section-padding-mobile: 15%;
}
```

---

## 🎯 **Button & CTA Styles**

### Primary Button (Orange CTA)
```css
.button-primary {
  display: inline-block;
  padding: 0.625em 1.25em;
  font-size: 1em;
  line-height: 1.35;
  border-radius: 5px;
  background-color: var(--brand-orange);
  color: #ffffff;
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

.button-primary:hover {
  background-color: #c16832;  /* Slightly darker orange */
}
```

### Secondary Button (Transparent)
```css
.button-secondary {
  display: inline-block;
  padding: 0.625em 1.25em;
  font-size: 1em;
  line-height: 1.35;
  background-color: transparent;
  color: var(--text-primary);
  text-decoration: none;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.button-secondary:hover {
  background-color: var(--bg-hover);
}
```

---

## 🔲 **Component Styles**

### Top Bar (Orange Header)
```css
.top-bar {
  background-color: var(--brand-orange);
  padding: 5px 0;
  color: #ffffff;
}

.top-bar a {
  color: #ffffff;
  text-decoration: none;
}
```

### Hero Section
```css
.hero-section {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-attachment: scroll;
  padding: 200px 0;
  text-align: center;
  position: relative;
}

/* Dark Overlay */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: inherit;
}

.hero-section h1,
.hero-section h2,
.hero-section p {
  color: #ffffff;
  position: relative;
  z-index: 1;
}

/* Mobile Hero */
@media (max-width: 480px) {
  .hero-section {
    padding: 150px 0;
  }
}
```

### Navigation Menu
```css
.nav-menu {
  display: inline-block;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-menu li {
  display: inline-block;
  margin: 0 0 0 -0.25em;
  padding: 0;
  position: relative;
}

.nav-menu li a {
  display: inline-block;
  padding: 0.625em 1.25em;
  color: var(--text-primary);
  text-decoration: none;
  text-transform: uppercase;
  font-family: var(--font-ui);
  font-size: 0.9em;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.nav-menu li a:hover,
.nav-menu .current_page_item a {
  background-color: var(--bg-hover);
}

/* Dropdown Submenu */
.nav-menu .sub-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 220px;
  background-color: var(--overlay-black);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 5px 0;
  z-index: 990;
}

.nav-menu .sub-menu a {
  display: block;
  color: #ffffff;
  text-transform: none;
  font-size: 0.9em;
  font-weight: 400;
}
```

### Card/Callout Module
```css
.callout-card {
  background-color: #ffffff;
  border: 1px solid var(--border-light);
  padding: 1em 1.5em;
  border-radius: 8px;
  box-shadow: 10px 5px 10px 2px var(--shadow-soft);
}

.callout-card .heading {
  font-size: 1.8em;
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-weight: 600;
}

.callout-card .content {
  margin: 0.5em 0;
  color: var(--text-secondary);
}

.callout-card .button {
  margin-top: 15px;
}
```

### Image Styles
```css
.image-rounded {
  border-radius: 8px;
}

.image-shadow {
  box-shadow: 0 1px 8px 2px rgba(0, 0, 0, 0.15);
}

img {
  max-width: 100%;
  height: auto;
  border: 0;
  box-sizing: border-box;
  vertical-align: bottom;
}

.alignright {
  float: right;
  margin-left: 1em;
}

.alignleft {
  float: left;
  margin-right: 1em;
}
```

---

## 📱 **Responsive Breakpoints**

```css
/* Standard Breakpoint System */
:root {
  --breakpoint-desktop: 1260px;
  --breakpoint-tablet-landscape: 1024px;
  --breakpoint-tablet: 768px;
  --breakpoint-mobile: 680px;
  --breakpoint-mobile-small: 480px;
}

/* Media Query Reference */
/* Desktop: Default (1261px+) */
/* Laptop: @media (max-width: 1260px) */
/* Tablet Landscape: @media (max-width: 1024px) */
/* Tablet: @media (max-width: 768px) */
/* Mobile: @media (max-width: 680px) */
/* Mobile Small: @media (max-width: 480px) */
```

---

## 🎨 **Utility Classes**

```css
/* Layout Utilities */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.float-left { float: left; }
.float-right { float: right; }
.clear-both { clear: both; }

/* Display */
.hide { display: none; }
.inline-block { display: inline-block; }
.block { display: block; }

/* Positioning */
.relative { position: relative; }
.absolute { position: absolute; inset: 0; }

/* Width */
.full-width { width: 100%; }
.max-width { max-width: 100%; }

/* Text Alignment */
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Scrollbar */
.custom-scrollbar {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(137, 137, 137, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Responsive Hide */
@media (min-width: 1025px) {
  .hide-desktop {
    display: none !important;
    visibility: hidden !important;
  }
}

@media (max-width: 768px) {
  .hide-tablet {
    display: none !important;
    visibility: hidden !important;
  }
}

@media (max-width: 480px) {
  .hide-mobile {
    display: none !important;
    visibility: hidden !important;
  }
}
```

---

## 🔧 **Implementation Notes for Astro**

### Converting to Astro/Tailwind

1. **Add Google Fonts** (include in `<head>` of Layout.astro):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;400;600;700&family=Public+Sans:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=DM+Serif+Text:ital@0;1&display=swap" rel="stylesheet">
```

2. **Tailwind Config Extensions** (add to `tailwind.config.ts`):
```typescript
export default {
  theme: {
    extend: {
      colors: {
        'brand-red': '#ed1e24',
        'brand-orange': '#d26b20',
        'text-primary': '#000000',
        'text-secondary': '#666666',
        'text-tertiary': '#7a7a7a',
      },
      fontFamily: {
        'heading': ['Oswald', 'sans-serif'],
        'body': ['Public Sans', 'Arial', 'sans-serif'],
        'ui': ['Open Sans', 'sans-serif'],
        'serif': ['DM Serif Text', 'serif'],
      },
      fontSize: {
        'h1': '3em',
        'h2': '2em',
        'h3': '1.5em',
      },
      maxWidth: {
        'site': '1160px',
      },
    },
  },
}
```

3. **CSS Custom Properties** (add to `src/styles/global.css`):
- Use the `:root` color variables defined above
- Implement responsive typography with `clamp()` for fluid scaling
- Keep existing Astro casino theme colors alongside brand colors

4. **Migration Priority**:
- ✅ Color palette (Critical - brand identity)
- ✅ Typography system (Critical - readability)
- ✅ Button styles (High - conversion)
- ✅ Navigation styles (High - UX)
- ⚠️ Layout grid (Medium - can use Tailwind grid)
- ⚠️ Component modules (Low - rebuild as Astro components)

---

## 📚 **Font Loading Strategy**

For optimal performance in Astro:

```astro
---
// In Layout.astro head
---
<head>
  <!-- Preconnect to Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Load critical fonts -->
  <link
    href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;600;700&family=Public+Sans:wght@400;600&display=swap"
    rel="stylesheet"
  />
</head>
```

**CSP Compliance**: Add to public/_headers:
```
/*
  font-src 'self' https://fonts.gstatic.com data:;
  style-src 'self' https://fonts.googleapis.com;
```

---

## ✅ **Verification Checklist**

Before launch, verify:
- [ ] All brand colors match original site
- [ ] Typography hierarchy is identical
- [ ] Responsive breakpoints work correctly
- [ ] Button hover states match
- [ ] Navigation styling is consistent
- [ ] Hero section overlay darkness matches
- [ ] Font weights load correctly
- [ ] Mobile menu functions properly
- [ ] Links have proper color (#ed1e24 → #d26b20 on hover)

---

**Document Version**: 1.0
**Last Updated**: October 20, 2025
**Source**: galvestonfamilylawyer.com (WordPress)
**Target**: Astro Framework Rebuild
