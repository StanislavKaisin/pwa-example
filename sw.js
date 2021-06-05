self.addEventListener("install", (event) => {
  console.log(`sw install event`, event);
});

self.addEventListener("activate", (event) => {
  console.log(`sw activate event`, event);
});
