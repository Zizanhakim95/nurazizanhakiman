# Personal CV / Portfolio Site — Nur Azizan Hakiman bin Mohd Yusoff

A static, dependency-free personal website built from your CV. Upload the folder as-is
and it runs — no build step, no npm install, no server code.

```
azizan-cv-site/
├─ index.html                                   everything on one page
├─ assets/
│  ├─ css/style.css                             theme, layout, animations
│  ├─ js/main.js                                interactivity (vanilla JS)
│  ├─ img/favicon.svg                           browser tab icon ("NA" monogram)
│  └─ CV-Nur-Azizan-Hakiman-Bin-Mohd-Yusoff.pdf the file the Download CV button serves
├─ .nojekyll                                    tells GitHub Pages not to run Jekyll
└─ README.md                                    this file
```

---

## 1. Preview it locally (2 seconds)

Double-click `index.html`. That's it — it works straight off the disk.

---

## 2. Put it live (GitHub Pages, no tools to install)

You already publish to GitHub Pages, so this is the same flow:

1. Go to <https://github.com/new>
2. **Repository name:** `<your-username>.github.io` (use exactly this to get the short URL
   `https://<your-username>.github.io`). Any other name also works — your site will then be at
   `https://<your-username>.github.io/<repo-name>/`.
3. Set **Public**, click **Create repository**.
4. On the empty repo page click **uploading an existing file**.
5. Drag in **everything inside** `azizan-cv-site` — i.e. `index.html`, `.nojekyll`, `README.md`
   and the whole `assets` folder. Keep the folder structure; `assets/css/style.css` must stay in
   `assets/css/`.
6. Scroll down, click **Commit changes**.
7. Go to **Settings → Pages**. Under *Build and deployment*: **Source = Deploy from a branch**,
   **Branch = main**, **Folder = / (root)**, then **Save**.
8. Wait ~1 minute. Your site is live at the URL Pages shows at the top of that screen.

> Tip: `.nojekyll` is a hidden file. In Windows Explorer turn on **View → Show → Hidden items**
> (or upload with `git add .nojekyll`) so it doesn't get missed. It isn't strictly required, but
> it prevents GitHub from ignoring any file or folder whose name starts with an underscore.

### Alternative hosts (also free, also drag-and-drop)

| Host | How |
|---|---|
| **Netlify Drop** | <https://app.netlify.com/drop> — drag the folder, live in ~10 seconds |
| **Cloudflare Pages** | Create project → *Upload assets* → drag the folder |

All three give a free HTTPS URL. GitHub Pages is the best fit if you want a lasting, versioned home.

---

## 3. Before you go live — 4 things to change

1. **Your mobile number is not on the site.** Your CV only shows a masked number, so I left the
   phone block commented out. To add it, open `index.html`, search for `PHONE:` and uncomment the
   block, replacing `+60 1X-XXX XXXX` and `tel:+60123456789`.
2. **The CV PDF.** The *Download CV* button serves
   `assets/CV-Nur-Azizan-Hakiman-Bin-Mohd-Yusoff.pdf`, which is your current CV copied in as-is.
   It regenerates with `Generated 9/23/2026` and its "Certifications" heading lists Microsoft Learn
   module completions — see point 3. Swap in an updated export when you have one, keeping the same
   filename (or update the two `href`s).
3. **Credential wording (worth a decision).** All five credentials in your CV are **Microsoft Learn
   achievements** — completed learning paths and modules — not passed exams (AZ-900 / MS-900 /
   PL-300). The site labels each card *Learning path* / *Module* and carries a footnote saying so,
   because a client who clicks through to your Microsoft Learn profile sees exactly that. It reads
   as honest and specific rather than inflated. If you later pass the exams, update the card type
   to *Certification* and the footnote accordingly.
4. **Add a headshot (optional).** The site uses an "NA" monogram so it looks finished without a
   photo. To use a real one: drop `portrait.jpg` into `assets/img/`, then in `index.html` replace
   `<div class="avatar" aria-hidden="true">NA</div>` (in the hero) with
   `<img class="avatar" src="assets/img/portrait.jpg" alt="Nur Azizan Hakiman" width="56" height="56">`.

---

## 4. Editing content

Everything is plain HTML in `index.html` — no templating, no database. Sections are marked with
comment banners:

| Section | What's in it |
|---|---|
| Hero | Name, role, positioning statement, 4 headline stats, profile card |
| About | Professional summary + "How I work" 5-step process |
| Expertise | 6 capability cards |
| Experience | Click-to-expand timeline (Zen, Blue Vinegar, Jadi Imaging, Education) |
| Skills | 4 category panels with a filter bar |
| Learning | 5 Microsoft credential cards with a filter bar |
| Contact | Email / LinkedIn / location, plus a message form |

### Adding a new job to the timeline

Copy one `<article class="tl-item reveal">` block in the Experience section, give the new
`aria-controls` / `id` pair a unique number (`exp-5`), and edit the period, role, org and bullets.
The accordion, animations and scroll-spy pick it up automatically.

### Adding a skill

Add a `<span class="chip chip--lg">Skill name</span>` inside the relevant
`<div class="skill-group" data-cat="...">`. Valid categories: `presales`, `microsoft`, `data`, `dev`.

### Adding a credential

Copy a `<article class="cert reveal" data-cat="fundamentals">` block. Valid `data-cat` values:
`fundamentals`, `data`.

---

## 5. The interactive features (all built in)

- **Light / dark theme toggle** — respects the visitor's OS preference first, then remembers their choice.
- **Sticky header** that fades from transparent-over-hero to a solid frosted bar, with a reading-progress line.
- **Scroll-spy navigation** — the current section highlights as you scroll, including in the mobile menu.
- **Click-to-expand career timeline** — one role open at a time, keyboard accessible (`aria-expanded`).
- **Filterable skills and credentials** — tab-style chips, animated panel entry.
- **Copy-email button** with clipboard fallback for non-HTTPS contexts.
- **Contact form** that pre-fills the visitor's own mail client (no backend, no third party, nothing to pay).
- **Scroll-reveal animations**, staggered, with `prefers-reduced-motion` fully respected.
- **Print stylesheet** — Ctrl+P produces a clean, readable paper CV with all accordions open.
- **Accessible** — skip link, semantic landmarks, visible focus rings, ARIA on all controls.

### Making the contact form send server-side (optional)

By default the form composes a `mailto:` link, so a visitor with no desktop mail client may not
reach you. Two zero-cost options if you want real submissions:

- **Formspree** — sign up at formspree.io, then change the form tag to
  `<form class="contact-form reveal" id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST">`
  and delete the `e.preventDefault()` line in `main.js` section 10.
- **Your own endpoint** — point `action` at any POST handler.

---

## 6. Theme reference

| Token | Light | Dark |
|---|---|---|
| Primary accent | `#0b62d0` | `#5aa9ff` |
| Ink (headings) | `#0b1b2b` | `#e9f1f9` |
| Body text | `#3b4d61` | `#c3d2e0` |
| Page background | `#ffffff` | `#0a1621` |
| Alternating band | `#f4f7fb` | `#0c1b28` |
| Card surface | `#ffffff` | `#101f2f` |
| Hero gradient | `#081526 → #0d2a45 → #0b3d63` (constant in both themes) | same |

Font: **Inter** (Google Fonts) with a system-font fallback, so the site still looks right offline.
To self-host instead, download Inter, drop the `.woff2` files in `assets/fonts/`, and replace the
Google Fonts `<link>` in `index.html` with an `@font-face` block in `style.css`.

---

## 7. Honesty notes on the content

Everything on the site is derived from your CV. Two things were deliberately *not* invented:

- **No projects or client names.** Your CV doesn't list them, so the Expertise cards describe
  capability from your own work-history bullets rather than claiming specific deliveries.
- **No numbers that can't be sourced.** The "4+ yrs", "MSc IT", "5 Microsoft Learn achievements"
  and "10+ core platforms" stats all come from your CV, and the 6 languages/tools count in the
  Toolkit section is literally the number of chips rendered.
- **No availability/notice-period claims**, since your CV shows Zen as your current employer.
