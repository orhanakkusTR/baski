/**
 * Mock portfolio data. Swap to a Sanity query in ADIM 7.
 *
 * Client names are intentionally fictional — invented Nordic-sounding
 * brands. Do not substitute real brand names without written permission.
 */

import type { ServiceKey } from "./constants";

export interface ProjectMock {
  slug: string;
  client: string;
  titleKey: string;
  category: ServiceKey;
  year: number;
  /** Text for the ImagePlaceholder while real photography is outstanding */
  imageLabel: string;
}

export const featuredProjects: ProjectMock[] = [
  {
    slug: "meridian-signature",
    client: "Meridian Spirits",
    titleKey: "home.portfolio.items.meridian",
    category: "boxes",
    year: 2024,
    imageLabel: "Projekt · Meridian Signature",
  },
  {
    slug: "atelier-veka-holiday",
    client: "Atelier Veka",
    titleKey: "home.portfolio.items.veka",
    category: "bags",
    year: 2024,
    imageLabel: "Projekt · Atelier Veka",
  },
  {
    slug: "lund-berg-launch",
    client: "Lund & Berg",
    titleKey: "home.portfolio.items.lund",
    category: "corporate",
    year: 2023,
    imageLabel: "Projekt · Lund & Berg",
  },
];
