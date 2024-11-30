"use strict";

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('beforeinstallprompt', (e) => {
  // Prevents the default mini-infobar or install dialog from appearing on mobile
  e.preventDefault();
  // Save the event because you'll need to trigger it later.
  deferredPrompt = e;
  // Show your customized install prompt for your PWA
  // Your own UI doesn't have to be a single element, you
  // can have buttons in different locations, or wait to prompt
  // as part of a critical journey.
  showInAppInstallPromotion();
});

self.addEventListener("push", function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
      return;
  }

  const payload = event.data ? event.data.json() : {};
  const options = {
    body: payload.body,
    icon: '/icons/icon-144x144.png', 
    data: {
      url: payload.data.url, 
    }
  };
  console.log(options);
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();  // Menutup notifikasi

  const urlToOpen = event.notification.data.url;  // Mengambil URL dari data notifikasi

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientsArr) {
      const hadWindowToFocus = clientsArr.some(function(windowClient) {
        if (windowClient.url === urlToOpen) {
          windowClient.focus();  // Fokus pada window jika sudah terbuka
          return true;
        }
        return false;
      });

      // Membuka jendela baru jika belum ada window yang fokus pada URL tersebut
      if (!hadWindowToFocus && clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});