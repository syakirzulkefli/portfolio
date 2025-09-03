"use client";

import { useEffect } from "react";

export default function TimelineAnimation() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-in");

            const icon = entry.target.querySelector(".prisma-timeline-icon");
            if (icon) {
              setTimeout(() => {
                (icon as HTMLElement).style.transform =
                  "translate(-50%, -50%) scale(1.1)";
                setTimeout(() => {
                  (icon as HTMLElement).style.transform =
                    "translate(-50%, -50%) scale(1)";
                }, 200);
              }, 300);
            }
          }, index * 200);
        }
      });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('[data-animate="true"]');
    timelineItems.forEach((item) => observer.observe(item));

    const timelineIcons = document.querySelectorAll(".prisma-timeline-icon");

    timelineIcons.forEach((icon) => {
      const handleMouseEnter = () => {
        (icon as HTMLElement).style.boxShadow =
          "0 0 0 3px #71E8DF, 0 12px 40px rgba(113, 232, 223, 0.5), 0 8px 20px rgba(0, 0, 0, 0.6)";
      };

      const handleMouseLeave = () => {
        (icon as HTMLElement).style.boxShadow =
          "0 0 0 2px #71E8DF, 0 8px 32px rgba(113, 232, 223, 0.3), 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
      };

      icon.addEventListener("mouseenter", handleMouseEnter);
      icon.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
