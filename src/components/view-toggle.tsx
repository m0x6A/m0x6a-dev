"use client";

import { useSyncExternalStore } from "react";
import { VIEW_STORAGE_KEY } from "@/lib/view-mode";

type View = "preview" | "source";

function readView(): View {
  return document.documentElement.dataset.view === "source" ? "source" : "preview";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-view"] });
  return () => observer.disconnect();
}

/**
 * Switches blog posts between the rendered preview and the raw Markdown
 * source. The choice lives on <html data-view> and is remembered per visitor.
 * `p` triggers this button through VimMotions.
 */
export function ViewToggle() {
  const view = useSyncExternalStore(subscribe, readView, () => "preview" as const);

  function toggle() {
    const next: View = readView() === "preview" ? "source" : "preview";

    if (next === "source") {
      document.documentElement.dataset.view = "source";
    } else {
      delete document.documentElement.dataset.view;
    }

    try {
      localStorage.setItem(VIEW_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={view === "preview"}
      title="Toggle rendered preview (p)"
      data-view-toggle=""
    >
      <span className="preview-only">◉ preview</span>
      <span className="source-only"># source</span>
    </button>
  );
}
