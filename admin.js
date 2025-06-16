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

const emojiCounts = { happy: 0, neutral: 0, confused: 0, angry: 0 };
const commentByDate = {};

db.ref('feedback_responses').on("value", snapshot => {
  tableBody.innerHTML = "";
  rows.length = 0;

  Object.keys(emojiCounts).forEach(k => emojiCounts[k] = 0);
  for (const k in commentByDate) delete commentByDate[k];

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

    if (data.type === "emoji") {
      if (emojiCounts[data.reaction] !== undefined) emojiCounts[data.reaction]++;
    } else if (data.type === "comment") {
      const date = data.timestamp.split("T")[0];
      commentByDate[date] = (commentByDate[date] || 0) + 1;
    }
  });

  updateCharts();
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

// Chart code
let emojiChart, commentChart;

function updateCharts() {
  const ctx1 = document.getElementById("emojiChart").getContext("2d");
  const ctx2 = document.getElementById("commentChart").getContext("2d");

  if (emojiChart) emojiChart.destroy();
  if (commentChart) commentChart.destroy();

  emojiChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["🙂 Happy", "😐 Neutral", "😕 Confused", "😠 Angry"],
      datasets: [{
        label: "Emoji Reactions",
        data: [
          emojiCounts.happy,
          emojiCounts.neutral,
          emojiCounts.confused,
          emojiCounts.angry
        ],
        backgroundColor: "#6495ED"
      }]
    }
  });

  commentChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: Object.keys(commentByDate),
      datasets: [{
        label: "Comments per Day",
        data: Object.values(commentByDate),
        fill: false,
        borderColor: "#FF6347",
        tension: 0.1
      }]
    }
  });
}
