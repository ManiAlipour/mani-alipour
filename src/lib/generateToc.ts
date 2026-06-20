export function generateToc(html: string) {
  const toc: { id: string; text: string }[] = [];

  const updatedHtml = html.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    (match, attrs, text) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();

      const id = cleanText
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, "");

      toc.push({
        id,
        text: cleanText,
      });

      if (attrs.includes("id=")) {
        return match;
      }

      return `<h2 id="${id}"${attrs}>${text}</h2>`;
    },
  );

  return { toc, updatedHtml };
}
