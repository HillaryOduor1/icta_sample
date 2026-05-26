import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function SectionTitle(props: { text1: any; text2: any; text3: any; }) {
  const { text1, text2, text3 } = props;

  const p1Ref = useRef(null);
  const h3Ref = useRef(null);
  const p2Ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(function () {
      [p1Ref.current, h3Ref.current, p2Ref.current].forEach(function (el, i) {
        if (!el) return;

        gsap.from(el, {
          y: 120,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });
    });

    return function () {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <p ref={p1Ref} className="section-title-p">
        {text1}
      </p>

      <h3 ref={h3Ref} className="section-title-h3">
        {text2}
      </h3>

      <p ref={p2Ref} className="section-title-sub">
        {text3}
      </p>
    </>
  );
}

