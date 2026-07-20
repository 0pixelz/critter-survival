const CACHE='critter-wilds-v1';
const ASSETS=['.','index.html','game.js','phaser.min.js','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// network-first so updates land immediately; cache fallback for offline play
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('.'))));});
