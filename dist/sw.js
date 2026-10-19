var C="pt-v6.0";
var A=["./","./index.html","./app.css","./app.js","./manifest.webmanifest","./podmienky.html","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./pravopisny-trener-offline.html"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(A);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.map(function(n){if(n!==C){return caches.delete(n);}}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET"){return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){
    if(r){return r;}
    return fetch(e.request).then(function(res){
      var cp=res.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return res;
    }).catch(function(){return caches.match("./index.html");});
  }));
});
