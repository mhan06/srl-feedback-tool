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

const tableBody = document.querySelector("#feedbackTable tbody");
const rows = [];

db.ref('feedback_responses').on("value", snapshot => {
  tableBody.innerHTML = "";
  rows.length = 0;
  snapshot.forEach(child => {
    const data = child.val();
    const row = [data.type, data.reaction || data.comment, data.timestamp];
    rows.push(row);
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
});

function downloadCSV() {
  let csv = "Type,Reaction/Comment,Timestamp\n";
  rows.forEach(row => {
    csv += row.map(value => `"${value}"`).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "feedback_data.csv";
  a.click();
  URL.revokeObjectURL(url);
}
