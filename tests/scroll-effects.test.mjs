import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function setup() {
  let intersection;
  let changeMotion;
  let cleanup;
  const animations = [];
  const preference = {
    matches: false,
    addEventListener: (_, listener) => {
      changeMotion = listener;
    },
    removeEventListener() {},
  };
  const element = {
    isConnected: true,
    getBoundingClientRect: () => ({ top: 100 }),
    // Updating either would change HTML that React might still be hydrating.
    dataset: new Proxy(
      {},
      {
        set() {
          throw new Error("HTML attribute mutated");
        },
      },
    ),
    style: {
      setProperty() {
        throw new Error("Inline style mutated");
      },
    },
    animate(keyframes, options) {
      const animation = {
        keyframes,
        options,
        cancelled: false,
        cancel() {
          this.cancelled = true;
        },
      };
      animations.push(animation);
      return animation;
    },
  };
  class Observer {
    constructor(callback) {
      intersection = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  class Mutations {
    observe() {}
    disconnect() {}
  }
  const source = ts
    .transpileModule(
      readFileSync("src/components/layout/ScrollEffects.tsx", "utf8"),
      {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      },
    )
    .outputText.replace(/import .*?from "react";/, "")
    .replace("export function ScrollEffects", "function ScrollEffects");
  const run = new Function(
    "useEffect",
    "IntersectionObserver",
    "MutationObserver",
    "Element",
    "window",
    "document",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    source + "; return ScrollEffects;",
  );
  const ScrollEffects = run(
    (effect) => {
      cleanup = effect();
    },
    Observer,
    Mutations,
    { prototype: { animate() {} } },
    { matchMedia: () => preference },
    { body: {}, querySelectorAll: () => [element] },
    () => 1,
    () => {},
  );
  ScrollEffects();
  return {
    animations,
    enter: () =>
      intersection([
        {
          target: element,
          isIntersecting: true,
          boundingClientRect: { top: 100 },
        },
      ]),
    leave: (top) =>
      intersection([
        { target: element, isIntersecting: false, boundingClientRect: { top } },
      ]),
    reduce: () => {
      preference.matches = true;
      changeMotion();
    },
    cleanup: () => cleanup(),
  };
}

test("scroll motion leaves server HTML attributes and inline styles untouched", () => {
  const effects = setup();
  effects.enter();
  assert.equal(effects.animations.length, 1);
  effects.cleanup();
});

test("scroll motion replays in both directions and respects reduced motion", () => {
  const effects = setup();
  effects.enter();
  assert.equal(
    effects.animations[0].keyframes[0].transform,
    "translateY(20px)",
  );
  effects.leave(-200);
  assert.equal(effects.animations[0].cancelled, true);
  effects.enter();
  assert.equal(
    effects.animations[1].keyframes[0].transform,
    "translateY(-20px)",
  );
  effects.reduce();
  assert.equal(effects.animations[1].cancelled, true);
  effects.leave(1000);
  effects.enter();
  assert.equal(effects.animations.length, 2);
  effects.cleanup();
});
