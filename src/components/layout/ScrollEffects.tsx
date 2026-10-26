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
/** Animate without changing HTML attributes that React still needs to hydrate. */
export function ScrollEffects() {
  useEffect(() => {
    if (
      typeof IntersectionObserver === "undefined" ||
      !Element.prototype.animate
    )
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tracked = new Set<HTMLElement>();
    const directions = new WeakMap<HTMLElement, number>();
    const delays = new WeakMap<HTMLElement, number>();
    const animations = new Map<HTMLElement, Animation>();
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          animations.get(element)?.cancel();
          animations.delete(element);
          if (!entry.isIntersecting) {
            directions.set(
              element,
              entry.boundingClientRect.top < 0 ? -20 : 20,
            );
            continue;
          }
          if (preference.matches) continue;
          const animation = element.animate(
            [
              {
                opacity: 0,
                transform: `translateY(${directions.get(element) ?? 20}px)`,
              },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 550,
              delay: delays.get(element) ?? 0,
              easing: "cubic-bezier(0.22, 0.75, 0.2, 1)",
              fill: "backwards",
            },
          );
          animations.set(element, animation);
          animation.onfinish = () => animations.delete(element);
        }
      },
      { threshold: 0, rootMargin: "-14px 0px -20px 0px" },
    );

    function scan() {
      for (const element of tracked) {
        if (element.isConnected) continue;
        observer.unobserve(element);
        animations.get(element)?.cancel();
        animations.delete(element);
        tracked.delete(element);
      }
      document
        .querySelectorAll<HTMLElement>(selector)
        .forEach((element, index) => {
          if (tracked.has(element)) return;
          tracked.add(element);
          directions.set(
            element,
            element.getBoundingClientRect().top < 0 ? -20 : 20,
          );
          delays.set(element, (index % 3) * 45);
          observer.observe(element);
        });
    }
    function cancelMotion() {
      for (const animation of animations.values()) animation.cancel();
      animations.clear();
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
    preference.addEventListener("change", cancelMotion);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
      preference.removeEventListener("change", cancelMotion);
      cancelMotion();
    };
  }, []);
  return null;
}
