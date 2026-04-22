"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface GalleryItem {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ProjectGalleryProps {
  items: GalleryItem[];
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}

/**
 * Project image gallery with a simple fullscreen lightbox.
 *
 * - Grid of thumbnails; 2-col mobile, 3-col md+, deliberately varied
 *   row-span to avoid a uniform sheet-of-tiles feel.
 * - Clicking a thumbnail opens a modal with the current image centered;
 *   keyboard arrows + on-screen chevrons step through the set, ESC or
 *   the close button dismisses. No external lightbox library.
 * - Body scroll is locked while the modal is open.
 */
export function ProjectGallery({
  items,
  closeLabel,
  prevLabel,
  nextLabel,
}: ProjectGalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = items.length;

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + total) % total)),
    [total],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, next, prev]);

  if (total === 0) return null;

  const current = active !== null ? items[active] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(
              "relative",
              // Every 5th tile spans two columns on md+ to break the grid
              // rhythm; every 7th spans two rows for the same reason.
              i % 5 === 0 && "md:col-span-2",
              i % 7 === 6 && "md:row-span-2",
            )}
          >
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group/thumb relative block w-full overflow-hidden bg-bone aspect-[4/5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              aria-label={item.alt}
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover/thumb:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
            <span className="font-mono text-caption uppercase text-paper/70">
              {(active ?? 0) + 1} / {total}
            </span>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center gap-2 font-mono text-caption uppercase text-paper transition-opacity hover:opacity-70"
              aria-label={closeLabel}
            >
              <X aria-hidden className="size-4" />
              {closeLabel}
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-3 pb-6 md:px-10">
            <button
              type="button"
              onClick={prev}
              aria-label={prevLabel}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center text-paper transition-opacity hover:opacity-70 md:left-6"
            >
              <ChevronLeft className="size-7" aria-hidden />
            </button>

            <figure className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4">
              <div className="relative w-full flex-1">
                <Image
                  src={current.url}
                  alt={current.alt}
                  width={1600}
                  height={2000}
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="mx-auto h-auto max-h-[80vh] w-auto object-contain"
                />
              </div>
              {current.caption ? (
                <figcaption className="max-w-xl text-center font-mono text-caption uppercase text-paper/70">
                  {current.caption}
                </figcaption>
              ) : null}
            </figure>

            <button
              type="button"
              onClick={next}
              aria-label={nextLabel}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex size-11 items-center justify-center text-paper transition-opacity hover:opacity-70 md:right-6"
            >
              <ChevronRight className="size-7" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
