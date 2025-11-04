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
    const timelineContainer = document.querySelector(".prisma-timeline");

    const updateTimelineHeight = () => {
      if (!timelineLine || !timelineContainer || timelineItems.length === 0)
        return;

      const containerRect = timelineContainer.getBoundingClientRect();
      const containerTop = containerRect.top;
      const viewportHeight = window.innerHeight;

      let maxHeight = 0;
      if (timelineItems.length > 0) {
        const lastItem = timelineItems[timelineItems.length - 1];
        const lastItemRect = lastItem.getBoundingClientRect();
        const lastItemRelativeTop = lastItemRect.top - containerTop;
        maxHeight = lastItemRelativeTop + lastItemRect.height / 2 + 100;
      }

      let lineHeight = 0;

      if (containerTop < viewportHeight && containerTop + maxHeight > 0) {
        const timelineStartScroll = Math.max(0, viewportHeight - containerTop);
        const totalScrollableHeight = maxHeight + viewportHeight;
        const scrollProgress = Math.min(
          1,
          timelineStartScroll / totalScrollableHeight
        );

        lineHeight = scrollProgress * maxHeight;

        const leadDistance = 100;
        lineHeight = Math.min(lineHeight + leadDistance, maxHeight);
      }

      timelineLine.style.height = `${Math.max(lineHeight, 0)}px`;
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
