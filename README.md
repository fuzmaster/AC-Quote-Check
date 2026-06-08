# AC Quote Check

**Check the math before you approve an expensive HVAC repair.**

AC Quote Check is a one-page, fully client-side consumer-protection tool that helps homeowners
sanity-check an AC repair quote *before* they sign off on it. Enter the system age, quote amount,
repair type, and how the unit has been running — and get an instant, plain-English read on whether
the quote is fair, overpriced, likely under warranty, or a sign it's time to replace.

It's built to protect the homeowner, not upsell them: **results appear first, with the reasoning
shown — no email wall, no backend, no sales call.**

## Features

- **Plain-English verdict** — five tiers from *"This repair looks reasonable"* to *"Don't approve this yet."*
- **Risk score (0–100)** with every contributing factor spelled out — never a black box.
- **Warranty warning** — younger systems are flagged as likely still under manufacturer coverage,
  and a high-priority warranty case escalates the verdict and renders above the risk meter.
- **The $5,000 rule** — age × quote, the classic repair-or-replace gut-check.
- **Overpricing check** — compares the quote against typical fair-cost ranges per repair type.
- **5-Year Money Check** — a repair-vs-replace projection chart that updates live with your numbers.
- **Questions to ask your tech** — tailored to your specific situation, plus a full checklist.
- **Copyable quote summary** — formatted to paste straight to a second HVAC pro for a second opinion.
- **Live recalc** — after the first result, any field change updates the verdict instantly.

## Tech stack

- [Vite](https://vite.dev/) · React 18 · TypeScript
- Tailwind CSS (design tokens live in `src/index.css`; Tailwind preflight is disabled so it never
  fights the hand-tuned base styles)
- [lucide-react](https://lucide.dev/) icons
- Google **Geist** / **Geist Mono** webfonts
- No backend, database, auth, tracking, or third-party calls — everything runs in the browser.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc --noEmit) + production build to dist/
npm run preview  # serve the production build locally
```

## How it works

`src/lib/engine.ts` is a pure, deterministic, rules-based verdict engine — **not a diagnosis**, a
check of the quote's *math*. Given the form inputs it returns the verdict, risk score, contributing
reasons, warranty status, the $5,000-rule figure, tailored next questions, and the 5-year
repair-vs-replace projection. The UI is a thin, faithful render of that result.

## Project structure

```
src/
  App.tsx                  app shell, form state, live recalc, copyable summary
  lib/engine.ts            typed rules engine (verdict, risk, warranty, projection)
  components/
    Icon.tsx               lucide-react wrapper keyed by the design's icon names
    Hero.tsx               hero + trust pitch
    QuoteForm.tsx          inputs: stepper, money field, select, radio pills
    ResultCard.tsx         verdict card, risk meter, warranty alert, empty state
    MoneyChart.tsx         5-Year Money Check (CSS stacked bars)
    Sections.tsx           approve strip, checklist, second-quote CTA, FAQ, scope, footer
    BacklinkFooter.tsx     attribution footer
index.html                 SEO meta, Open Graph/Twitter, JSON-LD (WebApplication + FAQPage)
```

## A note on the chart

The 5-Year Money Check is a bespoke CSS stacked-bar visualization (diagonal "future repairs" hatch,
in-bar labels, the exact token palette) ported pixel-for-pixel from the approved design. It's pure
CSS — no charting runtime — so it animates, scales, and stays dependency-free. (An earlier pass used
`recharts`, but its `ResponsiveContainer` rendered unreliably and added ~360 kB; swap it back in if a
richer/interactive chart is ever needed.)

## Scope

This is a quote sanity-check, **not** professional HVAC advice. Real repair-or-replace decisions
depend on system condition, install quality, local labor rates, warranty status, and an in-person
inspection by a licensed technician. Intentionally **not** included: login, email capture, backend,
database, lead-gen form, payments, ZIP lookup, AI, or file upload.

## Credits

Built by [Jacob Britten](https://jacobbritten.com) — Media Systems Architect.

## License

MIT — see [LICENSE](LICENSE).
