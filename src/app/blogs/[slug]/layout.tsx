"use client";

import Script from "next/script";
import "./style.css";
import { useEffect } from "react";

function usePrismRtlEnhancements() {
  useEffect(() => {
    let isMounted = true;

    import("prismjs").then((Prism) => {
      Prism.highlightAll();

      // @ts-expect-error: This module does not have TypeScript types
      import("prismjs/plugins/line-numbers/prism-line-numbers");
    });

    const preBlocks = document.querySelectorAll<HTMLPreElement>("pre");
    preBlocks.forEach((pre) => {
      pre.dir = "ltr";
      pre.style.textAlign = "left";
      pre.style.fontFamily =
        "'JetBrains Mono', Consolas, 'Roboto Mono', 'Courier New', Courier, monospace";
      pre.style.overflowX = "auto";
      pre.style.padding = "1.25em 1em";
      pre.style.background =
        "linear-gradient(110deg, #101a29 80%, #182848 100%)";
      pre.style.borderRadius = "0.9em";
      pre.style.border = "1.2px solid #22d3ee55";
      pre.style.color = "#e0f2fe";
      pre.style.boxShadow = "0 6px 32px -10px #00ffd940";
      pre.style.position = "relative";
    });

    // Add copy button to <pre><code> blocks, but not if already exists
    const codeBlocks = document.querySelectorAll<HTMLElement>(
      "pre code[class*='language-']",
    );
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (!pre) return;
      if (pre.querySelector(".prism-copy-btn")) return;

      const button = document.createElement("button");
      button.textContent = "Copy";
      button.className =
        "prism-copy-btn absolute top-2 right-2 px-4 py-1 rounded-lg font-mono drop-shadow bg-cyan-900/90 text-neon-cyan text-sm border border-cyan-400/40 hover:bg-neon-cyan/30 hover:text-black transition-all focus:outline-none";
      button.title = "Copy";
      pre.style.position = "relative";

      button.addEventListener("click", async () => {
        try {
          const text = codeBlock.innerText;
          await navigator.clipboard.writeText(text);
          button.textContent = "Copied!";
          button.classList.add("copied");
          setTimeout(() => {
            button.textContent = "Copy";
            button.classList.remove("copied");
          }, 1300);
        } catch {
          button.textContent = "Error";
          setTimeout(() => (button.textContent = "Copy"), 1000);
        }
      });

      pre.appendChild(button);
    });

    return () => {
      document
        .querySelectorAll(".prism-copy-btn")
        .forEach((btn) => btn.remove());
      isMounted = false;
    };
  }, []);
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePrismRtlEnhancements();
  return (
    <>
      <Script src="https://manialipour.ir/script.js" strategy="lazyOnload" />
      <div className="font-vazir">{children}</div>
    </>
  );
}
