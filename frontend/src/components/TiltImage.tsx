import * as React from "react";

type TiltedImageProps = {
  rotateAmplitude?: number;
};

export default function TiltedImage(props: TiltedImageProps) {
  var rotateAmplitude = props.rotateAmplitude || 3;

  var containerRef = React.useRef<HTMLDivElement | null>(null);
  var frameRef = React.useRef<number | null>(null);

  var stateRef = React.useRef<{
    rotateX: number;
    rotateY: number;
    targetX: number;
    targetY: number;
    enabled: boolean;
  }>({
    rotateX: 0,
    rotateY: 0,
    targetX: 0,
    targetY: 0,
    enabled: true,
  });

  React.useEffect(function () {
    if (typeof window === "undefined") return;

    var prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var isTouch =
      "ontouchstart" in window ||
      (navigator && (navigator as any).maxTouchPoints > 0);

    stateRef.current.enabled = !(prefersReduced || isTouch);

    function animate() {
      var s = stateRef.current;
      var node = containerRef.current as HTMLDivElement;

      if (!node || !s.enabled) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      // spring interpolation
      s.rotateX += (s.targetX - s.rotateX) * 0.12;
      s.rotateY += (s.targetY - s.rotateY) * 0.12;

      node.style.transform =
        "perspective(1000px) rotateX(" +
        s.rotateX.toFixed(2) +
        "deg) rotateY(" +
        s.rotateY.toFixed(2) +
        "deg)";

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    return function cleanup() {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [rotateAmplitude]);

  function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    var node = containerRef.current as HTMLDivElement;
    var s = stateRef.current;

    if (!node || !s.enabled) return;

    var rect = node.getBoundingClientRect();
    var offsetX = e.clientX - rect.left - rect.width / 2;
    var offsetY = e.clientY - rect.top - rect.height / 2;

    s.targetX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    s.targetY = (offsetX / (rect.width / 2)) * rotateAmplitude;
  }

  function handleMouseLeave() {
    var s = stateRef.current;
    s.targetX = 0;
    s.targetY = 0;
  }

  return (
    <figure
      className="relative w-full h-full mt-16 max-w-4xl mx-auto flex flex-col items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={containerRef}
        className="
          relative w-full max-w-4xl rounded-lg
          bg-white dark:bg-gray-900
          shadow-lg dark:shadow-gray-800
          transform-3d will-change-transform
        "
        style={{
          transition: "opacity 0.6s ease, transform 0.1s linear",
        }}
      >
        <img
          src="/assets/hero-section-showcase.png"
          alt="hero section showcase"
          className="w-full rounded-[15px]"
          loading="lazy"
          decoding="async"
        />
      </div>
    </figure>
  );
}


