// frontend/src/components/TestimonialCard.tsx (alternative version)
import * as React from "react";

interface TestimonialCardProps {
  image?: string;
  name?: string;
  handle?: string;
  date?: string;
  quote?: string;
}

export default function TestimonialCard({
  image,
  name,
  handle,
  date,
  quote
}: TestimonialCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      if (ref.current) {
        ref.current.style.opacity = "1";
        ref.current.style.transform = "scale(1)";
      }
      return;
    }

    const node = ref.current as HTMLDivElement;
    if (!node) return;

    node.style.opacity = "0";
    node.style.transform = "scale(0.95)";

    let start: number | null = null;
    const duration = 400;

    function animate(timestamp: number) {
      if (start === null) start = timestamp;

      let progress = (timestamp - start) / duration;
      if (progress > 1) progress = 1;

      node.style.opacity = String(progress);
      node.style.transform = "scale(" + (0.95 + 0.05 * progress) + ")";

      if (progress < 1) {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(animate);
        } else {
          setTimeout(() => animate((timestamp || 0) + 16), 16);
        }
      }
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(animate);
    } else {
      setTimeout(() => animate(0), 16);
    }
  }, []);

  if (!image && !name && !quote) return null;

  return (
    <div
      ref={ref}
      className="surface surface-hover w-72 shrink-0 flex flex-col gap-4 p-4 bg-white dark:bg-surface rounded-xl shadow-md"
    >
      <div className="flex gap-3">
        {image && (
          <img
            src={image}
            alt={name || "Testimonial"}
            width={50}
            height={50}
            className="size-11 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-[var(--text)]">
              {name || "Anonymous"}
            </p>

            <svg
              className="text-blue-500"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59c-.052.078-.114.151-.239.297-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.24-.297.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              />
            </svg>
          </div>

          <span className="text-xs text-[var(--muted)]">
            {handle || date || ""}
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--text)] italic leading-relaxed">
        "{quote || ""}"
      </p>
    </div>
  );
}

/*
import * as React from "react";
import type { TestimonialCardProps } from "../types";

export default function TestimonialCard(
  props: TestimonialCardProps
) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      if (ref.current) {
        ref.current.style.opacity = "1";
        ref.current.style.transform = "scale(1)";
      }
      return;
    }

    const node = ref.current as HTMLDivElement;
    if (!node) return;

    // initial state
    node.style.opacity = "0";
    node.style.transform = "scale(0.95)";

    let start: number | null = null;
    const duration = 400;

    function animate(timestamp: number) {
      if (start === null) start = timestamp;

      let progress = (timestamp - start) / duration;
      if (progress > 1) progress = 1;

      node.style.opacity = String(progress);
      node.style.transform =
        "scale(" + (0.95 + 0.05 * progress) + ")";

      if (progress < 1) {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(animate);
        } else {
          setTimeout(() => animate((timestamp || 0) + 16), 16);
        }
      }
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(animate);
    } else {
      setTimeout(() => animate(0), 16);
    }
  }, []);

  const testimonial = props.testimonial;

  return (
    <div
      ref={ref}
      className="surface surface-hover mx-4 w-72 shrink-0 flex flex-col gap-4"
    >
      <div className="flex gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          width={50}
          height={50}
          className="size-11 rounded-full object-cover"
          loading="lazy"
          decoding="async"
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-[var(--text)]">
              {testimonial.name}
            </p>

            <svg
              className="text-blue-500"
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59c-.052.078-.114.151-.239.297-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
              />
            </svg>
          </div>

          <span className="text-xs text-[var(--muted)]">
            {testimonial.handle}
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--text)] italic leading-relaxed">
        "{testimonial.quote}"
      </p>
    </div>
  );
}*/


