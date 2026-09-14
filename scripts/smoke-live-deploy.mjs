const targetUrl = process.argv[2] ?? process.env.DEPLOY_SMOKE_URL ?? "https://bureaucracy-as-code.pages.dev/";
const timeoutMs = Number(process.env.DEPLOY_SMOKE_TIMEOUT_MS ?? 20_000);

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);

try {
  const htmlResponse = await fetch(targetUrl, {
    headers: { "user-agent": "bureaucracy-as-code-deploy-smoke/1.0" },
    signal: controller.signal,
  });

  if (!htmlResponse.ok) {
    throw new Error(`Expected ${targetUrl} to return 2xx, got ${htmlResponse.status}.`);
  }

  const html = await htmlResponse.text();

  if (!html.includes("Bureaucracy as Code")) {
    throw new Error("Live page did not contain the application title.");
  }

  const assetPaths = Array.from(html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)).map((match) => match[1]);

  if (assetPaths.length === 0) {
    throw new Error("Live page did not reference any built JS or CSS assets.");
  }

  for (const assetPath of assetPaths) {
    const assetUrl = new URL(assetPath, targetUrl).toString();
    const assetResponse = await fetch(assetUrl, {
      headers: { "user-agent": "bureaucracy-as-code-deploy-smoke/1.0" },
      signal: controller.signal,
    });

    if (!assetResponse.ok) {
      throw new Error(`Expected asset ${assetUrl} to return 2xx, got ${assetResponse.status}.`);
    }
  }

  console.log(`Live deploy smoke passed for ${targetUrl} with ${assetPaths.length} assets.`);
} finally {
  clearTimeout(timeout);
}
