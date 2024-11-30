import api from '@/api/axios';

export  function activatedNotifikasi() {
  // Mengecek status izin notifikasi
  if (Notification.permission === 'granted') {
      PushNotifikasiRegistrasi();
  } else if (Notification.permission !== 'denied') {
      // Tampilkan popup untuk meminta izin
      Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
              console.log("Notifikasi diaktifkan");
              PushNotifikasiRegistrasi();
          } else {
              console.log("Notifikasi ditolak");
          }
      });
  } else {
      // Jika izin ditolak, tampilkan pesan atau tindakan lainnya
      alert("Notifikasi dinonaktifkan. Aktifkan dari pengaturan browser.");
  }
}

export function activatedLocation() {
  // Mengecek apakah browser mendukung geolocation
  if ("geolocation" in navigator) {
      // Meminta izin lokasi
      navigator.geolocation.getCurrentPosition(
          (position) => {
              console.log("Lokasi diaktifkan");
              console.log("Latitude:", position.coords.latitude);
              console.log("Longitude:", position.coords.longitude);
              // Jalankan logika tambahan jika diperlukan saat lokasi diaktifkan
          },
          (error) => {
              if (error.code === error.PERMISSION_DENIED) {
                  alert("Lokasi dinonaktifkan. Aktifkan dari pengaturan browser.");
              }
          }
      );
  } else {
      alert("Browser tidak mendukung geolocation.");
  }
}


export function PushNotifikasiRegistrasi() {
  navigator.serviceWorker.ready.then(function (registration) {
    registration.pushManager.getSubscription().then(function (subscription) {
      if (subscription) {
        console.log('Subscription already exists.');
        return subscription;
      }
  
      const serverKey = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY);
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: serverKey,
      });
    })
    .then(function (subscription) {
      if (!subscription) {
        alert('Error occurred while subscribing');
        return;
      }
  
      subscribe(subscription);
    })
    .catch(function (error) {
      console.error('Error during subscription:', error);
    });
  });
}

export async function unSubscribe() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  if (!subscription) {
    console.log('No subscription found.');
    return;
  }
  
  console.log('Found subscription, unsubscribing...');
  
  try {
    await subscription.unsubscribe();
    const response = await api.post('/delete-subscription', subscription);
    console.log(response);
  } catch (error) {
    console.error('Error while unsubscribing and deleting subscription:', error);
    return false;
  }
}




function urlBase64ToUint8Array(base64String) {
const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
const rawData = window.atob(base64);
const outputArray = new Uint8Array(rawData.length);

for (let i = 0; i < rawData.length; ++i) {
  outputArray[i] = rawData.charCodeAt(i);
}

return outputArray;
}

async function subscribe(sub) {
    const key = sub.getKey('p256dh');
    const token = sub.getKey('auth');
    const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];

    const data = {
      endpoint: sub.endpoint,
      public_key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
      auth_token: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
      encoding: contentEncoding,
    };

    try {
      const response = await api.post('/save-subscription', data);
      console.log(response);
    } catch (error) {
      console.error('Error while saving subscription:', error);
    }
} 