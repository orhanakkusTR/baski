import type { SchemaTypeDefinition } from "sanity";

import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { blockContent } from "./objects/blockContent";
import { seo } from "./objects/seo";
import { galleryImage } from "./objects/galleryImage";

import { project } from "./documents/project";
import { client } from "./documents/client";
import { service } from "./documents/service";
import { testimonial } from "./documents/testimonial";

import { homePage } from "./singletons/homePage";
import { siteSettings } from "./singletons/siteSettings";

/**
 * Registration order matters: objects first so documents can reference
 * them, then documents, then singletons. Singletons are still regular
 * document types here — the studio structure (see ../structure.ts)
 * is what forces single-instance behaviour.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  localizedString,
  localizedText,
  blockContent,
  seo,
  galleryImage,
  // Documents
  project,
  client,
  service,
  testimonial,
  // Singletons (document types, single-instance)
  homePage,
  siteSettings,
];

export const singletonTypes = new Set<string>(["homePage", "siteSettings"]);
