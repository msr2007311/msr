var V='msr-v2';
var ASSETS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){
    return Promise.all(ASSETS.map(function(a){return c.add(a).catch(function(){})}));
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url),same=u.origin===location.origin,zipjs=u.href.indexOf('jszip')>-1;
  if(!same&&!zipjs)return;
  e.respondWith(fetch(r).then(function(res){
    var copy=res.clone();caches.open(V).then(function(c){c.put(r,copy)});return res;
  }).catch(function(){
    return caches.match(r).then(function(m){return m||caches.match('index.html')});
  }));
});
