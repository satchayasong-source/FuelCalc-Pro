const CACHE_NAME = 'fuel-calc-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Sarabun:wght=300;400;600;700&display=swap'
];

// ติดตั้ง Service Worker และเก็บไฟล์ทั้งหมดลงใน Cache ทันที
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // บังคับให้ข้ามขั้นตอนรอสลับเวอร์ชัน
  );
});

// เปิดใช้งาน Service Worker เวอร์ชันใหม่และล้าง Cache เก่าที่ค้างอยู่
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // บังคับควบคุมหน้าเว็บทั้งหมดทันที
  );
});

// ตรวจสอบและดึงข้อมูลจาก Cache ก่อน เพื่อให้เปิดแอปได้ตอนไม่มีเน็ต (Offline Mode)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // ถ้ามีใน Cache ให้ใช้จาก Cache, ถ้าไม่มีให้ส่งคำขอไปทางอินเทอร์เน็ตปกติ
      return cachedResponse || fetch(event.request);
    })
  );
});