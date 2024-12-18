// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const participantCards = document.getElementById('participant-cards');

    const loadParticipants = () => {
        fetch('/participants')
            .then(response => response.json())
            .then(data => {
                participantCards.innerHTML = '';
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
                            <button class="vote-button" onclick="vote(${participant.id})">Vote</button>
                        </div>
                    `;
                    participantCards.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error loading participants:', error);
            });
    };

    // Define the vote function in the global scope
    window.vote = (id) => {
        fetch(`/participants/${id}/vote`, { method: 'PUT' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update vote count');
                }
                console.log(`Vote counted for participant ID: ${id}`);
                loadParticipants(); // Reload to reflect updated votes
            })
            .catch(error => {
                console.error('Error voting:', error);
            });
    };

    loadParticipants();
});
