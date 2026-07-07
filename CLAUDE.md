# Sai Nirmaan Architects — Site Context

Auto-loaded for every session and subagent in this directory. Keep it current.

## Identity
- Firm: Sai Nirmaan Architects
- Principal: Suresh Kumar Bandaru
- Locations: Visakhapatnam (HQ) + Hyderabad
- Domain: sainirmaanarchitects.com
- GA tag: G-XS4JHG10ZB
- Instagram: https://www.instagram.com/sainirmaanarchitects.india/

## Stack
Static HTML/CSS/JS. No framework, no build system. Single stylesheet (`css/style.css`), single script (`js/main.js`). All pages are flat HTML files.

## File Structure
```
index.html          Homepage
about.html          About / Team
services.html       Services (6 types)
portfolio.html      Portfolio + filter system
blog.html           Blog index
contact.html        Contact / Enquire
blog/               Individual blog articles (use ../ relative paths)
css/style.css       Single stylesheet
js/main.js          Single script
images/             architectural/, interior/, landscape/, logo/
favicon-32.png      Browser tab favicon
favicon-192.png     PWA / Apple touch icon
```

## CSS Design System

### Variables (`:root`)
```
--ink:        #1A1A1A   near-black
--ink-soft:   #4A4A4A   body copy
--ink-muted:  #888888   captions, labels
--cream:      #FAFAF7   base background
--stone:      #F0EFEA   alternate section bg
--rule:       #E2E0D9   hairline dividers
--orange:     #F47920   brand accent (use sparingly)
--orange-dk:  #D4661A   hover
--serif:      Playfair Display
--sans:       Inter
--max:        1280px
--radius:     4px
```

Legacy aliases still in CSS (v1 compat — avoid using in new code):
- `--charcoal` = `--ink`
- `--light-grey` = `--stone`
- `--mid-grey` = `--rule`

### Key System Classes
| Class | Purpose |
|-------|---------|
| `.wrap` | Main centered container (max 1280px). Use this — not `.container` |
| `.container` | v1 alias for `.wrap` — avoid for new code |
| `.section` | Standard section with vertical padding |
| `.section-stone` | Stone-background section — only when alternating needed |
| `.eyebrow, .section-label` | Orange uppercase label with left rule line (unified selector) |
| `.page-hero` | Inner page hero — CSS `::after` handles dark overlay |
| `.page-hero-content` | Hero content wrapper (z-index above overlay) |
| `.cta-strip, .cta-band` | Dark CTA block — shared background/padding |
| `.cta-actions` | Flex column, right-aligned buttons inside cta-strip |
| `.hero-stat-n` | Orange serif stat number |
| `.hero-stat-l` | Uppercase stat label |
| `.btn.btn-primary` | Orange filled button |
| `.btn.btn-ghost.btn-arrow` | Ghost button with arrow |
| `.breadcrumb` | Breadcrumb nav (white/muted links, orange hover) |
| `.breadcrumb-sep` | Separator span between breadcrumb items |

### Section Rhythm Rule
Never stack two dark (`--ink` background) sections back-to-back. Break them with a light/stone section.

## Page Hero Pattern (inner pages)
```html
<section class="page-hero" style="background-image: url('images/...'); padding: 7rem 0 3rem;">
  <div class="page-hero-content">
    <div class="wrap">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span class="breadcrumb-sep">/</span>
        <span>Page Name</span>
      </nav>
      <h1>...</h1>
      <p>...</p>
    </div>
  </div>
</section>
```
**Never add extra overlay divs inside `.page-hero`** — the dark overlay is CSS `::after` only.

## Blog Article Pattern
Articles in `blog/` use `../` relative paths. Hero uses the same `.page-hero` with a 3-level breadcrumb:
```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="../index.html">Home</a><span class="breadcrumb-sep">/</span>
  <a href="../blog.html">Insights</a><span class="breadcrumb-sep">/</span>
  <span>Short Title</span>
</nav>
```
Each article ends with a "← Back to Insights" link inside a `.wrap` div after the `.article-cta` block.

## Favicon Pattern (all pages)
```html
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png" />
<link rel="icon" type="image/png" sizes="192x192" href="favicon-192.png" />
<link rel="apple-touch-icon" href="favicon-192.png" />
```
Blog articles use `../favicon-32.png` etc.

## Portfolio Filter System
- Filter buttons: `<button class="filter-btn" data-filter="category">`
- Cards: `data-category="category"` attribute
- Categories: `all`, `residential`, `commercial`, `interior`, `institutional`, `cultural`, `landscape`
- Tribal Museum → `data-category="cultural"` (NOT `architectural`)

## Key Content Facts

### Addresses
**Visakhapatnam (HQ):**
S-1, 3rd Floor, Srinivasam Apartments, MVP Sector 3, Visakhapatnam — 530017

**Hyderabad:**
6-81/1, Patemeti Chandraih Nilayan, Tellapur HUDA Colony, Near Alien Space Station, Hyderabad, Telangana — 502032

### CSR / NGO Partners (correct — do not change)
CARE India, Child Fund, Save the Children, and ADRA

### Blog Articles
| File | Schema / OG image | Hero bg image |
|------|------------------|---------------|
| `architecture-for-social-good.html` | `tribal-museum-1.jpg` | `tribal-museum-1.jpg` |
| `designing-for-the-coast.html` | `mr-bhaskar-srikakulam.jpg` | `mr-bhaskar-srikakulam.jpg` |
| `small-spaces-big-ideas.html` | `the-regent-main.jpg` | `the-regent-8.jpg` |

## Common Pitfalls
- **`.hero-content` class doesn't exist** — use `page-hero-content` with nested `wrap`
- **Hardcoded hex in HTML** — use CSS variables (`var(--orange)`, `var(--ink-muted)`)
- **`border-radius: 8px`** — system radius is `4px` (`var(--radius)`)
- **Double dark** — never two `--ink` sections back-to-back, insert a light section
- **`container` vs `wrap`** — prefer `wrap` for all new/edited code
- **Subagents lack Edit/Write access** — implement all file edits in the main session, not subagents

## Workflow
- No git commits until user audits locally in browser
- No deployment until user approves after local audit
