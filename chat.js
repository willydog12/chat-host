<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Firebase Chat</title>
</head>
<body>

  <!-- Chat Interface -->
  <h1>1-on-1 Chat with Next Person</h1>
  <div id="messages" style="max-height: 400px; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px"></div>
  <input type="text" id="chatInput" placeholder="Type a message">
  <button id="sendBtn">Send</button>
  <button id="nextBtn">Next Person</button>
  <div id="userStatus" style="margin-top: 10px; font-size: 14px; color: #666;"></div>

  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"></script>

  <script>
    // Firebase configuration
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
    const usersRef = database.ref('users'); // Firebase reference for storing users
    const chatRef = database.ref('chat'); // Firebase reference for storing messages

    // Unique user ID
    const userId = `User-${Math.floor(Math.random() * 10000)}`;
    const userRef = usersRef.child(userId);

    // Get DOM elements
    const messagesDiv = document.getElementById('messages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const nextBtn = document.getElementById('nextBtn');
    const userStatus = document.getElementById('userStatus');

    let currentPartner = null; // The user you're chatting with
    let users = [];

    // Mark user as active
    userRef.set({
      userId,
      active: true,
      lastActivity: Date.now(),
    });

    // Listen for new messages in Firebase and display them
    chatRef.on('child_added', (snapshot) => {
      const messageData = snapshot.val();
      const messageDiv = document.createElement('div');
      messageDiv.textContent = `${messageData.user}: ${messageData.text}`;
      messagesDiv.appendChild(messageDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
    });

    // Handle sending a new message
    sendBtn.addEventListener('click', () => {
      const messageText = chatInput.value.trim();
      if (messageText && currentPartner) {
        // Push the new message to Firebase Realtime Database
        chatRef.push({
          user: userId,
          text: messageText
        });
        chatInput.value = ''; // Clear input field
      }
    });

    // Handle switching to the next person
    nextBtn.addEventListener('click', () => {
      const activeUsers = users.filter(user => user !== userId && user.active);
      if (activeUsers.length > 0) {
        const nextIndex = (activeUsers.indexOf(currentPartner) + 1) % activeUsers.length;
        switchConversation(activeUsers[nextIndex]);
      } else {
        alert('No other users are available.');
      }
    });

    // Listen for user changes (active/inactive users)
    usersRef.on('value', (snapshot) => {
      const data = snapshot.val();
      users = Object.keys(data || {}).filter(user => user !== userId && data[user].active);

      if (users.length === 0) {
        userStatus.textContent = "Waiting for other users to join...";
      } else {
        userStatus.textContent = "Ready to chat!";
        if (!currentPartner) {
          switchConversation(users[0]); // Automatically switch to the first user
        }
      }
    });

    // Function to switch conversation
    function switchConversation(partnerId) {
      if (currentPartner === partnerId) return; // Avoid switching to the same person

      currentPartner = partnerId;

      // Clear previous messages and reset UI
      messagesDiv.innerHTML = '';

      // Create a unique conversation ID
      const conversationId = userId < partnerId
        ? `${userId}_${partnerId}`
        : `${partnerId}_${userId}`;

      const conversationRef = database.ref(`conversations/${conversationId}`);

      // Listen for new messages in the conversation
      conversationRef.on('child_added', (snapshot) => {
        const messageData = snapshot.val();
        const messageDiv = document.createElement('div');
        messageDiv.textContent = `${messageData.user}: ${messageData.text}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      });

      // Mark the user as active when a conversation starts
      usersRef.child(userId).update({ active: true, lastActivity: Date.now() });

      // Mark the other user as active too
      usersRef.child(partnerId).update({ active: true, lastActivity: Date.now() });
    }

    // Cleanup inactive users periodically
    setInterval(() => {
      const now = Date.now();
      usersRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (now - userData.lastActivity > 5 * 60 * 1000) { // 5 minutes of inactivity
            childSnapshot.ref.update({ active: false });
          }
        });
      });
    }, 60000); // Run cleanup every minute

    // Ensure the user is removed when they disconnect
    window.addEventListener('beforeunload', () => {
      userRef.remove();
    });
  </script>

</body>
</html>
