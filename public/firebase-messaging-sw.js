/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 **/
 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': '943782570527'
 });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  // Customize notification here
  var notificationTitle = payload.data.title;
  var notificationOptions = {
    body: payload.data.body,
    icon: '/web-push-icon.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
// [END background_handler]

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(async function() {
    const allClients = await clients.matchAll({
      includeUncontrolled: true,
      type: 'window'
    });

    for (const client of allClients) {
      client.focus();
      break;
    }
  }());
});