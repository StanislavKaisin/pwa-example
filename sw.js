const staticCacheName = "s-app-v1";
// files for cache
const assetsUrls = ["index.html", "index.js", "style.css"];

self.addEventListener("install", async (event) => {
  // console.log(`sw install event`, event);
  // event.waitUntil(
  //   caches.open(staticCacheName).then((cache) => {
  //     cache.addAll(assetsUrls);
  //   })
  // );
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetsUrls);
});

self.addEventListener("activate", (event) => {
  // console.log(`sw activate event`, event);
});

// we can interrupt fetch event and decide whethere to use network data or data from cache
self.addEventListener("fetch", (event) => {
  // console.log(`fetch event`, event.request.url);
  event.respondWith(cacheFirst(event.request));
});

// cache strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
  //
}
