"use client";

import { useEffect, useState } from "react";
import styles from "./key-help.module.css";

const LINE_STEP = 72;
const HELP_ID = "key-help";

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

function clickIfPresent(selector: string) {
  const element = document.querySelector<HTMLElement>(selector);

  if (!element) {
    return false;
  }

  // Clicking lets next/link handle the basePath.
  element.click();
  return true;
}

/** j/k scroll, gg/G jump, H/L previous/next post, p toggles the preview, ? shows help. */
export function VimMotions() {
  useEffect(() => {
    let pendingG = false;
    let pendingTimer: number | undefined;

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (isTyping(event.target)) {
        return;
      }

      const wasPendingG = pendingG;
      pendingG = false;
      window.clearTimeout(pendingTimer);

      switch (event.key) {
        case "j":
          window.scrollBy({ top: LINE_STEP });
          break;
        case "k":
          window.scrollBy({ top: -LINE_STEP });
          break;
        case "G":
          window.scrollTo({ top: document.documentElement.scrollHeight });
          break;
        case "g":
          if (wasPendingG) {
            window.scrollTo({ top: 0 });
          } else {
            pendingG = true;
            pendingTimer = window.setTimeout(() => {
              pendingG = false;
            }, 600);
          }
          break;
        case "H":
          if (!clickIfPresent("[data-buffer-prev]")) {
            return;
          }
          break;
        case "L":
          if (!clickIfPresent("[data-buffer-next]")) {
            return;
          }
          break;
        case "p":
          if (!clickIfPresent("[data-view-toggle]")) {
            return;
          }
          break;
        case "?": {
          const help = document.getElementById(HELP_ID);

          if (!(help instanceof HTMLDialogElement)) {
            return;
          }

          if (help.open) {
            help.close();
          } else {
            help.show();
          }
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

const keys = [
  { key: "j / k", action: "scroll down / up" },
  { key: "gg / G", action: "top / bottom" },
  { key: "H / L", action: "older / newer post" },
  { key: "p", action: "preview / source (posts)" },
  { key: "?", action: "toggle this help" },
];

/** A which-key style popup above the command line, opened with `?`. */
export function KeyHelp() {
  useEffect(() => {
    const help = document.getElementById(HELP_ID);

    if (!(help instanceof HTMLDialogElement)) {
      return;
    }

    const dialog = help;

    // A non-modal dialog doesn't close on Esc by itself.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dialog.open) {
        dialog.close();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <dialog id={HELP_ID} className={styles.help} aria-label="Keyboard shortcuts">
      <dl>
        {keys.map((entry) => (
          <div key={entry.key}>
            <dt>{entry.key}</dt>
            <dd>{entry.action}</dd>
          </div>
        ))}
      </dl>
      <form method="dialog">
        <button type="submit">esc close</button>
      </form>
    </dialog>
  );
}

/** Lualine's scroll indicator: Top, Bot, All or a percentage. */
export function BufferPosition() {
  const [label, setLabel] = useState("Top");

  useEffect(() => {
    function update() {
      const root = document.documentElement;
      const scrollable = root.scrollHeight - window.innerHeight;
      const top = window.scrollY;

      if (scrollable <= 1) {
        setLabel("All");
      } else if (top <= 1) {
        setLabel("Top");
      } else if (top >= scrollable - 1) {
        setLabel("Bot");
      } else {
        setLabel(`${Math.round((top / scrollable) * 100)}%`);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return label;
}
