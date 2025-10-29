// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyBW7F4lrLQG8-OqLaE9hpXI9QxdTWaThXo",
  authDomain: "ffnfeedback.firebaseapp.com",
  projectId: "ffnfeedback",
  storageBucket: "ffnfeedback.firebasestorage.app",
  messagingSenderId: "469095529693",
  appId: "1:469095529693:web:b8f8a1c24593b67c9e6f34"
  measurementId: "G-CDDM310YEW"
};

// === Firebase initialisieren ===
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function saveFeedback() {
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value.trim();

  if (!rating) return alert("Bitte eine Bewertung auswählen!");

  // anonym speichern
  db.ref('feedbacks').push({
    rating: Number(rating),
    comment: comment,
    timestamp: new Date().toISOString()
  });

  document.getElementById('comment').value = '';
  alert("Danke für dein Feedback!");
}

// === Feedback live laden ===
const feedbackRef = db.ref('feedbacks');
feedbackRef.on('value', (snapshot) => {
  const data = snapshot.val();
  const feedbacks = data ? Object.values(data) : [];
  updateChart(feedbacks);
});

function updateChart(feedbacks) {
  const counts = [0,0,0,0,0];
  feedbacks.forEach(f => counts[f.rating - 1]++);

  const ctx = document.getElementById('feedbackChart').getContext('2d');
  if (window.chartInstance) window.chartInstance.destroy();
  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1','2','3','4','5'],
      datasets: [{
        label: 'Bewertungen',
        data: counts,
        backgroundColor: '#b30000'
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });

  const list = document.getElementById('commentsList');
  list.innerHTML = feedbacks
    .filter(f => f.comment)
    .map(f => `<li>${f.comment}</li>`)
    .join('');
}

