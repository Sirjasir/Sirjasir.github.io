const saveFeedback = () => {
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value.trim();

  // Lade bestehendes Feedback aus localStorage
  const feedback = JSON.parse(localStorage.getItem('feedbacks') || '[]');

  // Neues Feedback hinzufügen
  feedback.push({ rating: Number(rating), comment, date: new Date().toLocaleString() });

  // Speichern
  localStorage.setItem('feedbacks', JSON.stringify(feedback));

  // Formular zurücksetzen
  document.getElementById('comment').value = '';

  updateChart();
  alert("Danke für dein Feedback!");
};

function updateChart() {
  const feedback = JSON.parse(localStorage.getItem('feedbacks') || '[]');
  const counts = [0,0,0,0,0];
  feedback.forEach(f => counts[f.rating - 1]++);

  const ctx = document.getElementById('feedbackChart').getContext('2d');
  if (window.chartInstance) window.chartInstance.destroy();
  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{
        label: 'Bewertungen',
        data: counts,
        backgroundColor: '#b30000'
      }]
    },
    options: { scales: { y: { beginAtZero: true, precision: 0 } } }
  });

  const list = document.getElementById('commentsList');
  list.innerHTML = feedback
    .filter(f => f.comment)
    .map(f => `<li><b>${f.date}:</b> ${f.comment}</li>`)
    .join('');
}

updateChart();
