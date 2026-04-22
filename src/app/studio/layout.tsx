/**
 * Studio layout — deliberately minimal.
 *
 * The embedded Sanity Studio ships its own full-page UI with its own
 * fonts, CSS reset, and header. We do not want the public site's Header
 * / Footer / locale padding around it, so this layout sits directly
 * under the root and returns children as-is.
 *
 * Re-exports `metadata` and `viewport` from `next-sanity/studio` so the
 * studio gets its own proper `<head>` (no-index meta, correct viewport).
 */
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
