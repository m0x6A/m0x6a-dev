"use client";

import { useEffect, useState } from "react";

const LINE_STEP = 72;

function getBuffer() {
  return document.getElementById("buffer");
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** j/k scroll, gg/G jump, H/L switch buffer tabs, p toggles the post preview. */
export function VimMotions() {
  useEffect(() => {
    let pendingG = false;
    let pendingTimer: number | undefined;

    function switchBuffer(offset: number) {
      const tabs = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-buffer]"));
      const current = tabs.findIndex((tab) => tab.getAttribute("aria-current") === "page");
      const next = tabs[current + offset];

      // Clicking the tab lets next/link handle the basePath.
      if (current !== -1 && next) {
        next.click();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (isTyping(event.target)) {
        return;
      }

      const buffer = getBuffer();

      if (!buffer) {
        return;
      }

      const wasPendingG = pendingG;
      pendingG = false;
      window.clearTimeout(pendingTimer);

      switch (event.key) {
        case "j":
          buffer.scrollBy({ top: LINE_STEP });
          break;
        case "k":
          buffer.scrollBy({ top: -LINE_STEP });
          break;
        case "G":
          buffer.scrollTo({ top: buffer.scrollHeight });
          break;
        case "g":
          if (wasPendingG) {
            buffer.scrollTo({ top: 0 });
          } else {
            pendingG = true;
            pendingTimer = window.setTimeout(() => {
              pendingG = false;
            }, 600);
          }
          break;
        case "H":
          switchBuffer(-1);
          break;
        case "L":
          switchBuffer(1);
          break;
        case "p": {
          const toggle = document.querySelector<HTMLButtonElement>("[data-view-toggle]");

          if (!toggle) {
            return;
          }

          toggle.click();
          break;
        }
        default:
          return;
      }

      event.preventDefault();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(pendingTimer);
    };
  }, []);

  return null;
}

/** Lualine's scroll indicator: Top, Bot, All or a percentage. */
export function BufferPosition() {
  const [label, setLabel] = useState("Top");

  useEffect(() => {
    const buffer = getBuffer();

    if (!buffer) {
      return;
    }

    const target = buffer;

    function update() {
      const scrollable = target.scrollHeight - target.clientHeight;

      if (scrollable <= 1) {
        setLabel("All");
      } else if (target.scrollTop <= 1) {
        setLabel("Top");
      } else if (target.scrollTop >= scrollable - 1) {
        setLabel("Bot");
      } else {
        setLabel(`${Math.round((target.scrollTop / scrollable) * 100)}%`);
      }
    }

    update();
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return label;
}
