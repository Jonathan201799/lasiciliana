// sw.js — Service Worker de La Siciliana da Dilan
const CACHE_NAME = 'lasiciliana-v1';

// Archivos que se guardan para funcionar sin internet
const ARCHIVOS = [
  './LaSiciliana-daDilan.html',
  './manifest.json'
];

// Instalación: guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Guardando archivos en caché...');
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

// Activación: elimina cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Intercepta las peticiones: sirve desde caché si está disponible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        // Si no hay internet y no está en caché, devuelve la página principal
        return caches.match('./LaSiciliana-daDilan.html');
      });
    })
  );
});
