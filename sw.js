const CACHE_NAME = 'vehicle-calc-v4.2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// ติดตั้ง Service Worker และเก็บ Cache ไฟล์ระบบหลัก
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// เปิดใช้งานและลบ Cache ตัวเก่าที่ไม่ได้ใช้
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// ดึงข้อมูลจาก Cache เมื่อใช้งานออฟไลน์
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// รองรับการรับคำสั่งแจ้งเตือนบนระบบปฏิบัติการมือถือ/คอมพิวเตอร์
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'ได้เวลาเปลี่ยนน้ำมันเครื่องเพื่อถนอมเครื่องยนต์แล้วครับ!',
    icon: 'icon.png',
    badge: 'icon.png',
    vibrate: [200, 100, 200]
  };
  event.waitUntil(
    self.registration.showNotification('แจ้งเตือนการบำรุงรักษา', options)
  );
});