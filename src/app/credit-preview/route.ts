import fs from "node:fs/promises";
import path from "node:path";

const CREDIT_PREVIEW_HTML_PATH = path.join(
  process.cwd(),
  "public",
  "credit-preview",
  "index.html"
);

export async function GET() {
  try {
    const html = await fs.readFile(CREDIT_PREVIEW_HTML_PATH, "utf8");
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new Response("credit-preview page not found", { status: 404 });
  }
}
