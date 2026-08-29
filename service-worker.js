/* Epoch service worker
 * Bump CACHE when you ship changes so clients pick them up. */
const CACHE = "epoch-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./images/favicon.svg",
  "./images/favicon-32.png",
  "./images/apple-touch-icon.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./images/icon-192-maskable.png",
  "./images/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Navigations (the app shell): network-first so updates land, fall back to cache offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy)).catch(() => { });
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Same-origin assets + Google Fonts: cache-first, then network (and populate cache).
  const isFonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin === self.location.origin || isFonts) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => { });
          return res;
        }).catch(() => cached)
      )
    );
  }
});
