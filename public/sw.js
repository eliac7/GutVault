self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if ("focus" in client) {
          return client.focus();
        }
      }
      // If no window is open, open one
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
