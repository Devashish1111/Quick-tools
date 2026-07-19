# Resume Checklist

## Current State
**Latest Commits:**
- `f6d0d09` - Fix accessibility contrast ratio, button name, and add llms.txt
- `2da4cb8` - Optimize Lighthouse score: Replace framer-motion with native JS/CSS, fix LCP hero animations, remove CPU-heavy SVG noise

**Existing Artifacts located at repo root:**
- `lighthouse.json`
- `lighthouse_a11y.json`
- `lighthouse_local.json`
- `lighthouse_local_final.json`
- `lighthouse_full.json`
- `failed_audits.json`
- `failed_audits_local.json`
- `failed_audits_local_final.json`

## Tasks Breakdown

### 1. Completed Items
- **Baseline Verification:** Initial Lighthouse and performance metrics obtained.
- **Accessibility:** Color contrast and button names fixed (`src/app/page.tsx`, `src/app/globals.css`).
- **SEO (Partial):** `llms.txt`, `sitemap.xml`, and `robots.txt` generated. JSON-LD structured data added to `src/app/layout.tsx`.
- **Performance (Partial):** Replaced `framer-motion` with native CSS animations, fixed Hero LCP delays, removed SVG noise filter.
- **Caching (Partial):** `next.config.ts` created with AVIF/WebP, immutable caching headers, and `middleware.ts` configured for short HTML caching.

### 2. Remaining Tasks (To Execute Now)
- **Baseline:** Move existing artifacts to `artifacts/baseline/`.
- **Shortener (Priority):** Fix `/api/shorten` routing for 301/302, ensure persistence, add tests.
- **Mobile Rendering Bug (Priority):** Diagnose and fix the blank white screen when Chrome mobile toggles Desktop view (check viewport, UA sniffing, overflowing elements).
- **Bundling & Optimization:** Verify dynamic imports, chunking, vendor splitting, preloading key fonts. Save metrics to `artifacts/bundles/`.
- **Tools Integration:** Ensure exactly 10 tools are properly integrated and document in `artifacts/tools-integration.md`.
- **CI & Tests:** Configure GitHub Actions for Lighthouse CI, Axe, unit/E2E tests.
- **Final Verification:** WebPageTest, Core Web Vitals emulation, validation of acceptance criteria -> `artifacts/final/`.
- **Git Push:** Execute final sequence of commits and push to remote.
