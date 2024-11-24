// Import the necessary Firebase functions
const { initializeApp } = firebase;
const { getDatabase, ref, child, push, onChildAdded } = firebase.database;

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const chatRef = ref(database, 'chat'); // Firebase reference to store chat messages

// Unique user ID
let userId = `User-${Math.floor(Math.random() * 1000)}`;

// Get DOM elements
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// Listen for new messages in Firebase and display them
onChildAdded(chatRef, (snapshot) => {
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
    push(chatRef, {
      user: userId,
      text: messageText
    });
    chatInput.value = ''; // Clear input field
  }
});
