const staticCacheName = "s-app-v3";
const dynamicCacheName = "d-app-v3";

// files for cache
const assetsUrls = ["index.html", "index.js", "style.css", "/offline.html"];

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

self.addEventListener("activate", async (event) => {
  // console.log(`sw activate event`, event);
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => {
        return name !== staticCacheName;
      })
      .filter((name) => {
        return name !== dynamicCacheName;
      })
      .map((name) => caches.delete(name))
  );
});

// we can interrupt fetch event and decide whethere to use network data or data from cache
self.addEventListener("fetch", (event) => {
  // console.log(`fetch event`, event.request.url);
  const { request } = event;
  const url = new URL(request.url);
  // for static files
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// cache strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
  } catch (error) {
    const cached = await caches.match(request);
    return cached ?? (await caches.match("/offline.html"));
  }
}
