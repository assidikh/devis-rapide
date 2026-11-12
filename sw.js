// Changez ce numéro à chaque mise à jour de l'application (v2 -> v3 -> v4...)
const VERSION = 'v2';
const PREFIX = 'devis-rapide-';
const CACHE = PREFIX + VERSION;
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  // On ne supprime que les anciens caches de CETTE application (d'autres applis peuvent partager le même domaine)
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, {ignoreSearch:true})).then(hit => hit || fetch(e.request).catch(() => caches.open(CACHE).then(c => c.match('./index.html')))));
});
