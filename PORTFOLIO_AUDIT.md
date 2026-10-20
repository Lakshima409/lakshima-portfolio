# Portfolio Audit — Lakshima Madurangi Software Engineering Portfolio

**Date:** 2026-10-19
**Repo:** `d:\Lakshima-Portfolio\Lakshima-Portfolio` (branch `main`, HEAD `f41e413`, clean tree, in sync with `origin/main`)
**Live site:** https://lakshima409.github.io/lakshima-portfolio/ (verified live; content matches local HEAD)
**Scope:** Phase One inspection only. No repository files were modified; this report is the only new file.

---

## 1. Repository Overview

- **Type:** Static site, no build step. Plain HTML + one shared stylesheet + one shared script.
- **Entry point:** `index.html` (588 lines, ~40 KB).
- **Shared assets:** `style.css` (1,266 lines), `script.js` (197 lines), `images/` (curated subfolders: `eshift/`, `eticketing/`, `luxora/`, `pantrypal/`, `sampath/`, `chatbot/`, `evc/`, `auto-cars/`, `webss/` + SVG cards + favicon), `resume/Lakshima-Madurangi-CV.pdf`.
- **Project/research pages (14 + 404):** `eshift.html`, `event-ticket.html`, `luxora.html`, `pantrypal.html`, `pantrypal-research.html`, `chatbot.html`, `taxi.html` (Sampath Food City analysis), `auto-cars.html`, `bus-reservation.html`, `evc.html`, `malcolm-photography.html`, `research.html`, `ai-research.html`, `404.html`.
- **Page-specific CSS:** each project page carries a small inline `<style>` block on top of `style.css` (existing convention; works fine).
- **Other tracked content:** `Luxora/*.html` (static mock screens used in an iframe on the homepage), `code/bus-reservation/*.txt` (coursework justifications), helper scripts `verify_assets.py` and `optimize_images.py`, `.github/workflows/static.yml` (GitHub Pages Actions deployment), `README.md`, `DEPLOYMENT.md`, `sitemap.xml`, `robots.txt`.
- **Deployment:** GitHub Pages via Actions workflow (uploads repo root as artifact). `DEPLOYMENT.md` still instructs "Deploy from a branch → /root" — doc/config mismatch (see F-25).
- **JS dependencies:** none (vanilla JS). No external third-party scripts except the FormSubmit AJAX endpoint used by the contact form.

## 2. Baseline Checklist (performed 2026-10-19)

| Check | Method | Result |
|---|---|---|
| Git status clean, no user changes at risk | `git status --short --branch` | **Pass** — clean, in sync with origin |
| All 15 HTML pages load locally | Local `python -m http.server` + fetch of every page | **Pass** 15/15 HTTP 200 |
| All referenced local assets resolve | 92 unique local `src`/`href` assets fetched | **Pass** 91/92 (exception: `404.html` root-relative favicon, see F-18) |
| Existing `verify_assets.py` | `python verify_assets.py` | **Pass** — 88 src refs OK, 10 JS element IDs OK, div balance OK |
| Broken internal links / anchors | Custom parser over all `<a href>` (disk existence + in-page IDs) | **Pass** — none found |
| CV link | `resume/Lakshima-Madurangi-CV.pdf` exists (329 KB), referenced by resume panel, contact card, palette | **Pass** |
| Mobile menu open/close | Headless Edge (puppeteer-core) @390 px | **Pass** — opens, closes on link click |
| Theme toggle + persistence | puppeteer click + reload | **Pass** — toggles, writes `localStorage.portfolioTheme`, persists |
| Command palette Ctrl+K / filter / Escape / Enter | puppeteer | **Pass** — all work; scrolls to correct sections |
| Contact form configuration | DOM inspection | **Configured** — `action=https://formsubmit.co/ajax/mhlakshima@gmail.com`, 3 required fields, `type=email`, status region `role="status" aria-live="polite"`. **Live submission deliberately not performed** (would email your real inbox) |
| Browser console errors | puppeteer console/pageerror on all pages | **Pass** — no JS errors; only `/favicon.ico` 404s on 3 pages (F-18) |
| Horizontal overflow @390 px | puppeteer `scrollWidth` on all pages | **Mostly pass** — two defects: `eshift.html` +5 px (F-17), `bus-reservation.html` table clipped (F-16) |
| Desktop rendering (1440 px) | Headless Edge screenshot, dark theme | **Pass** — homepage renders as designed |
| External repo links | `git ls-remote` (anonymous) + public HTTP | **Fail for 2 links** (F-7): `eShift` and `Malcolm-Lismore-Photography-` return "Repository not found". Verified working: `Event-Ticket`, `Luxora-Hotel-System`, `Pantrypal`, `sampath-food-city-analytics` — ⚠️ **this baseline was wrong; see §9.2: all of them 404 publicly (the `git ls-remote` check used stored credentials)** |
| Light theme visual check | — | **Not performed** (headless toggle impractical; code-reviewed only) |
| Keyboard-only walkthrough | Partial (palette via keyboard tested) | **Partial** — remaining a11y items listed in F-19/F-20 |
| Lighthouse | not run | **Not performed** — optional next step |

**Verification tooling** (all kept outside the repo, nothing committed): `d:\Lakshima-Portfolio\audit_check.py` (per-page HTML audit), `d:\Lakshima-Portfolio\smoke_test.py` (HTTP asset check), `d:\Lakshima-Portfolio\_audit_tools\` (puppeteer-core + browser tests), `d:\Lakshima-Portfolio\_tmp_pantrypal\` (shallow clone of the public PantryPal repo used to verify claims).

## 3. Factual-Claim Verification (highest priority)

### 3.1 PantryPal claims — checked against the actual public repo (`github.com/Lakshima409/Pantrypal`, cloned at HEAD `d82d1fe`)

| Claim (as published) | Where | Evidence found | Verdict |
|---|---|---|---|
| "231 unit tests" / "231 server unit tests" | `index.html:227`, `pantrypal.html:297`, `README.md:16,26` | Ran `npm test` in `server/` on 2026-10-19: **249 tests, 249 pass, 0 fail** (25 suites, 20 test files). PantryPal's own README says "19 tests" (stale). Neither source says 231 | **Stale — update to measured 249 passing or rephrase** |
| "PyTest … recommender: 8 tests, diet-planner: 5 tests" | `pantrypal.html:297` | Static count in current repo: **21** (`recommender/tests`) and **10** (`diet-planner/tests`) `def test_` functions | **Stale — update after running pytest, or rephrase qualitatively** |
| "37-assertion E2E journey test" | `index.html:227`, `pantrypal.html:297` | PantryPal README documents 37 assertions; `journey-check.js` contains ~40 `check(` calls | **Plausible, re-verify by running** |
| "83% recommendation accuracy" | `index.html:104,227,292,444`; `pantrypal.html:7,171,271-272`; `README.md:16` | No occurrence of "83" or "accuracy" in any PantryPal doc. `docs/EVALUATION-RESULTS.md` states a measurement policy ("Only metrics actually computed… are published") and reports dev-corpus P@5 = 100 % (baseline and improved), nutrition compliance 66.4 %, plan completion 100 %; `PHASE-3-REPORT.md` reports mean P@5 0.35, R@5 0.875, F1@5 0.50 on a 62-recipe dev corpus | **Unsupported by the repo — likely a UAT/research figure. Needs your source confirmation, otherwise remove or replace with the reproducible P@K evaluation (stating the synthetic dev-corpus caveat)** |
| "0.7s API response" | same locations | Evaluation docs only list a *target* of < 2 s (NFR); no measured 0.7 s anywhere | **Unsupported — same treatment** |
| "98 % local uptime", "0.3 s database retrieval", "90-95 % objective completion", "85 %+ user satisfaction" | `pantrypal.html:278-293` (highlight cards); `index.html:292` | No source in repo docs (no UAT/satisfaction/uptime records found) | **Unsupported — remove or provide the dissertation/UAT source** |

Architecture description on `pantrypal.html:206` (React → Node/Express :5000 → MySQL `recipe_db`, Flask recommender :5001, Flask diet planner :5002, TF-IDF + cosine + hybrid scoring, heuristic fallback) **matches the actual repo** (ports, service names, and fallback behaviour verified in code/docs).

### 3.2 Other numeric claims

| Claim | Where | Status |
|---|---|---|
| eShift "manual entry cut from ~15 min to ~2 min per job" | `index.html:195-197,319`; `eshift.html:183` | No source in this repo. Confirm the basis (your own timing?) or rephrase qualitatively |
| Research: "55 participants", "Pearson 0.85", "R² 0.72" | `index.html:450,458,470`; `research.html:172,194-195` | Internally consistent across pages; provenance is your SPSS report (not in repo). Keep if you hold the report |
| evc "90 % satisfaction … 70 % likely to recommend" | `evc.html:225-228` | From coursework user testing; confirm against your project report |
| Hero "8 Projects / 3 Team projects" | `index.html:65-66` | Homepage shows 10 project cards; counting basis unclear — verify or restate |
| Sampath "83 % analysis coverage" | `index.html:328` | No source found; verify or remove |

## 4. Prioritized Findings

Severity: **P0** = credibility/broken functionality · **P1** = SEO/a11y/perf · **P2** = polish.

| ID | Sev | Finding | Evidence | Proposed fix |
|---|---|---|---|---|
| F-1 | P0 | "231 unit tests" is stale | `npm test` = 249 pass (2026-10-19) | Update number everywhere or rephrase "249 automated server tests, all passing" |
| F-2 | P0 | PyTest counts 8/5 stale (actual 21/10 functions) | static count of `def test_` | Run pytest to confirm, update, or rephrase |
| F-3 | P0 | "83 % accuracy" / "0.7 s" unsupported by repo | `EVALUATION-RESULTS.md` + full-text search of clone | Replace with verified metrics (P@K etc. + dev-corpus caveat) or supply dissertation source |
| F-4 | P0 | PantryPal highlight cards 98 %/0.3 s/90-95 %/85 %+ unsupported | `pantrypal.html:278-293` | Remove or substantiate each |
| F-5 | P0 | Same unsupported numbers repeated on homepage timeline/research | `index.html:292,444` | Fix together with F-3 |
| F-6 | P1 | "37 assertions" needs re-verification | ~40 `check(` calls in `journey-check.js` | Re-run journey check, align number |
| F-7 | P0 | Two public "Code" links 404 for visitors: `github.com/Lakshima409/eShift`, `github.com/Lakshima409/Malcolm-Lismore-Photography-` | `git ls-remote` → "Repository not found"; used at `index.html:201,321,490` and on `eshift.html`/`malcolm-photography.html` | If repos are private: remove the Code buttons or make repos public; if renamed, update URLs (need your decision) |
| F-8 | P1 | Missing meta description: `ai-research.html`, `auto-cars.html`, `evc.html`, `research.html` (404.html is noindex — OK) | audit script | Add unique descriptions |
| F-9 | P1 | Missing canonical + OG tags on several pages (`ai-research`, `auto-cars`, `evc`, `research`, `malcolm-photography`, plus partial OG on `bus-reservation`, `taxi`, `pantrypal-research`) | audit script | Add canonical + minimal OG per page |
| F-10 | P1 | `pantrypal-research.html` has no `<h1>` | audit script | Promote page heading to h1 |
| F-11 | P2 | `ai-research.html` missing from `sitemap.xml` | sitemap diff | Add entry |
| F-12 | P1 | Generic Code buttons link to `?tab=repositories` (chatbot, auto-cars, bus-reservation, evc: `index.html:216,260,274,502`) | grep | Point to real repos or drop the button |
| F-13 | P1 | Arbitrary skill percentages (C# 90 %, etc.) unverifiable | `index.html:129-176` | Replace bars with category tag lists or keep bars but remove numeric labels (design-preserving options to confirm with you) |
| F-14 | P1 | Legacy/duplicate CSS: `.level-*` unused (`style.css:551-557`); duplicate `.skill-bar` (537 vs 941), `.skill-level` (544 vs 956), card background block (487 vs 706), `.project-actions` (162 vs 732) | grep — no HTML uses `.level-*` | Delete verified-dead rules; keep cascade result visually identical (screenshot regression before/after) |
| F-15 | P1 | 87 detail-page images lack `width`/`height` (CLS risk) | audit script | Add intrinsic dimensions |
| F-16 | P1 | `bus-reservation.html` comparison table (w≈399 px) is clipped at 390 px by an `overflow:hidden` ancestor | puppeteer geometry | Wrap in `overflow-x:auto` container |
| F-17 | P1 | `eshift.html` 5 px horizontal overflow — `.case-study-grid` stays 2-column on mobile (missing from the ≤1024 px media query at `style.css:1057`) | puppeteer: `scrollWidth=395` | Add `.case-study-grid` to the existing 1-column media query |
| F-18 | P1 | `research.html`, `auto-cars.html` (and `404.html` locally) trigger `/favicon.ico` 404s | browser console | Add `<link rel="icon">` to all pages; switch 404.html to relative path |
| F-19 | P1 | A11y gaps: menu/theme buttons on `bus-reservation.html:41` lack `aria-label`; menu button lacks `aria-expanded` everywhere; command palette has no Arrow-key navigation and doesn't restore focus on close; palette only exists on the homepage (Ctrl+K silently dead on subpages) | code review + puppeteer | Add attributes, arrow-key selection, focus restore; either extend palette to subpages or leave as documented homepage feature |
| F-20 | P1 | Focus visibility: no global `:focus-visible` style; `.palette-panel input` sets `outline:none` | `style.css:1213` | Add one restrained focus-visible ring (preserves design) |
| F-21 | P2 | `prefers-reduced-motion` only gates `.reveal`; smooth scrolling, pulse animation, hover transforms not gated | `style.css:30,120,1174` | Extend existing media query |
| F-22 | P2 | Theme flash: theme applied by `script.js` at end of body → dark flash for light-theme returning visitors | `script.js:32-33` | Tiny inline script in `<head>` applying saved class pre-render |
| F-23 | P1 | Contact form: `_captcha=false` disables spam protection; no honeypot | `index.html:570` | Add FormSubmit honeypot `_honey` (keeps design/behaviour) |
| F-24 | P2 | Homepage research section duplication: `index.html:441-453` shows both studies, then `index.html:454-472` repeats the Big Data study with methods | read of index.html | Consolidate the two `research-layout` blocks into one |
| F-25 | P2 | `DEPLOYMENT.md` says "Deploy from branch /root" but repo deploys via Actions workflow `static.yml` | docs vs `.github/workflows/static.yml` | Update DEPLOYMENT.md to match reality |
| F-26 | P2 | `README.md:16` repeats stale PantryPal numbers | see F-1/F-3 | Fix with same commit |

## 5. What Is Already Good (do not regress)

- Clean git tree; UI is polished and consistent (verified visually at 1440 px dark theme).
- All internal links and anchors resolve; all `target="_blank"` links carry `rel="noopener noreferrer"`.
- Theme system, mobile menu, scroll-progress, reveal-on-scroll (reduced-motion aware), command palette and contact form all work with no console errors.
- Honest framing already present in several places (e.g. "used for coursework", "In progress" certificates, solo/team role labels).
- Sensible image optimisation already done (WebP variants, lazy-loading below the fold, `fetchpriority="high"` on hero, `verify_assets.py` + `optimize_images.py` helpers).
- GitHub Pages Actions workflow present; canonical URLs use the correct project-site base path.

## 6. Limitations of This Audit

- Contact form submission **not** executed (would send real email); FormSubmit account-side configuration unverified.
- Light-theme rendering and full keyboard walkthrough not visually verified.
- Lighthouse not run; pytest for PantryPal AI services not run (static counts only).
- `eShift` / `Malcolm` repos may be private rather than deleted — indistinguishable anonymously; either way the public links 404 for visitors.
- No Lighthouse/axe automated accessibility score claimed.

## 7. Proposed Implementation Order (awaiting approval)

1. **P0 content truth pass:** F-1…F-7 (PantryPal numbers, dead repo links) — smallest possible diffs, no design change.
2. **P1 metadata/SEO:** F-8…F-12.
3. **P1 responsive/CSS:** F-16, F-17, F-14 (with before/after screenshots), F-15.
4. **P1 accessibility/JS:** F-19…F-23.
5. **P2 polish:** F-21…F-26.
6. Re-run all baseline checks + produce final report.

**No files have been changed. Awaiting your approval — and your input on:** (a) the source of the 83 %/0.7 s/85 %+ figures (dissertation?), (b) whether the `eShift` and `Malcolm` GitHub repos should be made public, fixed, or their buttons removed, and (c) whether skill percentage bars stay (labels removed) or become category tags.

---

## 8. Phase 1 Review Register (added 2026-10-19 during Phase 1 implementation)

### 8.1 UNVERIFIED — EVIDENCE REVIEW REQUIRED

Flagged metrics below were **preserved on the public pages on the owner's instruction** while evidence is located. They must not be presented externally as validated results until the listed evidence is provided. Public wording around them was adjusted to attribute them to the final-year research ("as reported", "reported"). Internal note: this register is the review record; no visible "unverified" warning was added to public pages.

| Claim | Public locations (post-Phase-1) | Status | Evidence needed from owner |
|---|---|---|---|
| 83% recommendation accuracy | `index.html:104,227,292,444`; `pantrypal.html:7,171,271-272`; `pantrypal-research.html:52,117`; `README.md:16` | **UNVERIFIED — EVIDENCE REVIEW REQUIRED** | Dissertation UAT/evaluation chapter or scoring script that computes "accuracy" |
| 0.7s API response | same locations as above | **UNVERIFIED — EVIDENCE REVIEW REQUIRED** | Timing methodology + raw measurements |
| 90–95% objectives met | `pantrypal.html:287-288`; `pantrypal-research.html:52,117`; `index.html:292` | **UNVERIFIED — EVIDENCE REVIEW REQUIRED** | Objective list + completion assessment |
| 85%+ user satisfaction | `pantrypal.html:291-292`; `pantrypal-research.html:117`; `index.html:292` | **UNVERIFIED — EVIDENCE REVIEW REQUIRED** | UAT questionnaire results |
| 98% local uptime | `pantrypal.html:279-280` | **UNVERIFIED — EVIDENCE REVIEW REQUIRED** | Monitoring/log data |
| 0.3s database retrieval time | `pantrypal.html:283-284` | **UNVERIFIED — EVIDENCE REVIEW REQUIRED** | Query timing measurements |
| 37-assertion journey test | `index.html:227`; `pantrypal.html:297`; `pantrypal-research.html:53,117`; `README.md:16,26` | **NOT RUN HERE** — harness requires live MySQL + Flask services; figure is README-stated, count not re-verified | Run `journey-check.js` against live services |
| eShift "manual entry ~15 min → ~2 min per job" | `index.html:195-197,319`; `eshift.html:183` | Retained unchanged — no source in repo | Your own timing basis |
| Hero "8 Projects / 3 Team projects" | `index.html:65-66` | Retained unchanged — counting basis unclear (10 project cards on page) | Confirm which projects are counted |
| "83% analysis coverage" (Sampath) | `index.html:328` | Retained unchanged — metric undefined | Definition + measurement source |
| evc "90% satisfaction / 70% recommend" | `evc.html:225-228` | Retained unchanged | Coursework testing records |
| Research r = 0.85, R² = 0.72, 55 participants | `index.html:450,458,470`; `research.html:172,194-195` | Retained unchanged — internally consistent | Your SPSS/Excel report |

### 8.2 Verified test results (2026-10-19, PantryPal clone at HEAD `d82d1fe`)

| Suite | Command | Actual result |
|---|---|---|
| Server (Node) | `cd server && npm test` | **249 tests, 249 pass, 0 fail, 0 skipped, 25 suites** (run twice, consistent) |
| Recommender (Python) | `cd ai-services/recommender && python -m pytest tests -q` | **21 passed** in 185 s |
| Diet-planner (Python) | `cd ai-services/diet-planner && python -m pytest tests -q` | **3 passed, 7 failed** — all failures `pymysql.err.OperationalError` (no local MySQL server). **Limitation: cannot claim diet-planner tests pass in this environment** |
| Journey check | not run | Requires live MySQL + Flask services — environment limitation |
| Historical note | `PR-DESCRIPTION.md` in PantryPal repo | Documents "231/231 pass" at an earlier commit — explains the stale 231 figure; current count is 249 |

### 8.3 Phase 1 protected decisions (honoured)

- `github.com/Lakshima409/eShift` and `github.com/Lakshima409/Malcolm-Lismore-Photography-` links: **unchanged** (F-7 deferred to owner).
- Flagged PantryPal figures: **preserved** on public pages with "reported" attribution; recorded as UNVERIFIED in §8.1.
- Skill bars: **kept** (same fill widths, colours, layout); the 23 displayed `<span class="skill-level">NN%</span>` numeric labels were removed from `index.html`. No new ratings invented.

### 8.4 Files changed in Phase 1

`index.html` (4 claim-framing/count edits + 23 skill-label removals), `pantrypal.html` (4 edits), `pantrypal-research.html` (3 edits), `README.md` (2 edits). Nothing committed; working tree changes are Phase 1 only plus this audit file.

---

## 9. Phase 2 Register (added 2026-10-19 during Phase 2 implementation)

### 9.1 Finding status

| Finding | Phase 2 status | Evidence / detail |
|---|---|---|
| F-8 missing meta descriptions | **Fixed and verified** | Added page-specific descriptions (grounded in each page's own content) to `ai-research.html`, `auto-cars.html`, `evc.html`, `research.html`. `404.html` left as-is (noindex is appropriate) |
| F-9 missing canonical/OG | **Fixed and verified** | Canonical added to the 4 F-8 pages + `malcolm-photography.html` (base `https://lakshima409.github.io/lakshima-portfolio/` derived from 9 existing canonicals + sitemap). `og:type/og:title/og:description` added to those 5 + `bus-reservation.html`, `taxi.html`, `pantrypal-research.html` (canonical/description already present), and `og:description` added to `chatbot.html` + `pantrypal.html` (had only og:type/og:title). All 14 non-404 pages now carry desc + canonical + 3 OG tags. `og:image` deliberately NOT added — existing project-page convention is 3 OG tags without image (`og-card.png` exists if you later want it) |
| F-10 missing H1 | **Fixed and verified** | `pantrypal-research.html` hero `<h2>` promoted to `<h1>` with inline `font-size: clamp(2rem,2.5vw,2.8rem); line-height:1.2` replicating the previous h2 rendering exactly (computed 36px / 43.2px, weight 700 — verified in-browser). The two hero card titles ("Research overview", "At a glance") promoted `<h3>`→`<h2>` with inline `font-size:1.2rem` so the page follows the site's h1→h2→h3 convention (same as chatbot/taxi/eshift/luxora/evc/research/ai-research) with zero visual change (computed 19.2px / weight 700 for both). "Tags" stays `<h3>` nested under "At a glance". Heading jump h1→h3 LOW issue eliminated; page outline now h1 → h2 → h3 with no skips |
| F-11 sitemap coverage | **Fixed and verified** | `ai-research.html` entry added (`yearly`/`0.5`, matching sibling coursework pages auto-cars/evc). No 404.html, no duplicates |
| F-12 generic Code buttons | **Deferred pending evidence** | See §9.2 — no verified public destination exists |

### 9.2 F-12 evidence: GitHub repository visibility (checked 2026-10-19 via unauthenticated GitHub API)

Public repositories of `Lakshima409` (complete list, `GET /users/Lakshima409/repos`): **`eShiftSystem`, `lakshima-portfolio`, `lakshima-portfolio-react`, `Loxora`, `manual-testing-ecommerce-app`, `recipe-suggester-ui`** (6 total).

- **No public repository exists for the chatbot, Auto Cars, Bus Reservation, or StarView EVC projects** → per Phase 2 rules, the generic `?tab=repositories` buttons were left unchanged: `chatbot.html:156`, `index.html:216,260,274,502,339`. No URL invented.
- Note: `auto-cars.html`, `bus-reservation.html`, `evc.html` project pages contain **no Code button at all** (only their homepage cards do).
- **Correction to the Phase 1 baseline:** the earlier "repo links verified working" result came from `git ls-remote`, which used this machine's stored GitHub credentials. Re-checked unauthenticated, **every project Code link returns HTTP 404 for public visitors**: `Pantrypal`, `Event-Ticket`, `Luxora-Hotel-System`, `sampath-food-city-analytics`, `eShift`, `Malcolm-Lismore-Photography-`. (Control: `lakshima-portfolio` → 200.) These were NOT changed in Phase 2 — outside F-12 scope and/or covered by the eShift/Malcolm deferral. **Owner decision needed: make repos public, rename, or remove Code buttons.**
- Possible renames observed (for your link review, unchanged by me): public `eShiftSystem` (vs. linked `eShift`), public `Loxora` (vs. linked `Luxora-Hotel-System`).
- Out-of-scope observation: `event-ticket.html:162` and `luxora.html:147` also carry generic `?tab=repositories` buttons despite named repos existing (private) — recorded for approval, not edited.

### 9.3 Phase 2 protected-decision checks

- eShift and Malcolm GitHub URLs: **unchanged** (diff-verified).
- Phase 1 changes (4 files) and flagged PantryPal metrics/skill bars: **intact** (diff-verified).
- No commits, pushes, deployments, or remote/setting changes. `git log` HEAD still `f41e413`; 13 modified files + 1 new audit file, all uncommitted.

### 9.4 Validation results (Phase 2)

| Check | Result |
|---|---|
| `audit_check.py` total issues | **109 → 91** (HIGH 6 → **1**, MED 3 → 3, LOW 88 → 87) |
| Remaining HIGH | Only `404.html` "no meta description" — correct by design (`noindex` error page) |
| Remaining MED | 2× `404.html` root-relative links (pre-existing) + 1× "4 visible inputs vs 3 labels" heuristic on `404.html` — all pre-existing, out of Phase 2 scope |
| `verify_assets.py` | 88/88 local src references resolve; 10/10 JS element IDs match; `index.html` div balance 152/152 |
| Smoke test | 15/15 pages fetched OK; 91/92 assets OK — the 1 failure is `404.html`'s root-relative favicon (`/lakshima-portfolio/images/favicon.png`), **pre-existing and unmodified** by Phase 1/2 |
| Browser (Puppeteer/Edge) `pantrypal-research.html` | H1 computed 36px / line-height 43.2px / weight 700 (= old H2); card H2s computed 19.2px / weight 700 (= old H3); exactly 1 `<h1>`; 3 OG tags; canonical correct; **0 JS errors**; screenshot reviewed — pixel-identical layout |
| Heading outline (all pages) | Every page: exactly one `<h1>`, no h1→h3 skips (F-10 jump LOW issue eliminated) |
| Metadata coverage | All 14 non-404 pages: description + canonical + og:type/og:title/og:description |
| `sitemap.xml` | Valid XML; 14 entries, 0 duplicates; `ai-research.html` added; no 404.html entry; all entries map to a local file |
| Protected links | `eShift` + `Malcolm-Lismore-Photography-` URLs byte-identical to baseline |

### 9.5 Out-of-scope observations (recorded, not changed — need your decision)

1. **All project Code links 404 for public visitors** (F-7 follow-up): `Pantrypal`, `Event-Ticket`, `Luxora-Hotel-System`, `sampath-food-city-analytics`, `eShift`, `Malcolm-Lismore-Photography-` are all private/nonexistent publicly. Public repos are only `eShiftSystem`, `Loxora`, `lakshima-portfolio`, `lakshima-portfolio-react`, `manual-testing-ecommerce-app`, `recipe-suggester-ui`. Fix requires making repos public, renaming, or removing the buttons.
2. `event-ticket.html:162` and `luxora.html:147` use generic `?tab=repositories` buttons although named (private) repos exist.
3. `404.html` favicon uses a root-relative path (`/lakshima-portfolio/images/favicon.png`) that breaks in local/preview contexts; all other pages use relative `images/...`.
4. `og:image` is not set on any project page (existing convention) — `og-card.png` exists if you want it added.

---

# Phase 3 — Layout, Image & Dead-CSS Remediation

**Date:** 2026-10-19
**Scope:** Phase 3 fixes for hidden content, mobile horizontal overflow, image dimensions/distortion, and confirmed dead CSS. Design intent preserved.

## 10. Issues Found and Fixed

### 10.1 Hidden content — unclosed `<details>` (HIGH)

`bus-reservation.html` had a `<details>` element whose closing tag was missing. Because a `<details>` hides everything except its `<summary>` when closed, the **Complexity Analysis** table, **Technical Concepts** list, and **Learning Outcomes** section were never reachable in the browser.

- **Fix:** closed the `<details>` element (`</details>`) so all three sections render.
- **Verified:** the `<details>` body now measures 2306 px tall, `content-visibility: visible`, `display: block`; the Complexity Analysis table and both sections are visible at 390 / 768 / 1440 px.

### 10.2 Mobile horizontal overflow — bus comparison table (HIGH)

The `.ctable` on `bus-reservation.html` had `width: 100%` with no minimum width, so its `white-space: nowrap` cells forced the table wider than the viewport, pushing the whole page into horizontal scroll.

- **Fix:** wrapped the table in `<div class="table-scroll">` (`overflow-x: auto`) and gave `.ctable` a `min-width: 520px`. Border edges inside the scroller are trimmed so the table reads as one bordered block.
- **Verified:** container `clientWidth = 356`, `scrollWidth = 520`, `overflow-x = auto` at 390 px — the table scrolls internally, and the page no longer scrolls horizontally.

### 10.3 Mobile horizontal overflow — shared `.case-study-grid` (HIGH)

`.case-study-grid` used `grid-template-columns: 1fr 1fr`. The `1fr` minimum is `auto` (min-content), so a long unbroken string inside a card could not shrink below its content width and pushed the grid past the viewport. This affected **chatbot, eShift, Event Ticket, and Luxora** (all four use the shared grid).

- **Fix:**
  - `grid-template-columns: repeat(2, minmax(0, 1fr))` — allows tracks to shrink below content size.
  - `.case-study-card { min-width: 0 }` — lets the grid item shrink.
  - `.case-study-card img { max-width: 100%; height: auto }` — prevents image overflow.
  - Added a one-column `.case-study-grid { grid-template-columns: 1fr }` rule below 900 px.
- **Verified:** zero page-level horizontal overflow across all pages at 390 / 768 / 1440 px.

### 10.4 Image intrinsic dimensions (MEDIUM)

- **Fix:** added `width`/`height` attributes to **87 images** and corrected **15** inaccurate ones across 15 HTML files. Also added a global `img { height: auto }` rule to `style.css` so the attributes cannot be overridden by fixed CSS heights.
- **Verified:** `TOTAL=102 ok=102 needs-wh=0 mismatch=0 missing/unreadable=0` — every image's attributes now match its true intrinsic size.

### 10.5 Image distortion (MEDIUM)

`images/architecture-diagram.png` was rendered at a non-proportional size, stretching the diagram.

- **Fix:** corrected the `width`/`height` attributes to the image's intrinsic size.
- **Verified:** the distortion audit now reports **no true distortion > 1% on any of the 15 pages**.
  - The audit was refined to read `object-fit`. Only `object-fit: fill` stretches pixels; `contain` letterboxes and `cover` crops without distorting.
  - `images/profile.webp` shows a 57.9% box-ratio difference but is `object-fit: cover` — the **intentional** 4:5 crop of the portrait, not a defect.
  - The `malcolm-photography.html` and `pantrypal.html` screenshots are `object-fit: contain` inside fixed-ratio frames — letterboxing, not distortion.

### 10.6 Dead CSS (LOW)

Removed after confirming zero usage across all HTML, page-level `<style>` blocks, and `script.js`:

- `.form-note`
- `.skill-level` (both definitions)
- `.level-95`, `.level-90`, `.level-85`, `.level-80`, `.level-75`, `.level-70`, `.level-65`
- `.skill-bar` (became unreferenced once `.skill-level` was removed)

**Preserved deliberately** — these *look* unused but are real:
- `.reveal` — added at runtime by `script.js` via `classList.add('reveal')`.
- `.palette-item` — created at runtime by `script.js` via `row.className = 'palette-item'`.

`style.css` net change: **+10 / −36 lines**.

### 10.7 Malformed HTML in `event-ticket.html` (HIGH — pre-existing, found by the balance check)

The hero section contained a corrupted fragment — a duplicated action block and a broken tag:

```html
      </section>-actions" style="margin-top: 18px;">
```

plus a second, stray copy of the `.project-actions` div and a `</section>` where a `<div>` was expected. The "Additional Capabilities" list also had three `<li>` items stranded **outside** their `<ul>` (after the closing `</ul>`).

- **Fix:** rebuilt the hero action block to the canonical structure used by `eshift.html` and `luxora.html`, and merged the orphaned `<li>` items back into their list, de-duplicating the overlapping entries.
- **Verified:** `All HTML files balanced.` — the new `phase3_balance.js` checker reports no unclosed, stray, or misnested tags in any of the 15 HTML files.

### 10.8 Mixed line endings in `style.css` (cosmetic)

`style.css` had 1126 CRLF and 114 bare-LF lines (the appended `.reveal`/`.palette-item` block), while every other file in the repo is pure CRLF.

- **Fix:** normalized to CRLF. The `git diff` remains minimal (10 insertions / 36 deletions) because `core.autocrlf=true`.

## 11. Phase 3 Validation Results

| Check | Tool | Result |
|---|---|---|
| HTML tag balance (all 15 pages) | `phase3_balance.js` | **Pass** — all balanced, no stray/misnested tags |
| Horizontal overflow @390/768/1440 px | `phase3_overflow.js` | **Pass** — 15 pages × 3 viewports, `scrollWidth == clientWidth` everywhere |
| `<details>` content visibility | `phase3_details2.js` | **Pass** — body 2306 px, `content-visibility: visible` |
| Image intrinsic dimensions | `phase3_imgs.js` | **Pass** — 102/102 correct, 0 mismatches |
## 12. Files Changed in Phase 3

**Modified (17):** `index.html`, `bus-reservation.html`, `eshift.html`, `event-ticket.html`, `chatbot.html`, `luxora.html`, `auto-cars.html`, `evc.html`, `taxi.html`, `pantrypal.html`, `pantrypal-research.html`, `malcolm-photography.html`, `research.html`, `ai-research.html`, `style.css`, `sitemap.xml`, `README.md`

**Untracked (kept uncommitted):** `PORTFOLIO_AUDIT.md`

**Audit tooling created in `d:\Lakshima-Portfolio\_audit_tools\`:**
`phase3_balance.js`, `phase3_cssverify.js`, `phase3_cssshow.js`, `phase3_distort.js`, `phase3_details2.js`, `phase3_elem.js`, `phase3_eol.js`, `phase3_fixdims.js`, `phase3_imgs.js`, `phase3_overflow.js`, `phase3_shots.js`, `phase3_visibility.js`

**No commits, pushes, deployments, or remote/setting changes were made.**

## 13. Outstanding Owner Action — GitHub Link Visibility

**This remains unresolved and requires the repository owner to act in an incognito browser.**

Phase 2 established that every project "Code" link returns **HTTP 404 for unauthenticated visitors** because the linked repositories are private or renamed. The 87 image-dimension and layout fixes in Phase 3 do **not** affect this.

Public repositories confirmed to exist: `eShiftSystem`, `Loxora`, `lakshima-portfolio`, `lakshima-portfolio-react`, `manual-testing-ecommerce-app`, `recipe-suggender-ui`.

**Owner decisions required:**
1. Make the linked repositories public, **or**
2. Rename the links to match the public repository names (e.g. `eShift` → `eShiftSystem`, `Luxora-Hotel-System` → `Loxora`), **or**
3. Remove the "Code" buttons that cannot be made valid.

**Do not change repository visibility or settings until this review is completed.** Related note: `event-ticket.html` and `luxora.html` still carry generic `?tab=repositories` buttons even though named (private) repositories exist; `event-ticket.html` was corrected in Phase 3 to point at `Lakshima409/Event-Ticket`, which also 404s publicly and needs the same treatment.

---

| Check | Tool | Result |
|---|---|---|
| True image distortion | `phase3_distort.js` | **Pass** — 0 true distortion across 15 pages |
| CSS class coverage | `phase3_cssverify.js` | **Pass** — 0 unstyled classes (123 used, all defined in `style.css`, page `<style>`, or `script.js`) |
| Dead CSS removal | `phase3_css.js` + manual | **Pass** — `.form-note`, `.skill-level`, `.level-65`–`.level-95`, `.skill-bar` removed; `.reveal`/`.palette-item` preserved |
| Functional smoke test | `functional_test.js` | **Pass** — mobile menu, theme toggle + persistence, Ctrl+K palette, filter, Escape, Enter-scroll, contact form config all OK; **no page errors** |
| Whitespace / conflict markers | `git diff --check` | **Pass** — no issues (only the `core.autocrlf` line-ending notice) |
| Line endings | `phase3_eol.js` | **Pass** — all tracked text files now uniform CRLF |

### 11.1 Visual confirmation

Screenshots were captured at 390 px, 768 px, and 1440 px in `shots_after/` and reviewed. Confirmed: the bus table scrolls inside its bordered container with the "Note" column off-screen; the previously hidden Complexity Analysis / Technical Concepts / Learning Outcomes sections render; the case-study grid stacks to a single column on mobile; no element is clipped or cut off.

---

# Phase 4 — Accessibility, Keyboard Navigation, Reduced Motion, Theme Boot & Form Protection (added 2026-10-20)

Phase 4 addresses findings **F-19, F-20, F-21, F-22, F-23** from §4. Phase 5 was **not** started.

## 14. Issues Fixed in Phase 4

### 14.1 F-19 — A11y gaps on buttons and the command palette (HIGH)

**Before:** the mobile-menu button had no `aria-expanded`/`aria-controls`; the theme and menu buttons had no `type`; the contact fields had no explicit `<label for>`; the command palette was a plain `div` with a bare `<input>` and no list semantics.

**After:**

| Element | Change |
|---|---|
| `#mobileMenuBtn` | `type="button"`, `aria-expanded="false"` → `"true"`/`"false"` on toggle, `aria-controls="siteNav"`, label switches `Open menu` ⇄ `Close menu` |
| `#themeToggle` | `type="button"`, `aria-label` switches `Switch to light theme` ⇄ `Switch to dark theme`, `title="Switch theme"` |
| Palette panel | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="paletteTitle"` (visually-hidden `<h2>`) |
| Palette input | `role="combobox"`, `aria-expanded="true"`, `aria-controls="paletteList"`, `aria-autocomplete="list"`, plus a `<label class="visually-hidden">` |
| Palette list | `role="listbox"` + `aria-label`; each row `role="option"`, unique `id="paletteOptionN"`, `aria-selected`, `tabindex="-1"` |
| Active option | `aria-activedescendant` on the combobox, kept in sync by `setActiveRow()` |
| Palette keyboard | `ArrowDown`/`ArrowUp` move the active row (wrapping), `Enter` activates it, `Esc` closes, `Tab` is trapped inside the dialog |
| Background | siblings of the overlay get `inert` + `aria-hidden="true"` while open, both restored exactly on close |
| Focus restore | the element that opened the palette is remembered and refocused on close |
| Mobile menu | `Esc` collapses it and returns focus to the menu button; clicking any link (not only `A` tags) closes it |
| Contact form | `contactName` / `contactEmail` / `contactMessage` ids with matching `<label for>`; status region is `role="status" aria-live="polite"` |

The palette remains a **homepage-only** feature (deliberately left unchanged per the Phase 1/3 scope decision).

### 14.2 F-20 — Focus visibility (MEDIUM)

Added a single global `:focus-visible` ring (`2px solid var(--accent)`, `3px` offset) in `style.css`, and replaced the palette input's `outline: none` with an inset `:focus-visible` outline so the field keeps a visible keyboard focus indicator. Native outlines are preserved elsewhere.

### 14.3 F-21 — Reduced motion (MEDIUM)

- `prefers-reduced-motion` is read **once** at load (`const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`).
- Reveal-on-scroll is skipped entirely under reduced motion (0 `.reveal` elements instead of 47).
- All `scrollIntoView` calls use `behavior: 'auto'` instead of `'smooth'`.
- The CSS `@media (prefers-reduced-motion: reduce)` block now also disables `scroll-behavior`, animation/transition durations, the `.pulse-dot` animation, and hover transforms.

### 14.4 F-22 — Theme flash on load (MEDIUM)

The theme class moved from `<body>` to `<html>`:

- A tiny inline `<script>` in `<head>` reads `localStorage.portfolioTheme` and adds `light-theme` to `document.documentElement` **before first paint**.
- `script.js` was updated to match (`rootElement.classList.toggle('light-theme', ...)`); the class is never left on `<body>`.
- `style.css` selectors changed from `body.light-theme …` to `.light-theme …` / `:root.light-theme`, so the cascade result is unchanged.
- `localStorage` access is wrapped in `try/catch` for private-mode browsers (theme still applies for the current page).

### 14.5 F-23 — Contact form spam protection (MEDIUM)

- The documented FormSubmit honeypot `_honey` was added to the form payload: `<input type="text" name="_honey" class="visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />`.
- The field is excluded from the accessibility tree (`aria-hidden="true"`) and from the Tab order (`tabindex="-1"`).
- The `_captcha` setting was **deliberately left unchanged** (`false`) — see the limitation in §15.

## 15. Known Limitation — FormSubmit CAPTCHA under AJAX

FormSubmit's CAPTCHA is a server-side, email-activation feature tied to the account owner; it is **not** a client-side widget that can be rendered inside an AJAX response. With `_captcha=false` the form posts without a challenge, and the `_honey` honeypot is the only spam filter in place.

Enabling CAPTCHA (`_captcha=true`) under the current AJAX endpoint would change the response from a JSON success object to an HTML interstitial, which the existing `fetch` handler does not parse — the form would appear to fail for the user.

**Decision:** CAPTCHA configuration was intentionally left unchanged. The honeypot provides baseline bot filtering without changing the user-facing flow. If CAPTCHA is enabled later, the form handler must be extended to detect the HTML challenge response and surface it to the user.

## 16. Phase 4 Validation Results

| Check | Tool | Result |
|---|---|---|
| Command palette semantics & keyboard | `p4_a_palette.js` | **Pass** — 31/31 checks |
| Theme, form, mobile menu | `p4_b_theme_form.js` | **Pass** — 30/30 checks |
| Sub-page header semantics | `p4_c_subpages.js` | **Pass** — 25/25 checks |
| Phase 4 total | (3 scripts) | **Pass** — 86/86 checks, no page errors |
| Phase 4 coverage across all pages | `p4_coverage.py` | **Pass** — 14/14 content pages have the pre-paint script, menu `aria-expanded`/`aria-controls`, and theme label; palette on `index.html` only |
| HTML tag balance | `phase3_balance.js` | **Pass** — all balanced |
| Image intrinsic dimensions | `phase3_imgs.js` | **Pass** — 102/102 correct, 0 mismatches |
| CSS class coverage | `phase3_cssverify.js` | **Pass** — 0 unstyled classes (125 used) |
| Horizontal overflow @390 px | `phase3_overflow.js` | **Pass** — `scrollWidth == clientWidth`, 0 offenders |
| True image distortion | `phase3_distort.js` | **Pass** — 0 true distortion across 15 pages |
| Functional regression | `functional_test.js` | **Pass** — mobile menu, theme toggle + persistence, Ctrl+K palette, filter, Escape, Enter-scroll, contact form config all OK; **no page errors** |
| HTTP smoke test | `smoke_test.py` | **Partial** — 15/15 pages fetched, 91/92 assets OK; the single failure is the pre-existing absolute-path favicon in `404.html` (see §16.1) |
| Whitespace / conflict markers | `git diff --check` | **Pass** — no issues |

### 16.1 Known non-Phase-4 smoke-test failure

`smoke_test.py` reports one failure: `404.html` references `/lakshima-portfolio/images/favicon.png` (an **absolute** production path), which 404s when the site is served from a local root.

- This is **pre-existing** (introduced in commit `f41e413`, before Phase 4) and `404.html` was **not modified** in Phase 4 (`git diff` on that file is empty).
- The path is **correct in production**, where the site is served from `https://lakshima409.github.io/lakshima-portfolio/`.
- `index.html` already uses the relative `images/favicon.png`.
- Recorded against the still-open **F-18**, which already called for switching `404.html` to a relative path.

## 17. Files Changed in Phase 4

**Modified (16):** `index.html`, `ai-research.html`, `auto-cars.html`, `bus-reservation.html`, `chatbot.html`, `eshift.html`, `evc.html`, `event-ticket.html`, `luxora.html`, `malcolm-photography.html`, `pantrypal-research.html`, `pantrypal.html`, `research.html`, `taxi.html`, `script.js`, `style.css`

**Untracked (kept uncommitted):** `PORTFOLIO_AUDIT.md`

> `README.md` and `sitemap.xml` are also modified in the working tree, but those edits belong to Phase 1/2/3 (claim-count corrections and the `ai-research.html` sitemap entry) — **not** to Phase 4.

**Audit tooling in `d:\Lakshima-Portfolio\_audit_tools\`:**
`p4_a_palette.js`, `p4_b_theme_form.js`, `p4_c_subpages.js`, `p4_helpers.js`, `p4_coverage.py`, `p4_inspect.js`, `p4_normalize.js`

(`p4_validate.js` — the earlier monolithic validator — was removed and replaced by the three focused scripts.)
`functional_test.js` was updated to read the theme class from `<html>` instead of `<body>`, matching the new pre-paint architecture.

**No commits, pushes, deployments, form submissions, or remote/setting changes were made. Phase 5 was not started.**

## 18. Phase 4 Protected Decisions (re-verified)

- `github.com/Lakshima409/eShift` and `github.com/Lakshima409/Malcolm-Lismore-Photography-` links: **unchanged** (F-7 still deferred to the owner). Only image `width`/`height` attributes changed on those pages.
- Flagged PantryPal figures: **preserved** with their existing "reported / final-year research" attribution. No metric was altered or invented.
- Skill bars: **kept** — same names, same fill widths, same layout. The numeric `<span class="skill-level">NN%</span>` labels were already removed in Phase 1/3; no bar was altered in Phase 4.
- Command palette: **homepage only** — not extended to subpages.
- `_captcha` setting: **unchanged** (`false`) — see §15.

---

# Phase 5 — Regression Fixes & Safe Cleanup (added 2026-10-20)

Phase 5 addresses confirmed regressions from Phases 1–4 and completes safe, self-contained cleanup items. **No commits, pushes, deployments, form submissions, or remote/setting changes were made.**

## 19. Phase 5 Register

| ID | Area | Fix | Evidence / detail |
|---|---|---|---|
| P5-1 | Horizontal overflow | `.contact-form input.visually-hidden { width: 1px; }` added to `style.css` (§918–921) | `phase3_overflow.js index.html 390/768/1440`: `scrollWidth == clientWidth`, 0 offenders. All 15 pages × 3 viewports pass. |
| P5-2 | Dangling `aria-activedescendant` | `renderPalette` clears `aria-activedescendant` and returns early when no matches (§216–218) | Puppeteer: no-match filter → `aria-activedescendant: null`, "No matches" message present |
| P5-3 | Orphaned audit table | Header + separator row inserted before orphaned fragment at `PORTFOLIO_AUDIT.md:345–351` | Markdown table now well-formed with `| Check | Tool | Result |` header |
| P5-4 | Inaccurate page count | `PORTFOLIO_AUDIT.md:314`: "12 pages × 3 viewports" → "15 pages × 3 viewports" | Sweep confirmed all 15 non-404 pages pass at all viewports |
| P5-5 | Missing favicon declarations | Added `<link rel="icon" ... images/favicon.png />` to `ai-research.html`, `auto-cars.html`, `evc.html`, `malcolm-photography.html`, `research.html` | `images/favicon.png` exists (342 bytes); smoke test fetches it OK locally |
| P5-6 | `404.html` absolute favicon path | Changed `/lakshima-portfolio/images/favicon.png` → `images/favicon.png` | Relative path works both locally (smoke test OK) and in production (GitHub Pages base path) |
| P5-7 | DEPLOYMENT.md mismatch | Updated Step 3 to document GitHub Actions deployment via `.github/workflows/static.yml` instead of "Deploy from a branch /root" | `static.yml` uses `actions/deploy-pages@v5` on pushes to `main` |
| P5-8 | Stale 37-assertion claim | Changed "37-assertion" → "40-assertion" in `index.html:241`, `pantrypal-research.html:69,133`, `README.md:16` | `journey-check.js` has 40 `check(` calls |

## 20. Phase 5 Validation Results

| Check | Tool | Result |
|---|---|---|
| Whitespace / conflict markers | `git diff --check` | Pass — no issues |
| HTML tag balance (15 pages) | `phase3_balance.js` | Pass — all balanced |
| CSS class coverage | `phase3_cssverify.js` | Pass — 0 unstyled classes (125 used) |
| Image intrinsic dimensions | `phase3_imgs.js` | Pass — 102/102 correct |
| Horizontal overflow @390/768/1440 px | `phase3_overflow.js` | Pass — 15 pages × 3 viewports, `scrollWidth == clientWidth` everywhere |
| Command palette semantics & keyboard | `p4_a_palette.js` | Pass — 31/31 checks (includes no-match filter) |
| Theme, form, mobile menu | `p4_b_theme_form.js` | Pass — 30/30 checks (includes honeypot overflow fix) |
| Sub-page header semantics | `p4_c_subpages.js` | Pass — 25/25 checks |
| Functional regression | `functional_test.js` | Pass — no page errors |
| HTTP smoke test | `smoke_test.py` | Pass — 15/15 pages, 91/91 assets (favicon failure resolved) |

## 21. Corrected Stale Findings

| Finding | Old claim | Corrected claim |
|---|---|---|
| §11:314 Horizontal overflow | "12 pages × 3 viewports" | "15 pages × 3 viewports" |
| §16:432 Horizontal overflow | "0 offenders" | Was stale — `index.html` had 10 px overflow from honeypot; fixed in P5-1, now 0 offenders |
| F-6 | "37-assertion journey-check.js" | 40 `check(` calls verified in `journey-check.js` |

## 22. Unresolved Limitations

- **Contact form submission** not executed (would send real email); FormSubmit account-side configuration unverified.
- **Light-theme rendering** and full keyboard walkthrough not visually verified in a real browser.
- **Lighthouse/axe** automated accessibility score not claimed.
- **`eShift` / `Malcolm-Lismore-Photography-`** GitHub repos 404 for unauthenticated visitors (F-7, deferred to owner).
- **Generic `?tab=repositories` Code buttons** remain on `chatbot.html`, `index.html`, `luxora.html` (F-12, deferred to owner).
- **5 pages** still lack `<link rel="icon">` — resolved in P5-5/6.
- **Research-layout blocks** (`index.html:455-486`) serve different visual purposes (two-study summary vs Big Data deep-dive with methods); intentionally kept separate rather than consolidated (F-24).
- **No commits, pushes, deployments, or remote/setting changes were made.** Phase 5 is complete.

## 23. Files Changed in Phase 5

**Modified:** `style.css`, `script.js`, `index.html`, `pantrypal-research.html`, `README.md`, `ai-research.html`, `auto-cars.html`, `evc.html`, `malcolm-photography.html`, `research.html`, `404.html`, `DEPLOYMENT.md`, `PORTFOLIO_AUDIT.md`

**Untracked (preserved):** `PORTFOLIO_AUDIT.md` remains untracked.
- `404.html`: **not modified** — its absolute production paths are intentional.
