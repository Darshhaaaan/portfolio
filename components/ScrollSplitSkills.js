'use client';

import { useEffect, useRef, useState } from 'react';

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

export default function ScrollSplitSkills({ cards = [] }) {
  const sectionRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    let frame = 0;

    const update = () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;

        const mobile = window.innerWidth <= 760;
        setIsMobile(mobile);

        if (motionPreference.matches) {
          setReducedMotion(true);
          setProgress(1);
          return;
        }

        setReducedMotion(false);

        const rect = section.getBoundingClientRect();

        const scrollDistance = Math.max(
          1,
          section.offsetHeight - window.innerHeight
        );

        const currentProgress = clamp(
          -rect.top / scrollDistance,
          0,
          1
        );

        setProgress(currentProgress);
      });
    };

    update();

    window.addEventListener('scroll', update, {
      passive: true,
    });

    window.addEventListener('resize', update);

    motionPreference.addEventListener('change', update);

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);

      motionPreference.removeEventListener('change', update);
    };
  }, []);

  const mobilePositions = [
    { x: 25, y: 29 },
    { x: 75, y: 29 },
    { x: 25, y: 71 },
    { x: 75, y: 71 },
  ];

  const contentOpacity = clamp(
  (progress - 0.08) / 0.52,
  0,
  1
);

const introOpacity = 1 - clamp(
  progress / 0.28,
  0,
  1
);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`scroll-split-skills ${
        reducedMotion ? 'reduced-motion' : ''
      }`}
    >
      <div className="scroll-split-sticky">

        {/* Initial large box */}
        <div
          className="scroll-split-intro"
          style={{
            opacity: introOpacity,
            transform: `translate(-50%, -50%) scale(${1 - progress * 0.12})`,
          }}
        >
          <p>TECH STACK</p>

          <h2>
            WHAT I WORK WITH<span>.</span>
          </h2>

          <div className="scroll-split-line" />

          <span>SCROLL TO EXPLORE ↓</span>
        </div>

        {/* Four splitting cards */}
        <div className="scroll-split-panels">

          {cards.slice(0, 4).map((card, index) => {
            const mobilePosition = mobilePositions[index];

            const left = isMobile
              ? 50 + (mobilePosition.x - 50) * progress
              : 50 + (index - 1.5) * 25 * progress;

            const top = isMobile
              ? 50 + (mobilePosition.y - 50) * progress
              : 50;

            const width = isMobile
              ? 92 - 46 * progress
              : 78 - 54 * progress;

            const rotation =
              (index - 1.5) * 0.8 * (1 - progress);

            return (
              <article
                key={card.num}
                className="scroll-split-card"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: isMobile ? '36vh' : '58vh',
                  transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  zIndex: index + 1,
                }}
              >

                <div
                  className="scroll-split-card-content"
                  style={{
                    opacity: contentOpacity,
                  }}
                >
                  <span className="split-card-number">
                    {card.num}
                  </span>

                  <h3>{card.title}</h3>

                  <div className="split-card-chips">
                    {card.chips?.map((chip) => (
                      <span
                        key={chip.label}
                        className={chip.hot ? 'hot' : ''}
                      >
                        {chip.label}
                        {chip.hot && ' ✦'}
                      </span>
                    ))}
                  </div>
                </div>

              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
}