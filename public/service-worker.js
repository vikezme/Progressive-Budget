const CACHE_NAME = "static-cache-v3";
const DATA_CACHE_NAME = "data-cache-v3";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/index.js",
  "/indexedDb.js",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];


self.addEventListener("install", function (evt) {

  evt.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(FILES_TO_CACHE))
    )
    self.skipWaiting();

  });

self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    )
    .then(self.clients.claim());
  });

self.addEventListener("fetch", function(evt) {
      evt.respondWith(
          fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.match(evt.request);
            });
        })
      );

    });
