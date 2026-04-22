import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

/**
 * Exclude `/studio` (embedded Sanity Studio) from locale rewriting —
 * the studio is a single-locale admin surface, not part of the public
 * site routing. next-intl would otherwise try to prefix it with `/sv`.
 */
export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|studio|.*\\..*).*)"],
};
