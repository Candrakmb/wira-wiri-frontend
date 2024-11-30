if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      registration.update();  // Paksa update service worker
    });
  });
}

if (!('Notification' in window)) {
  alert('This browser does not support notifications.');
}



