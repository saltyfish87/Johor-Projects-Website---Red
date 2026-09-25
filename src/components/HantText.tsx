import { useEffect } from "react";
import { toHantText } from "../data/hantChars.generated";

/**
 * On /zh-hant pages the app runs in Chinese with its Simplified labels; this swaps the characters
 * that differ in Traditional, in the rendered text nodes, after each render. Inputs are left alone.
 */
export default function HantText({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;
    const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE"]);
    const fix = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.parentElement && SKIP.has(n.parentElement.tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
      });
      const nodes: Text[] = [];
      for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n as Text);
      for (const t of nodes) { const v = toHantText(t.data); if (v !== t.data) t.data = v; }
      document.title = toHantText(document.title);
    };
    fix(document.body);
    let scheduled = false;
    const obs = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; obs.disconnect(); fix(document.body); observe(); });
    });
    const observe = () => obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    observe();
    return () => obs.disconnect();
  }, [active]);
  return null;
}
