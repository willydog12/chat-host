<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Firebase Chat</title>
</head>
<body>

  <!-- Chat Interface -->
  <div id="messages" style="max-height: 400px; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px"></div>
  <input type="text" id="chatInput" placeholder="Type a message">
  <button id="sendBtn">Send</button>

  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"></script>

  <script>
    // Your Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyC0IWMDzxVVxe0S4Cr3bLLAaHSEd4LIgKA",
      authDomain: "chat-23-nov.firebaseapp.com",
      databaseURL: "https://chat-23-nov-default-rtdb.firebaseio.com",
      projectId: "chat-23-nov",
      storageBucket: "chat-23-nov.firebasestorage.app",
      messagingSenderId: "1054168159031",
      appId: "1:1054168159031:web:da49558d727bca0e0ac0b2",
      measurementId: "G-DKEMXEDSLJ"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database(); // Get the Firebase database
    const chatRef = database.ref('chat'); // Firebase reference for storing messages

    // Unique user ID (this can be any value, for example, a random number)
    let userId = `User-${Math.floor(Math.random() * 1000)}`;

    // Get DOM elements
    const messagesDiv = document.getElementById('messages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    // Listen for new messages in Firebase and display them
    chatRef.on('child_added', (snapshot) => {
      const messageData = snapshot.val();
      const messageDiv = document.createElement('div');
      messageDiv.textContent = `${messageData.user}: ${messageData.text}`;
      messagesDiv.appendChild(messageDiv);

      // Auto-scroll to the latest message
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Handle sending a new message
    sendBtn.addEventListener('click', () => {
      const messageText = chatInput.value.trim();
      if (messageText) {
        // Push the new message to Firebase Realtime Database
        chatRef.push({
          user: userId,
          text: messageText
        });
        chatInput.value = ''; // Clear input field
      }
    });
  </script>

</body>
</html>
