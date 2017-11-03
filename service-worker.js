/**-cache--**/
var cacheName="v2";
var cacheFiles=[
    './index.html',
    './app.js'
]

self.addEventListener('install',function(e){
    console.log('service installed');
    
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log("servicew Caching cache");
            return cache.addAll(cacheFiles);
        })    
    )
})
self.addEventListener('activate',function(e){
    console.log('service activated');
    
    e.waitUntil (
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName){
                if(thisCacheName !== cacheName){
                    console.log('Removing cache');
                    return caches.delete(thisCacheName);
                }
                else {
                    console.log('same version');
                }
            }))
        })
    )
})
self.addEventListener('fetch',function(e){
    console.log('service fetched');
    
    e.respondWith (
        caches.match(e.request).then(function(response){
            if(response) {
                console.log('fond in cache',e.request.url);
                return response;
            }
            var requestClone = e.request.clone();
            
        fetch(requestClone)
        .then(function(response){
            if(!response){
                console.log('no response');
                return response;
            }
            var responseClone = response.clone();
             caches.open(cacheName).then(function(cache){
                 cache.put(e.request, responseClone);
                 return response;
             })
        })
        }))
    
})