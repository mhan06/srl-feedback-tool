const firebaseConfig = {
  apiKey: "AIzaSyCaD27FCBGvOxda_7poF4MtlCBJQeyzuCg",
  authDomain: "srl-feedback.firebaseapp.com",
  databaseURL: "https://srl-feedback-default-rtdb.firebaseio.com",
  projectId: "srl-feedback",
  storageBucket: "srl-feedback.firebasestorage.app",
  messagingSenderId: "1045633097889",
  appId: "1:1045633097889:web:d1695206a587d0337210e0",
  measurementId: "G-BKS4W0S9GG"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function submitReaction(reaction) {
  const timestamp = new Date().toISOString();
  db.ref('feedback_responses').push({
    type: 'emoji',
    reaction: reaction,
    timestamp: timestamp
  });
  console.log("Emoji submitted:", reaction);
}

function submitComment() {
  const comment = document.getElementById("commentBox").value;
  const timestamp = new Date().toISOString();
  if (comment.trim() !== "") {
    db.ref('feedback_responses').push({
      type: 'comment',
      comment: comment,
      timestamp: timestamp
    });
    console.log("Comment submitted:", comment);
    document.getElementById("commentBox").value = "";
  }
}
