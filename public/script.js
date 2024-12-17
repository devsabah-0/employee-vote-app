// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const participantCards = document.getElementById('participant-cards');

    const loadParticipants = () => {
        fetch('/participants')
            .then(response => response.json())
            .then(data => {
                participantCards.innerHTML = ''; // Clear existing content
                data.forEach(participant => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${participant.imagePath}" alt="${participant.name}" class="employee-pic">
                        <div class="employee-info">
                            <h2 class="employee-name">${participant.name}</h2>
                            <p class="designation">${participant.designation}</p>
                            <p class="department">${participant.department}</p>
                            <p class="review">${participant.review}</p>
                            <button class="vote-button">Vote</button>
                        </div>
                    `;
                    participantCards.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error loading participants:', error);
            });
    };

    loadParticipants();
});
