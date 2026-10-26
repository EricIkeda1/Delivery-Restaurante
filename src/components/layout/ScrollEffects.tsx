"use client";
import { useEffect } from "react";
const selector = [
  ".pizza-hero-copy",
  ".restaurant-filterbar",
  ".home-restaurants-heading",
  ".home-restaurant-grid>.restaurant-card",
  ".food-discovery-header",
  ".food-api-grid>.food-api-card",
  ".customer-main .section-head",
  ".menu-content .product-card",
  ".checkout-grid>.panel",
  ".checkout-grid>.stack>.panel",
  ".admin-main>.section-head",
  ".stats-grid>.stat-card",
  ".dashboard-grid>.panel",
  ".admin-orders>.panel",
  ".settings-grid>.panel",
  ".order-detail-grid .panel",
  ".auth-form",
  ".confirmation-content",
  ".store-heading",
  ".order-card",
  ".coupon-offer",
  ".help-question",
  ".favorite-heading",
].join(",");
/** Re-arm offscreen elements so the motion works when scrolling either way. */
export function ScrollEffects() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tracked = new Set<HTMLElement>();
    let frame = 0;
    let destroyed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (preference.matches) return;
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.dataset.revealState = "visible";
          } else {
            element.dataset.revealFrom =
              entry.boundingClientRect.top < 0 ? "above" : "below";
            element.dataset.revealState = "hidden";
          }
        }
      },
      { threshold: [0, 0.12], rootMargin: "-14px 0px -20px 0px" },
    );
    function scan() {
      if (destroyed || preference.matches) return;
      document
        .querySelectorAll<HTMLElement>(selector)
        .forEach((element, index) => {
          if (tracked.has(element)) return;
          tracked.add(element);
          const rect = element.getBoundingClientRect();
          element.dataset.revealFrom = rect.top < 0 ? "above" : "below";
          element.dataset.revealState = "hidden";
          element.dataset.revealReady = "true";
          element.style.setProperty(
            "--reveal-delay",
            Math.min(index % 3, 2) * 45 + "ms",
          );
          observer.observe(element);
        });
    }
    function reset() {
      observer.disconnect();
      for (const element of tracked) {
        delete element.dataset.revealReady;
        delete element.dataset.revealState;
        delete element.dataset.revealFrom;
        element.style.removeProperty("--reveal-delay");
      }
      tracked.clear();
      if (!preference.matches) scan();
    }
    scan();
    const mutations = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    preference.addEventListener("change", reset);
    return () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      mutations.disconnect();
      preference.removeEventListener("change", reset);
      observer.disconnect();
      for (const element of tracked) {
        delete element.dataset.revealReady;
        delete element.dataset.revealState;
        delete element.dataset.revealFrom;
        element.style.removeProperty("--reveal-delay");
      }
    };
  }, []);
  return null;
}
