importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js",
);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts(
    "https://www.gstatic.com/firebasejs/7.16.1/firebase-analytics.js",
);
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyCyatlv67DvSKeN5KjjU8Evn3EicAUeivI",
    authDomain: "cmbandroid-58416.firebaseapp.com",
    projectId: "cmbandroid-58416",
    storageBucket: "cmbandroid-58416.appspot.com",
    messagingSenderId: "945289672410",
    appId: "1:945289672410:web:028a5fc3029bc01773d7e3",
    measurementId: "G-7VQBFJL49M"
});

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
   
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});


 
// self.addEventListener('push', function (event) {
// 	var data = event.data.json();
 
// 	const title = data.Title;
// 	data.Data.actions = data.Actions;
// 	const options = {
// 		body: data.Message,
// 		data: data.Data
// 	};
// 	event.waitUntil(self.registration.showNotification(title, options));
// });
 
// self.addEventListener('notificationclick', function (event) {});
 
// self.addEventListener('notificationclose', function (event) {});