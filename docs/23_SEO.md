# 23 SEO Architecture Specification
**Project**: SODAARS  
**Document**: Search Engine Optimization, Metadata & Crawling Strategy  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Surface-Specific SEO Scoping

SEO requirements are strictly differentiated across the three SODAARS surfaces:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SEO SCOPE MATRIX                              │
├─────────────────────┬────────────────────────┬─────────────────────────┤
│ Surface             │ Rendering Engine       │ SEO Directives          │
├─────────────────────┼────────────────────────┼─────────────────────────┤
│ Marketplace         │ Next.js (SSR / ISR)    │ Index, Follow (Primary) │
│ Provider Public Web │ React + Vite (Static)  │ Index, Follow           │
│ Provider Panel      │ React SPA (Private)    │ Noindex, Nofollow       │
│ Admin Platform      │ React SPA (Private)    │ Noindex, Nofollow       │
└─────────────────────┴────────────────────────┴─────────────────────────┘
```

---

## 2. Marketplace SEO Architecture (Next.js)

The Marketplace leverages Next.js App Router server-side rendering to ensure immediate visibility of outdoor advertising assets to search engines.

### 2.1 Dynamic Metadata Generation
Each public resource profile (`/resources/[slug]`) dynamically renders rich metadata:
- **Title**: `[Resource Type] at [Landmark], [City] | SODAARS Marketplace`  
  *(e.g., "Prime Unipole at Benz Circle, Vijayawada | SODAARS Marketplace")*
- **Meta Description**: Specific physical dimensions, illumination type, facing traffic direction, and location context.
- **OpenGraph & Twitter Cards**: High-resolution daytime photograph of the asset face used as the featured preview image.
- **Canonical URLs**: Strictly self-referencing canonical links to prevent duplicate indexing across faceted filter permutations.

### 2.2 Structured Data (JSON-LD)
Pages inject Schema.org JSON-LD microdata representing outdoor physical assets:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Unipole - Benz Circle Facing MG Road",
  "description": "Premium 40x20 ft front-lit static outdoor unipole located at Benz Circle.",
  "category": "Outdoor Advertising",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "97500",
    "availability": "https://schema.org/InStock"
  }
}
```

### 2.3 XML Sitemap & Crawling Control
- **`sitemap.ts`**: Automatically aggregates:
  - Static marketing pages (`/`, `/about`, `/contact`)
  - City hub landing pages (`/explore/[city]`)
  - Active, opted-in advertising resource detail pages (`/resources/[slug]`)
- **`robots.ts`**:
  ```
  User-agent: *
  Allow: /
  Disallow: /api/
  Disallow: /booking-request/
  Disallow: /tracking/
  ```

---

## 3. Private Surfaces Hardening
The Provider Panel (`/panel/*`) and Admin Platform (`/admin/*`) deliver mandatory HTTP response headers and HTML meta tags:
```html
<meta name="robots" content="noindex, nofollow, noarchive" />
```
This guarantees private provider data, customer identities, and contract negotiations remain shielded from public search indices.
