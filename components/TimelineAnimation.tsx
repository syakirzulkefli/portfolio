"use client";

import { useEffect } from "react";

export default function TimelineAnimation() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const timelineItems = document.querySelectorAll('[data-animate="true"]');
    const timelineLine = document.querySelector(
      ".prisma-timeline-line"
    ) as HTMLElement;
    const timelineContainer = document.querySelector(
      ".prisma-timeline"
    ) as HTMLElement | null;

    const updateTimelineHeight = () => {
      if (!timelineLine || !timelineContainer || timelineItems.length === 0)
        return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = window.scrollY + viewportHeight / 2;

      const containerRect = timelineContainer.getBoundingClientRect();
      const containerTop = containerRect.top + window.scrollY;

      const lastItem = timelineItems[timelineItems.length - 1] as HTMLElement;
      const lastItemRect = lastItem.getBoundingClientRect();
      const lastItemCenter =
        lastItemRect.top + window.scrollY + lastItemRect.height / 2;

      const extraPadding = 120;
      const maxHeight = Math.max(
        0,
        lastItemCenter - containerTop + extraPadding
      );

      if (viewportCenter <= containerTop) {
        timelineLine.style.height = "0px";
        return;
      }

      const leadDistance = 80;
      const progressDistance = viewportCenter - containerTop + leadDistance;
      const progress = Math.min(1, progressDistance / maxHeight);
      const lineHeight = Math.min(maxHeight, maxHeight * progress);

      timelineLine.style.height = `${lineHeight}px`;
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

    timelineItems.forEach((item) => observer.observe(item));

    const handleScroll = () => {
      requestAnimationFrame(updateTimelineHeight);
    };

    window.addEventListener("scroll", handleScroll);

    updateTimelineHeight();

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
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
