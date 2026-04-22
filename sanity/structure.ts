import type { StructureResolver } from "sanity/structure";
import {
  FolderIcon,
  BuildingIcon,
  BoxIcon,
  QuoteIcon,
  HomeIcon,
  SettingsIcon,
} from "lucide-react";

import { singletonTypes } from "./schemas";

/**
 * Custom studio structure.
 *
 * Pins the two singletons (home page + site settings) to the top as
 * fixed editor targets, then lists the regular document types below in
 * a deliberate reading order: projects (primary workload), clients,
 * services, testimonials.
 *
 * Document types that live in `singletonTypes` are filtered out of the
 * automatic document-type list so they only appear at the top — prevents
 * editors from creating a second Home page document.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home page")
        .icon(HomeIcon)
        .child(
          S.editor()
            .id("homePage")
            .schemaType("homePage")
            .documentId("homePage"),
        ),
      S.listItem()
        .title("Site settings")
        .icon(SettingsIcon)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .title("Projects")
        .icon(FolderIcon)
        .child(
          S.documentTypeList("project")
            .title("Projects")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .title("Clients")
        .icon(BuildingIcon)
        .child(S.documentTypeList("client").title("Clients")),
      S.listItem()
        .title("Services")
        .icon(BoxIcon)
        .child(S.documentTypeList("service").title("Services")),
      S.listItem()
        .title("Testimonials")
        .icon(QuoteIcon)
        .child(S.documentTypeList("testimonial").title("Testimonials")),
      // Filter any document types we have not explicitly listed — keeps
      // singletons from showing up a second time under an auto-generated
      // list item.
      ...S.documentTypeListItems().filter(
        (item) =>
          !["project", "client", "service", "testimonial"].includes(
            item.getId() || "",
          ) && !singletonTypes.has(item.getId() || ""),
      ),
    ]);
