import type { Metadata } from "next";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { ButtonLink } from "@/components/shared/button-link";
import { Badge } from "@/components/shared/badge";
import { Logo } from "@/components/shared/logo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { FadeIn } from "@/components/animations/fade-in";
import { TextReveal } from "@/components/animations/text-reveal";
import { Marquee } from "@/components/animations/marquee";

export const metadata: Metadata = {
  title: "Styleguide — AW AB Design System",
  description: "Internal reference for tokens, primitives, and motion.",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "ink", hex: "#0A0A0A", role: "Primary text, headings, strong UI" },
  { name: "paper", hex: "#F5F1EA", role: "Page background, default canvas" },
  { name: "gold", hex: "#C9A961", role: "Accent, focus ring, small marks" },
  { name: "stone", hex: "#8B8680", role: "Muted body copy, labels" },
  { name: "bone", hex: "#E8E2D5", role: "Hover surfaces, section contrast" },
  { name: "white", hex: "#FAFAFA", role: "Cards, elevated popovers" },
];

const typeScale = [
  { token: "display-2xl", className: "text-display-2xl", note: "Hero eyecatch — max one per page" },
  { token: "display-xl", className: "text-display-xl", note: "Primary hero headline" },
  { token: "display-lg", className: "text-display-lg", note: "Section leads" },
  { token: "h1", className: "text-h1", note: "Page title" },
  { token: "h2", className: "text-h2", note: "Section title" },
  { token: "h3", className: "text-h3", note: "Sub-section" },
  { token: "h4", className: "text-h4", note: "Card heading" },
  { token: "h5", className: "text-h5", note: "Small heading" },
  { token: "h6", className: "text-h6", note: "Meta heading" },
];

const bodyScale = [
  { token: "body-lg", className: "text-body-lg", note: "Lead paragraphs" },
  { token: "body", className: "text-body", note: "Default paragraphs" },
  { token: "body-sm", className: "text-body-sm", note: "Secondary, forms" },
  { token: "caption", className: "text-caption uppercase tracking-[0.18em] font-mono", note: "Eyebrows, meta labels" },
];

const radiusTokens = [
  { name: "none", className: "rounded-none" },
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
];

const shadowTokens = [
  { name: "none", className: "shadow-none", description: "Default — everything is flat." },
  { name: "subtle", className: "[box-shadow:var(--shadow-subtle)]", description: "Dropdowns, ambient lift." },
  { name: "elevated", className: "[box-shadow:var(--shadow-elevated)]", description: "Menus, popovers." },
];

const durationTokens = [
  { name: "fast", value: "150ms", use: "Hover state, focus ring" },
  { name: "base", value: "250ms", use: "Transitions, translate-y on reveals" },
  { name: "slow", value: "400ms", use: "Section reveals, emphasis" },
];

export default function StyleguidePage() {
  return (
    <div className="bg-paper">
      {/* Header */}
      <Container as="header" className="border-b border-ink/10 py-10">
        <div className="flex items-center justify-between gap-6">
          <Logo size="md" />
          <span className="font-mono text-caption uppercase text-stone">
            Styleguide · internal
          </span>
        </div>
      </Container>

      {/* Intro */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="AW AB · Design system"
          heading="Typography, color, and motion — one source of truth."
          description="Every page in this site is built from the primitives below. If a pattern you need isn't here, promote it here first — don't fork it in a page."
          size="lg"
          as="h1"
        />
      </Container>

      <Separator />

      {/* Colors */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="01 — Color"
          heading="Brand palette"
          description="Use the named utilities (bg-ink, text-paper, border-stone). Raw hex values never appear in components."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((c) => (
            <div
              key={c.name}
              className="flex items-stretch border border-ink/10"
            >
              <div
                className="w-28 shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <div className="flex flex-1 flex-col justify-between gap-3 p-5">
                <div>
                  <p className="font-mono text-caption uppercase text-stone">
                    {c.name}
                  </p>
                  <p className="font-mono text-sm text-ink">{c.hex}</p>
                </div>
                <p className="text-body-sm text-stone">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Separator />

      {/* Typography — display */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="02 — Typography"
          heading="Editorial scale, Fraunces + Inter"
          description="Display tokens are fluid (clamp). Body tokens are fixed. Tracking and line-height are baked in — don't override at the utility level."
        />
        <div className="mt-14 flex flex-col gap-12">
          {typeScale.map((t) => (
            <div
              key={t.token}
              className="flex flex-col gap-3 border-t border-ink/10 pt-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-caption uppercase text-stone">
                  {t.token}
                </span>
                <span className="font-mono text-caption text-stone">
                  {t.note}
                </span>
              </div>
              <p className={`font-display text-ink ${t.className}`}>
                Premium förpackning, svenskt hantverk.
              </p>
            </div>
          ))}

          <Separator className="my-4" />

          {bodyScale.map((t) => (
            <div
              key={t.token}
              className="flex flex-col gap-3 border-t border-ink/10 pt-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-caption uppercase text-stone">
                  {t.token}
                </span>
                <span className="font-mono text-caption text-stone">
                  {t.note}
                </span>
              </div>
              <p className={`max-w-2xl text-ink ${t.className}`}>
                Vi bygger förpackningar för varumärken som måste hålla i
                butiksljuset — presentkartonger, papperskassar och
                specialtryck för internationella lyxvarumärken.
              </p>
            </div>
          ))}
        </div>
      </Container>

      <Separator />

      {/* Radius + Shadow + Duration */}
      <Container as="section" className="py-24 md:py-32">
        <div className="grid gap-20 lg:grid-cols-3">
          <div>
            <SectionHeading
              eyebrow="03 — Radius"
              heading="Sharp by default"
              size="sm"
              as="h3"
            />
            <div className="mt-10 flex flex-col gap-4">
              {radiusTokens.map((r) => (
                <div key={r.name} className="flex items-center gap-5">
                  <div
                    className={`size-16 border border-ink/20 bg-bone ${r.className}`}
                  />
                  <div>
                    <p className="font-mono text-caption uppercase text-stone">
                      rounded-{r.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="04 — Shadow"
              heading="Almost flat"
              size="sm"
              as="h3"
            />
            <div className="mt-10 flex flex-col gap-6">
              {shadowTokens.map((s) => (
                <div key={s.name} className="flex items-center gap-5">
                  <div
                    className={`size-16 rounded-sm border border-ink/10 bg-white ${s.className}`}
                  />
                  <div className="flex-1">
                    <p className="font-mono text-caption uppercase text-stone">
                      shadow-{s.name}
                    </p>
                    <p className="mt-1 text-body-sm text-stone">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="05 — Motion"
              heading="Three durations, one curve"
              size="sm"
              as="h3"
            />
            <div className="mt-10 flex flex-col gap-4">
              {durationTokens.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between border-t border-ink/10 pt-3"
                >
                  <div>
                    <p className="font-mono text-caption uppercase text-stone">
                      duration-{d.name}
                    </p>
                    <p className="mt-1 text-body-sm text-stone">{d.use}</p>
                  </div>
                  <span className="font-mono text-sm text-ink">{d.value}</span>
                </div>
              ))}
              <p className="mt-4 font-mono text-caption uppercase text-stone">
                ease-editorial
              </p>
              <p className="text-body-sm text-stone">
                cubic-bezier(0.22, 1, 0.36, 1) — fast start, long settle.
              </p>
            </div>
          </div>
        </div>
      </Container>

      <Separator />

      {/* Buttons */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="06 — Button"
          heading="Primary, outline, ghost, link"
          description="All four variants in sm / md / lg sizes. Primary is the only one that fills — everything else earns weight with border or text only."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {(["primary", "outline", "ghost"] as const).map((variant) => (
            <div key={variant} className="border-t border-ink/10 pt-6">
              <p className="font-mono text-caption uppercase text-stone">
                variant = {variant}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button variant={variant} size="sm">
                  Begär offert
                </Button>
                <Button variant={variant} size="md">
                  Begär offert
                </Button>
                <Button variant={variant} size="lg">
                  Begär offert
                </Button>
                <Button variant={variant} size="md" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}

          <div className="border-t border-ink/10 pt-6">
            <p className="font-mono text-caption uppercase text-stone">
              variant = link
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Button variant="link" size="sm">
                Läs mer
              </Button>
              <Button variant="link" size="md">
                Läs mer
              </Button>
              <Button variant="link" size="lg">
                Läs mer
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-ink/10 pt-6">
          <p className="font-mono text-caption uppercase text-stone">
            ButtonLink (shared) — arrow + underline reveal
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-10">
            <ButtonLink href="/sv/services">Se tjänster</ButtonLink>
            <ButtonLink href="/sv/portfolio" direction="up-right">
              Arbeten
            </ButtonLink>
            <ButtonLink href="/sv/contact" tone="stone" size="sm">
              Kontakt
            </ButtonLink>
            <ButtonLink href="https://vercel.com" external size="lg">
              External link
            </ButtonLink>
          </div>
        </div>
      </Container>

      <Separator />

      {/* Form primitives */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="07 — Form"
          heading="Inputs, textarea, select, label, separator"
        />
        <div className="mt-14 grid max-w-2xl gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sg-name">Namn</Label>
            <Input id="sg-name" placeholder="Anna Andersson" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sg-email">E-post</Label>
            <Input
              id="sg-email"
              type="email"
              placeholder="anna@exempel.se"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sg-service">Tjänst</Label>
            <Select>
              <SelectTrigger id="sg-service">
                <SelectValue placeholder="Välj tjänst" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boxes">Presentkartonger</SelectItem>
                <SelectItem value="bags">Papperskassar</SelectItem>
                <SelectItem value="corporate">Företagstryck</SelectItem>
                <SelectItem value="custom">A++ Specialproduktion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sg-message">Meddelande</Label>
            <Textarea
              id="sg-message"
              rows={4}
              placeholder="Berätta kort om projektet…"
            />
          </div>

          <Button variant="primary" size="lg" className="self-start">
            Skicka
          </Button>
        </div>
      </Container>

      <Separator />

      {/* Badges */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="08 — Badge"
          heading="Category, status, meta"
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div className="border-t border-ink/10 pt-6">
            <p className="font-mono text-caption uppercase text-stone">
              variant = plain
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Badge tone="ink">Case study</Badge>
              <Badge tone="stone">2024</Badge>
              <Badge tone="gold">Featured</Badge>
            </div>
          </div>
          <div className="border-t border-ink/10 pt-6">
            <p className="font-mono text-caption uppercase text-stone">
              variant = outline
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Badge variant="outline" tone="ink">
                Förpackning
              </Badge>
              <Badge variant="outline" tone="stone">
                FSC-certifierat
              </Badge>
            </div>
          </div>
          <div className="border-t border-ink/10 pt-6">
            <p className="font-mono text-caption uppercase text-stone">
              variant = solid
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Badge variant="solid" tone="ink">
                Premium
              </Badge>
              <Badge variant="solid" tone="gold">
                Ny
              </Badge>
            </div>
          </div>
          <div className="border-t border-ink/10 pt-6">
            <p className="font-mono text-caption uppercase text-stone">
              variant = dot
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Badge variant="dot" tone="ink">
                Tillgänglig
              </Badge>
              <Badge variant="dot" tone="gold">
                Begränsat
              </Badge>
            </div>
          </div>
        </div>
      </Container>

      <Separator />

      {/* Logo variants */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="09 — Logo"
          heading="Wordmark"
          description="Placeholder typographic mark. Swap for a finalised wordmark once branding lands."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center border border-ink/10 bg-paper p-14">
            <Logo size="lg" tone="ink" />
          </div>
          <div className="flex items-center justify-center border border-ink/10 bg-ink p-14">
            <Logo size="lg" tone="paper" />
          </div>
          <div className="flex items-center justify-center border border-ink/10 bg-paper p-14">
            <Logo size="md" tone="ink" withMark={false} />
          </div>
          <div className="flex items-center justify-center border border-ink/10 bg-paper p-14">
            <Logo size="sm" tone="ink" />
          </div>
        </div>
      </Container>

      <Separator />

      {/* Animations */}
      <Container as="section" className="py-24 md:py-32">
        <SectionHeading
          eyebrow="10 — Motion"
          heading="Reveals, text stagger, marquee"
          description="Respect prefers-reduced-motion — each component short-circuits to a static version when the user opts out."
        />

        <div className="mt-14 border-t border-ink/10 pt-6">
          <p className="font-mono text-caption uppercase text-stone">
            FadeIn — whileInView, once, 40px translate
          </p>
          <FadeIn className="mt-8 max-w-2xl">
            <p className="text-body-lg text-ink">
              Fades in as it enters the viewport. Used on every section to
              stagger the reveal without drawing attention to the motion
              itself.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 border-t border-ink/10 pt-6">
          <p className="font-mono text-caption uppercase text-stone">
            TextReveal — word stagger
          </p>
          <TextReveal
            as="h3"
            text="Editorial, minimal, tipografi-odaklı."
            className="mt-8 font-display text-display-lg text-ink"
          />
        </div>

        <div className="mt-14 border-t border-ink/10 pt-6">
          <p className="font-mono text-caption uppercase text-stone">
            Marquee — infinite horizontal scroll
          </p>
          <div className="mt-8">
            <Marquee speed={30}>
              <span className="font-display text-h3 text-ink">
                Premium packaging
              </span>
              <span aria-hidden className="size-1.5 rounded-full bg-gold" />
              <span className="font-display text-h3 text-ink">
                Editorial design
              </span>
              <span aria-hidden className="size-1.5 rounded-full bg-gold" />
              <span className="font-display text-h3 text-ink">
                Made in Sweden
              </span>
              <span aria-hidden className="size-1.5 rounded-full bg-gold" />
              <span className="font-display text-h3 text-ink">
                Since 2019
              </span>
              <span aria-hidden className="size-1.5 rounded-full bg-gold" />
            </Marquee>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <Container as="footer" className="border-t border-ink/10 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-caption uppercase text-stone">
            End of styleguide · noindex
          </p>
          <ButtonLink href="/" size="sm">
            Back to site
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
