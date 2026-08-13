import path from "node:path";
import http from "node:http";
import https from "node:https";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

const UA_BROWSER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const UA_VLC = "VLC/3.0.21 LibVLC/3.0.21";
const insecureAgent = new https.Agent({ rejectUnauthorized: false });

function isSafeUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (BLOCKED_HOSTS.has(host)) return null;
    if (host.endsWith(".local") || host.endsWith(".localhost")) return null;
    return url;
  } catch {
    return null;
  }
}

function requestOnce(url: URL, req: IncomingMessage, userAgent: string): Promise<IncomingMessage> {
  const lib = url.protocol === "https:" ? https : http;
  const headers: Record<string, string> = {
    "User-Agent": userAgent,
    Accept: "*/*",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    "Accept-Encoding": "identity",
    Connection: "close",
  };
  if (typeof req.headers.range === "string") headers.Range = req.headers.range;

  return new Promise((resolve, reject) => {
    const upstream = lib.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || undefined,
        path: `${url.pathname}${url.search}`,
        method: req.method === "HEAD" ? "HEAD" : "GET",
        headers,
        agent: url.protocol === "https:" ? insecureAgent : undefined,
        timeout: 120_000,
      },
      resolve,
    );
    upstream.on("timeout", () => {
      upstream.destroy();
      reject(new Error("timeout"));
    });
    upstream.on("error", reject);
    upstream.end();
  });
}

async function requestFollow(url: URL, req: IncomingMessage, userAgent: string, hops = 0): Promise<IncomingMessage> {
  const res = await requestOnce(url, req, userAgent);
  const loc = res.headers.location;
  if (loc && res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && hops < 6) {
    res.resume();
    const next = new URL(loc, url);
    if (!isSafeUrl(next.toString())) return res;
    return requestFollow(next, req, userAgent, hops + 1);
  }
  return res;
}

async function handleProxy(req: IncomingMessage, res: ServerResponse) {
  const incoming = new URL(req.url ?? "/", "http://local");
  const target = incoming.searchParams.get("url");
  if (!target) {
    res.statusCode = 400;
    res.end("Missing url");
    return;
  }
  const safe = isSafeUrl(target);
  if (!safe) {
    res.statusCode = 400;
    res.end("URL no permitida");
    return;
  }

  try {
    let upstream = await requestFollow(safe, req, UA_BROWSER);
    if (upstream.statusCode && upstream.statusCode >= 400) {
      upstream.resume();
      upstream = await requestFollow(safe, req, UA_VLC);
    }

    res.statusCode = upstream.statusCode ?? 502;
    const skip = new Set(["connection", "keep-alive", "transfer-encoding", "content-encoding"]);
    for (const [key, value] of Object.entries(upstream.headers)) {
      if (!value || skip.has(key.toLowerCase())) continue;
      res.setHeader(key, value);
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cache-Control", "no-store");
    upstream.pipe(res);
  } catch {
    if (!res.headersSent) res.statusCode = 502;
    if (!res.writableEnded) res.end("Fuente no disponible");
  }
}

function iptvProxy(): Plugin {
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url ?? "";
    if (req.method === "OPTIONS" && url.startsWith("/__proxy")) {
      res.statusCode = 204;
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
      res.end();
      return;
    }
    if (!url.startsWith("/__proxy")) {
      next();
      return;
    }
    void handleProxy(req, res);
  };

  return {
    name: "aether-iptv-proxy",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), iptvProxy()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  worker: { format: "es" },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          player: ["hls.js"],
          db: ["dexie"],
        },
      },
    },
  },
});
